import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (5 requests / 60 seconds per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many health check requests. Please wait ${Math.ceil(
            rateLimit.resetMs / 1000
          )} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 2. Extract & Normalize URL
    const body = await request.json();
    let { url } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Please enter a valid website URL.' },
        { status: 400 }
      );
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a domain like example.com or https://example.com' },
        { status: 400 }
      );
    }

    const targetUrl = parsedUrl.toString();

    // 3. Server-side Fetch Target Website HTML
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    let response: Response;
    let html = '';

    try {
      response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DevKraftersHealthCheck/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      });
      clearTimeout(timeoutId);
      html = await response.text();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const errorMessage = isAbort
        ? `Request timed out connecting to ${parsedUrl.hostname}. The site may be slow or blocking automated checks.`
        : `Could not reach ${parsedUrl.hostname}. Please verify the website URL is active and accessible.`;

      return NextResponse.json({ error: errorMessage }, { status: 422 });
    }

    const fetchTimeMs = Date.now() - startTime;

    if (!response.ok && response.status >= 400) {
      return NextResponse.json(
        {
          error: `Website returned status HTTP ${response.status} (${response.statusText || 'Error'}). Please make sure the URL is public and live.`,
        },
        { status: 422 }
      );
    }

    // 4. Run Heuristic Checks on Raw HTML / Response
    const lowerHtml = html.toLowerCase();

    // Check A: Mobile-friendly (viewport meta tag)
    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

    // Check B: SEO Basics
    const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
    const hasMetaDescription =
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i.test(html) ||
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i.test(html);
    const hasH1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.test(html);

    const seoPassCount = (hasTitle ? 1 : 0) + (hasMetaDescription ? 1 : 0) + (hasH1 ? 1 : 0);
    const seoBasicsPass = seoPassCount >= 2;

    // Check C: Page Speed Proxy
    let speedStatus: 'fast' | 'moderate' | 'slow' = 'fast';
    let speedScore = 2;
    if (fetchTimeMs <= 1500) {
      speedStatus = 'fast';
      speedScore = 2;
    } else if (fetchTimeMs <= 3000) {
      speedStatus = 'moderate';
      speedScore = 1;
    } else {
      speedStatus = 'slow';
      speedScore = 0;
    }

    // Check D: Modern Design Signals
    const isHttps = parsedUrl.protocol === 'https:';
    const hasModernDoctype = lowerHtml.startsWith('<!doctype html');
    const modernSignalsPass = isHttps && hasViewport && (hasModernDoctype || lowerHtml.includes('<html'));

    // 5. Compute Weighted Overall Score (out of 10)
    // - Mobile Viewport: 2 points
    // - HTTPS: 2 points
    // - SEO Title: 2 points
    // - SEO Meta Desc & H1: 2 points (1 point each)
    // - Page Speed Proxy: 2 points max (2 for fast, 1 for moderate, 0 for slow)
    let score = 0;
    if (hasViewport) score += 2;
    if (isHttps) score += 2;
    if (hasTitle) score += 2;
    if (hasMetaDescription) score += 1;
    if (hasH1) score += 1;
    score += speedScore;

    // Clamp score 0 to 10
    score = Math.max(0, Math.min(10, score));

    // 6. Generate AI Summary using Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    const isGeminiKeySet = apiKey && apiKey !== 'your_gemini_api_key_here';

    const findingsData = {
      url: targetUrl,
      score: `${score}/10`,
      mobileFriendlyViewport: hasViewport ? 'Present' : 'Missing',
      httpsSecured: isHttps ? 'Yes (HTTPS)' : 'No (HTTP only)',
      fetchResponseTimeMs: `${fetchTimeMs}ms (${speedStatus})`,
      seoTitleTag: hasTitle ? 'Found' : 'Missing',
      seoMetaDescriptionTag: hasMetaDescription ? 'Found' : 'Missing',
      seoH1Tag: hasH1 ? 'Found' : 'Missing',
      modernHtmlDoctype: hasModernDoctype ? 'Found' : 'Missing',
    };

    let aiSummary = '';

    if (isGeminiKeySet) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a helpful web development expert at Dev Krafters auditing a small business website.
Given these audit findings for "${targetUrl}":
- Score: ${findingsData.score}
- Mobile Viewport: ${findingsData.mobileFriendlyViewport}
- Security: ${findingsData.httpsSecured}
- Server Speed Estimate: ${findingsData.fetchResponseTimeMs}
- SEO Title: ${findingsData.seoTitleTag}
- SEO Description: ${findingsData.seoMetaDescriptionTag}
- H1 Heading: ${findingsData.seoH1Tag}
- Modern HTML Doctype: ${findingsData.modernHtmlDoctype}

Write a 2-3 sentence plain-English summary for the small business owner. Highlight the biggest missing features or issues found and explain what fixing them would mean for their business (e.g. more Google traffic, better mobile conversions, faster load speed). Keep the tone encouraging, helpful, non-alarmist, and clear for a non-technical reader. Do not use bullet points or code blocks.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            maxOutputTokens: 250,
            temperature: 0.7,
          },
        });

        aiSummary = response.text?.trim() || '';
      } catch (geminiErr) {
        console.error('[Health Check Gemini Error]', geminiErr);
      }
    }

    // Heuristic Fallback Summary if Gemini key isn't available or fails
    if (!aiSummary) {
      const issues: string[] = [];
      if (!hasViewport) issues.push('mobile responsiveness setup');
      if (!isHttps) issues.push('HTTPS security encryption');
      if (!hasMetaDescription || !hasTitle) issues.push('basic search engine optimization tags');
      if (speedStatus === 'slow') issues.push('server response latency');

      if (issues.length === 0) {
        aiSummary = `Your website performs well on basic automated metrics with a solid ${score}/10 score! To further boost sales and customer engagement, consider adding modern AI features like an instant chatbot, faster asset delivery, and targeted local SEO.`;
      } else {
        aiSummary = `Your website scored ${score}/10, indicating room for improvement in key areas like ${issues.join(
          ', '
        )}. Resolving these essential elements will significantly improve your Google search visibility, mobile visitor experience, and customer conversions.`;
      }
    }

    // 7. Structure & Return Audit Payload
    return NextResponse.json({
      url: targetUrl,
      score,
      maxScore: 10,
      fetchTimeMs,
      checks: {
        mobileFriendly: {
          pass: hasViewport,
          label: 'Mobile-Friendly',
          statusText: hasViewport ? 'Viewport meta tag detected' : 'Missing viewport tag (may render poorly on phones)',
        },
        pageSpeed: {
          pass: speedStatus !== 'slow',
          status: speedStatus,
          timeMs: fetchTimeMs,
          label: 'Page Speed Estimate',
          statusText:
            speedStatus === 'fast'
              ? `Fast response time (${fetchTimeMs}ms)`
              : speedStatus === 'moderate'
              ? `Moderate response time (${fetchTimeMs}ms)`
              : `Slow server response (${fetchTimeMs}ms)`,
        },
        seoBasics: {
          pass: seoBasicsPass,
          hasTitle,
          hasDescription: hasMetaDescription,
          hasH1,
          label: 'SEO Basics',
          statusText:
            seoPassCount === 3
              ? 'Title, Meta Description, and H1 header found'
              : `${seoPassCount}/3 key SEO elements detected (${!hasTitle ? 'missing Title' : ''}${
                  !hasMetaDescription ? ' missing Meta Description' : ''
                }${!hasH1 ? ' missing H1' : ''})`.trim(),
        },
        modernSignals: {
          pass: modernSignalsPass,
          hasHttps: isHttps,
          hasViewport,
          hasDoctype: hasModernDoctype,
          label: 'Modern Design Signals',
          statusText: `${isHttps ? 'HTTPS secure' : 'Insecure HTTP'}, ${
            hasModernDoctype ? 'modern HTML5 doctype' : 'legacy doctype'
          }`,
        },
      },
      summary: aiSummary,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Health Check API Error]', errMessage);

    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing the website. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}
