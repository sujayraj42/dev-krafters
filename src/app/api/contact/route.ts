import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Rate limit check (5 requests per 60 seconds per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${Math.ceil(
            rateLimit.resetMs / 1000
          )} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, businessType, projectType, message } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Project description message is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'hello@devkrafters.com';
    const isApiKeySet = apiKey && apiKey !== 're_your_resend_api_key_here';

    if (isApiKeySet) {
      const resend = new Resend(apiKey);
      const formattedSubject = `New inquiry from ${name.trim()} — ${projectType || 'General'}`;

      // 1. Send Email to Site Owner
      await resend.emails.send({
        from: 'Dev Krafters Contact <onboarding@resend.dev>',
        to: receiverEmail,
        replyTo: email.trim(),
        subject: formattedSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F4C4C; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h2 style="color: #0F4C4C; border-bottom: 2px solid #E85A3C; padding-bottom: 12px; margin-top: 0;">
              New Website Inquiry Received
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">Client Name:</td>
                <td style="padding: 8px 0;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Client Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email.trim()}" style="color: #E85A3C;">${email.trim()}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px 0;">${phone.trim()}</td>
              </tr>` : ''}
              ${businessType ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Business Type:</td>
                <td style="padding: 8px 0;">${businessType}</td>
              </tr>` : ''}
              ${projectType ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Project Package:</td>
                <td style="padding: 8px 0;">${projectType}</td>
              </tr>` : ''}
            </table>
            
            <div style="background-color: #F7F9F9; border-left: 4px solid #E85A3C; padding: 16px; border-radius: 4px; margin-top: 16px;">
              <h4 style="margin: 0 0 8px 0; color: #0F4C4C;">Message Details:</h4>
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #5C6B6B;">${message.trim()}</p>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; text-align: center;">
              Dev Krafters Contact System — Patna, Bihar
            </p>
          </div>
        `,
      });

      // 2. Send Auto-Reply Confirmation Email to Submitter
      await resend.emails.send({
        from: 'Dev Krafters <onboarding@resend.dev>',
        to: email.trim(),
        subject: 'Thanks for reaching out to Dev Krafters!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F4C4C; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h2 style="color: #0F4C4C; margin-top: 0;">Hi ${name.trim()},</h2>
            <p style="font-size: 15px; color: #374151; leading-height: 1.6;">
              Thanks for reaching out — we've received your project inquiry and will get back to you within 24 hours.
            </p>
            <div style="background-color: #F7F9F9; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #5C6B6B;">
                <strong>Selected Package / Service:</strong> ${projectType || 'General Inquiry'}
              </p>
            </div>
            <p style="font-size: 14px; color: #374151;">
              Warm regards,<br />
              <strong>Dev Krafters Studio</strong><br />
              <a href="mailto:hello@devkrafters.com" style="color: #E85A3C;">hello@devkrafters.com</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, mode: 'live' });
    } else {
      // Demo / Local Mode logging when RESEND_API_KEY is placeholder
      console.log('===================================================');
      console.log('[Dev Krafters Contact API] Demo Mode Submission:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone);
      console.log('Business Type:', businessType);
      console.log('Project Package:', projectType);
      console.log('Message:', message);
      console.log('NOTE: Configure RESEND_API_KEY in .env.local to dispatch live emails.');
      console.log('===================================================');

      return NextResponse.json({
        success: true,
        mode: 'demo',
        message: 'Submission received in local demo mode. Configure RESEND_API_KEY for live delivery.',
      });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[Contact API Error]', errMessage);

    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again or email hello@devkrafters.com directly.' },
      { status: 500 }
    );
  }
}
