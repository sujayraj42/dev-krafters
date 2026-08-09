import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `
You are the helpful AI assistant for Dev Krafters — a web development studio specializing in affordable, fast, AI-powered websites and digital tools for small and local businesses (clinics, salons, restaurants, shops, and service professionals).

Key Studio Info:
- Studio Name: Dev Krafters
- Tagline: Affordable AI-powered websites for local businesses.
- Core Advantages: Direct access (work directly with the developer, no account managers), AI-assisted speed (fast turnaround without cutting corners), transparent fixed pricing (no surprise items), and post-launch support.

Fixed Package Pricing:
1. Starter Page (₹5,000): 1 page template site, mobile responsive, contact form, 3-day delivery.
2. Landing Page (₹9,000): Up to 3 sections (Hero, About, Services/Contact), custom design, basic SEO, 5-day delivery.
3. Business Website (₹25,000 - Most Popular): 5–8 pages, custom design, contact form + Google Maps embed, basic SEO, Google Business Profile guidance, 10-day delivery, 15 days free bug fixes.
4. E-commerce Site (₹75,000): Up to 30 products, payment gateway (Razorpay/Stripe), cart & checkout, order dashboard, 20-day delivery, 30 days free bug fixes.
5. Maintenance & Support (₹3,000/mo): Security & dependency updates, uptime monitoring, monthly backups, up to 2 hours of content updates/mo.

What is NOT Included (billed separately): Domain registration, hosting costs, premium plugins, copywriting, stock photo licensing, 3rd-party API token costs.

Available Services: Business Websites, E-commerce, Database & Backend Setup (Supabase/PostgreSQL), SEO, AI Chatbots, Branding, Maintenance.
Upcoming Services (Coming Soon): Workflow Automation (n8n), Custom Web Apps, AI Integrations, API Integrations.

Guidelines:
1. Keep your answers brief, polite, and conversational (max 2-3 short paragraphs).
2. Avoid complex technical jargon (do not use terms like "headless CMS" or "serverless architecture").
3. Always provide accurate pricing from the spec. Never hallucinate fake discounts or custom prices.
4. Encourage visitors to start a project by visiting the Contact page (/contact).
5. If a visitor asks off-topic questions (e.g. weather, sports, general coding help), politely redirect them back to Dev Krafters' web design & AI services.
6. If the visitor expresses direct interest in starting a project, ask for their Name and Email or Phone number so our team can follow up directly.
`;

function getLocalFallbackReply(lastUserMessage: string): string {
  const query = lastUserMessage.toLowerCase();

  if (query.includes('price') || query.includes('cost') || query.includes('package') || query.includes('rate') || query.includes('how much')) {
    return "Our fixed pricing packages start at ₹5,000 for a Starter Page, ₹9,000 for a Landing Page, ₹25,000 for a Business Website (5-8 pages), and ₹75,000 for an E-commerce Site. Monthly maintenance is ₹3,000/mo. You can view all package details on our /pricing page or start a project at /contact!";
  } else if (query.includes('service') || query.includes('build') || query.includes('bot') || query.includes('seo') || query.includes('what do you do')) {
    return "We offer custom Business Websites, E-commerce Stores, Database & Backend Setup, SEO, AI Chatbots, Branding, and Maintenance. Check out our full offerings on the /services page!";
  } else if (query.includes('contact') || query.includes('quote') || query.includes('hire') || query.includes('start') || query.includes('book') || query.includes('call')) {
    return "Awesome! The best way to get started is by visiting our Contact page (/contact) or booking a call. You can also share your name and email right here, and we'll reach out within 24 hours!";
  } else if (query.includes('health') || query.includes('score') || query.includes('audit')) {
    return "You can use our free Website Health Check tool on the home page! Just paste your website URL to instantly scan mobile responsiveness, SEO basics, page speed, and security.";
  } else {
    return "Hi there! I'm Dev Krafters' AI assistant. I can help you with details about our web design services, fixed pricing packages, and launch timelines. How can I help your business today?";
  }
}

export async function POST(request: Request) {
  // Step 1: Log incoming request to verify API route is hit
  console.log('[Chat API Route] POST /api/chat request received at', new Date().toISOString());

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn('[Chat API Route] Warning: Missing or invalid messages array in payload');
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.GEMINI_API_KEY;
    const isGeminiKeySet = apiKey && apiKey !== 'your_gemini_api_key_here';

    // Step 2 & 3: Check API key and model name
    console.log('[Chat API Route] Gemini API key status:', isGeminiKeySet ? 'SET' : 'NOT SET');

    let botReply = '';

    if (isGeminiKeySet) {
      try {
        console.log('[Chat API Route] Attempting Gemini API call with model: gemini-2.0-flash');
        const ai = new GoogleGenAI({ apiKey });

        const formattedContents = [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: "Understood! I am Dev Krafters' official AI assistant. I will provide accurate pricing, services, and redirect visitors to start a project at /contact." }] },
          ...messages.slice(-8).map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash', // Correct, standard model name for Google GenAI SDK
          contents: formattedContents,
          config: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        });

        botReply = response.text || '';
        console.log('[Chat API Route] Gemini API response generated successfully');
      } catch (geminiError: unknown) {
        // Step 4: Log exact Gemini error object to server console
        console.error('=================== [GEMINI API ERROR LOG] ===================');
        console.error('Gemini API call failed with error:', geminiError);
        if (geminiError instanceof Error) {
          console.error('Error message:', geminiError.message);
          console.error('Error stack:', geminiError.stack);
        }
        console.error('Falling back to built-in free rule-based engine to keep chatbot functional.');
        console.error('==============================================================');

        botReply = getLocalFallbackReply(lastUserMessage);
      }
    } else {
      console.log('[Chat API Route] GEMINI_API_KEY is not configured. Using free local rule engine.');
      botReply = getLocalFallbackReply(lastUserMessage);
    }

    if (!botReply) {
      botReply = getLocalFallbackReply(lastUserMessage);
    }

    // Lead Intent Detection & Email Notification
    const leadEmailMatch = lastUserMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const resendApiKey = process.env.RESEND_API_KEY;

    if (leadEmailMatch) {
      try {
        const { saveLeadAsync } = await import('@/lib/db');
        await saveLeadAsync({
          type: 'chatbot',
          name: 'Chatbot Lead',
          email: leadEmailMatch[0],
          message: lastUserMessage,
          projectType: 'Captured via AI Chatbot',
        });
      } catch (dbErr) {
        console.error('[Chatbot Lead DB Save Error]', dbErr);
      }

      if (resendApiKey && resendApiKey.startsWith('re_')) {
        try {
          const resend = new Resend(resendApiKey);
          const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'hello@devkrafters.com';

          await resend.emails.send({
            from: 'Dev Krafters Chatbot <onboarding@resend.dev>',
            to: receiver,
            subject: `New Lead Captured via AI Chatbot: ${leadEmailMatch[0]}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #0F4C4C;">
                <h2>New Lead Captured via Floating AI Chatbot</h2>
                <p><strong>Captured Email:</strong> ${leadEmailMatch[0]}</p>
                <p><strong>Full User Message:</strong> ${lastUserMessage}</p>
              </div>
            `,
          });
        } catch (e) {
          console.error('[Chatbot Resend Lead Dispatch Error]', e);
        }
      }
    }

    return NextResponse.json({ reply: botReply });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Chat API Route Fatal Error]', errMessage, error);

    // Step 5: Return fallback reply so user always gets a response instead of silence
    return NextResponse.json({
      reply: "Hi there! I'm Dev Krafters' AI assistant. You can check our fixed package pricing on the /pricing page or start a project at /contact!",
    });
  }
}
