import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateUrlForSsrf } from '@/lib/ssrf';

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

    // 2b. Validate against Server-Side Request Forgery (SSRF)
    const ssrfError = await validateUrlForSsrf(targetUrl);
    if (ssrfError) {
      return NextResponse.json({ error: ssrfError }, { status: 400 });
    }

    // 3. Server-side Fetch Target Website HTML
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    let response: Response;
    let html = '';

    try {
      let currentUrl = targetUrl;
      let redirectCount = 0;
      const maxRedirects = 5;

      while (true) {
        response = await fetch(currentUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DevKraftersHealthCheck/1.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'manual',
        });

        // Check for HTTP redirects
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get('location');
          if (!location) {
            break;
          }
          redirectCount++;
          if (redirectCount > maxRedirects) {
            clearTimeout(timeoutId);
            return NextResponse.json(
              { error: 'Too many redirects encountered while inspecting website.' },
              { status: 422 }
            );
          }

          const redirectUrl = new URL(location, currentUrl).toString();
          const redirectSsrfError = await validateUrlForSsrf(redirectUrl);
          if (redirectSsrfError) {
            clearTimeout(timeoutId);
            return NextResponse.json(
              { error: `Redirect to restricted destination blocked: ${redirectSsrfError}` },
              { status: 400 }
            );
          }
          currentUrl = redirectUrl;
          parsedUrl = new URL(currentUrl);
        } else {
          break;
        }
      }

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

    // 4. Run Genuine 8-Parameter Inspection on HTML & Response
    const lowerHtml = html.toLowerCase();

    // Parameter 1: Mobile Viewport
    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

    // Parameter 2: SSL / HTTPS Security Encryption
    const isHttps = parsedUrl.protocol === 'https:';

    // Parameter 3: Page Load Speed
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

    // Parameter 4: Title Tag
    const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);

    // Parameter 5: Meta Description Tag
    const hasMetaDescription =
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i.test(html) ||
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i.test(html);

    // Parameter 6: Main H1 Heading Tag
    const hasH1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.test(html);

    // Parameter 7: Modern HTML5 Doctype
    const hasModernDoctype = lowerHtml.startsWith('<!doctype html');

    // Parameter 8: OpenGraph Social Sharing Meta Tags
    const hasOpenGraph = /<meta[^>]*property=["']og:/i.test(html) || /<meta[^>]*name=["']og:/i.test(html);

    // 5. Compute Weighted Overall Score out of 10
    let score = 0;
    if (hasViewport) score += 1.5;
    if (isHttps) score += 1.5;
    if (speedStatus === 'fast') score += 1.5; else if (speedStatus === 'moderate') score += 1;
    if (hasTitle) score += 1.5;
    if (hasMetaDescription) score += 1;
    if (hasH1) score += 1;
    if (hasModernDoctype) score += 1;
    if (hasOpenGraph) score += 1;

    score = Math.min(10, Math.max(1, Math.round(score * 10) / 10));

    // 6. Generate AI Summary using Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    const isGeminiKeySet = apiKey && apiKey !== 'your_gemini_api_key_here';

    const findingsData = {
      url: targetUrl,
      score: `${score}/10`,
      mobileViewport: hasViewport ? 'Present' : 'Missing',
      https: isHttps ? 'HTTPS Secure' : 'Insecure HTTP',
      speed: `${fetchTimeMs}ms (${speedStatus})`,
      title: hasTitle ? 'Found' : 'Missing',
      metaDesc: hasMetaDescription ? 'Found' : 'Missing',
      h1: hasH1 ? 'Found' : 'Missing',
      doctype: hasModernDoctype ? 'HTML5 Doctype' : 'Legacy Doctype',
      openGraph: hasOpenGraph ? 'Present' : 'Missing',
    };

    let aiSummary = '';

    if (isGeminiKeySet) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a helpful web development expert at Dev Krafters auditing a small business website.
Given these audit findings for "${targetUrl}":
- Score: ${findingsData.score}
- Mobile Viewport: ${findingsData.mobileViewport}
- Security: ${findingsData.https}
- Server Speed: ${findingsData.speed}
- SEO Title: ${findingsData.title}
- SEO Meta Description: ${findingsData.metaDesc}
- H1 Heading: ${findingsData.h1}
- HTML5 Doctype: ${findingsData.doctype}
- OpenGraph Social Tags: ${findingsData.openGraph}

Write a 2-3 sentence plain-English summary for the business owner. Highlight missing features and explain what fixing them means for their Google traffic and sales. Keep it clear, non-technical, encouraging, and actionable. Do not use bullet points or code.`;

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

    if (!aiSummary) {
      const issues: string[] = [];
      if (!hasViewport) issues.push('mobile responsiveness');
      if (!isHttps) issues.push('HTTPS encryption');
      if (!hasMetaDescription || !hasTitle) issues.push('Google search meta tags');
      if (speedStatus === 'slow') issues.push('page load latency');
      if (!hasOpenGraph) issues.push('social media previews');

      if (issues.length === 0) {
        aiSummary = `Great job! Your website scored ${score}/10 on our 8-parameter health check. To double your leads, consider adding custom AI booking widgets and local SEO optimizations.`;
      } else {
        aiSummary = `Your website scored ${score}/10, with room for improvement in ${issues.slice(0, 3).join(', ')}. Fixing these will significantly boost your Google ranking and customer conversion rate.`;
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
          label: 'Mobile Responsiveness',
          statusText: hasViewport ? 'Viewport tag detected (Renders properly on mobile)' : 'Missing viewport meta tag (Renders broken on mobile)',
        },
        https: {
          pass: isHttps,
          label: 'SSL Security & HTTPS',
          statusText: isHttps ? 'Encrypted via HTTPS certificate' : 'Insecure HTTP (Browser shows Not Secure warning)',
        },
        pageSpeed: {
          pass: speedStatus !== 'slow',
          status: speedStatus,
          timeMs: fetchTimeMs,
          label: 'Server Load Speed',
          statusText: speedStatus === 'fast' ? `Fast response (${fetchTimeMs}ms)` : speedStatus === 'moderate' ? `Moderate response (${fetchTimeMs}ms)` : `Slow response (${fetchTimeMs}ms)`,
        },
        title: {
          pass: hasTitle,
          label: 'Google Title Tag',
          statusText: hasTitle ? 'HTML Title tag found for Google Search' : 'Missing <title> tag (Invisble in Google search results)',
        },
        metaDescription: {
          pass: hasMetaDescription,
          label: 'Meta Description Tag',
          statusText: hasMetaDescription ? 'Meta description tag found' : 'Missing meta description (No snippet preview in Google)',
        },
        h1Heading: {
          pass: hasH1,
          label: 'H1 Main Heading',
          statusText: hasH1 ? 'Main <h1> heading found' : 'Missing <h1> tag (Hard for Google to index main topic)',
        },
        html5Doctype: {
          pass: hasModernDoctype,
          label: 'HTML5 Modern Code Standard',
          statusText: hasModernDoctype ? 'Modern <!DOCTYPE html> tag' : 'Legacy / Non-standard DOCTYPE structure',
        },
        openGraph: {
          pass: hasOpenGraph,
          label: 'Social Media Card Tags',
          statusText: hasOpenGraph ? 'OpenGraph meta tags found' : 'Missing og:tags (WhatsApp & Facebook previews look plain)',
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
