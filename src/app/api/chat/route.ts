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

  if (query.includes('price') || query.includes('cost') || query.includes('package') || query.includes('rate') || query.includes('how much') || query.includes('fee')) {
    return "Our fixed pricing packages are:\n\n• **Starter Page (₹5,000)**: 1-page site, 3-day delivery\n• **Landing Page (₹9,000)**: Custom design, basic SEO, 5-day delivery\n• **Business Website (₹25,000)**: 5–8 pages, Maps, SEO, 10-day delivery (Most Popular)\n• **E-commerce Store (₹75,000)**: Up to 30 products, Razorpay/Stripe, 20-day delivery\n\nCheck full details on our /pricing page or start your project at /contact!";
  } else if (query.includes('service') || query.includes('build') || query.includes('bot') || query.includes('seo') || query.includes('what do you do') || query.includes('offer')) {
    return "We specialize in custom Business Websites, E-Commerce Stores, Database & Backend Setup, SEO Optimization, AI Chatbots, Branding, and Ongoing Maintenance (₹3,000/mo). Explore all options on /services!";
  } else if (query.includes('time') || query.includes('duration') || query.includes('how long') || query.includes('days') || query.includes('delivery')) {
    return "Our turnaround times are super fast:\n• Starter Page: 3 Days\n• Landing Page: 5 Days\n• Business Website: 10 Days\n• E-Commerce Store: 20 Days\n\nWe work directly with you to launch quickly without cutting corners!";
  } else if (query.includes('contact') || query.includes('quote') || query.includes('hire') || query.includes('start') || query.includes('book') || query.includes('call') || query.includes('phone') || query.includes('email') || query.includes('reach')) {
    return "Awesome! You can share your name and email right here in this chat, or visit our /contact page to request a callback. We reply within 24 hours!";
  } else if (query.includes('health') || query.includes('score') || query.includes('audit') || query.includes('check')) {
    return "Try our free Website Health Check tool on our home page! It scans mobile responsiveness, SSL security, page speed, and SEO in 5 seconds.";
  } else if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('namaste')) {
    return "Hello! 👋 I'm Dev Krafters' AI assistant. How can I help you today? Ask me about website packages, timelines, custom features, or getting a quote!";
  } else if (query.includes('thanks') || query.includes('thank') || query.includes('ok') || query.includes('okay') || query.includes('great') || query.includes('cool')) {
    return "You're very welcome! If you're ready to get your business online or have any other questions, feel free to ask or head over to our /contact page!";
  } else {
    return "Thanks for your question! We build fast, high-converting websites starting at ₹5,000. Would you like details on our popular ₹25,000 Business Package, or would you like to request a custom quote at /contact?";
  }
}

export async function POST(request: Request) {
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

    let botReply = '';

    if (isGeminiKeySet) {
      try {
        console.log('[Chat API Route] Attempting Gemini API call with model: gemini-2.0-flash');
        const ai = new GoogleGenAI({ apiKey });

        // Filter out initial welcome message from assistant to ensure strict user/model role alternation
        const chatHistory = messages.filter((m, idx) => !(idx === 0 && m.role === 'assistant'));

        // Map messages into Gemini API contents structure
        const formattedContents = chatHistory.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        });

        botReply = response.text || '';
        console.log('[Chat API Route] Gemini API response generated successfully');
      } catch (geminiError: unknown) {
        console.error('=================== [GEMINI API ERROR LOG] ===================');
        console.error('Gemini API call failed with error:', geminiError);
        if (geminiError instanceof Error) {
          console.error('Error message:', geminiError.message);
        }
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
