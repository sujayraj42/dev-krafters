import { NextResponse } from 'next/server';
import { getAllLeadsAsync, saveLeadAsync, clearLeadsAsync, updateLeadAsync } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { sanitizeText, isValidEmail, escapeHtml } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/leads - Retrieve all leads from MongoDB (Admin only)
export async function GET(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required', leads: [], count: 0 },
        { status: 401 }
      );
    }

    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      return NextResponse.json(
        {
          success: false,
          error: 'MONGODB_URI is not configured with valid credentials.',
          leads: [],
          count: 0,
        },
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    const leads = await getAllLeadsAsync();
    const dbName = process.env.MONGODB_DB || 'Dev_Krafters';
    return NextResponse.json(
      { success: true, leads, count: leads.length, dbName },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database fetch failed';
    return NextResponse.json(
      { success: false, error: message, leads: [], count: 0 },
      { status: 500 }
    );
  }
}

// POST /api/leads - Save a new lead (public lead generation endpoint with input validation)
export async function POST(request: Request) {
  try {
    // Rate limit check (5 requests per 60 seconds per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${Math.ceil(
            rateLimit.resetMs / 1000
          )} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot spam check - if filled, silently succeed without storing or notifying
    if (body.website_hp && typeof body.website_hp === 'string' && body.website_hp.trim() !== '') {
      return NextResponse.json({
        success: true,
        message: 'Application received successfully.',
      });
    }

    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const isInternship = body.type === 'internship';
    const isEstimate = body.type === 'estimate';

    // Validation for internship applications
    if (isInternship) {
      if (!rawName) {
        return NextResponse.json(
          { success: false, error: 'Full name is required.' },
          { status: 400 }
        );
      }
      if (!rawEmail || !isValidEmail(rawEmail)) {
        return NextResponse.json(
          { success: false, error: 'A valid email address is required.' },
          { status: 400 }
        );
      }
      if (!rawPhone || rawPhone.replace(/\D/g, '').length < 10) {
        return NextResponse.json(
          { success: false, error: 'A valid 10-digit phone number is required.' },
          { status: 400 }
        );
      }
      if (!body.college || typeof body.college !== 'string' || !body.college.trim()) {
        return NextResponse.json(
          { success: false, error: 'College / University name is required.' },
          { status: 400 }
        );
      }
      if (!body.degree || typeof body.degree !== 'string' || !body.degree.trim()) {
        return NextResponse.json(
          { success: false, error: 'Degree and Graduation year is required.' },
          { status: 400 }
        );
      }
      if (!body.skillLevel || !['Beginner', 'Intermediate', 'Advanced'].includes(body.skillLevel)) {
        return NextResponse.json(
          { success: false, error: 'Please select your current skill level.' },
          { status: 400 }
        );
      }
      if (!body.whyJoin || typeof body.whyJoin !== 'string' || !body.whyJoin.trim()) {
        return NextResponse.json(
          { success: false, error: 'Please explain why you want to join (max 500 characters).' },
          { status: 400 }
        );
      }
      if (body.whyJoin.trim().length > 500) {
        return NextResponse.json(
          { success: false, error: 'Statement cannot exceed 500 characters.' },
          { status: 400 }
        );
      }
    } else {
      if (!rawEmail && !rawName && !rawPhone && !isEstimate) {
        return NextResponse.json(
          { success: false, error: 'At least one contact identifier (email, phone, or name) is required' },
          { status: 400 }
        );
      }

      if (rawEmail && !isValidEmail(rawEmail)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid email address.' },
          { status: 400 }
        );
      }
    }

    const cleanName = sanitizeText(rawName || (isEstimate ? 'Visitor (Saved Estimate)' : 'Anonymous Lead'), 100);
    const cleanEmail = rawEmail ? sanitizeText(rawEmail, 150) : undefined;
    const cleanPhone = rawPhone ? sanitizeText(rawPhone, 30) : undefined;
    const cleanCollege = body.college ? sanitizeText(body.college, 150) : undefined;
    const cleanDegree = body.degree ? sanitizeText(body.degree, 100) : undefined;
    const cleanSkillLevel = body.skillLevel ? sanitizeText(body.skillLevel, 50) : undefined;
    const cleanGithub = body.github ? sanitizeText(body.github, 255) : undefined;
    const cleanLinkedin = body.linkedin ? sanitizeText(body.linkedin, 255) : undefined;
    const cleanWhyJoin = body.whyJoin ? sanitizeText(body.whyJoin, 600) : undefined;

    const allowedTypes = ['contact', 'newsletter', 'estimate', 'chatbot', 'internship'];
    const type = allowedTypes.includes(body.type) ? body.type : 'contact';

    // Persist to MongoDB database
    let savedRecord;
    try {
      savedRecord = await saveLeadAsync({
        type,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        college: cleanCollege,
        degree: cleanDegree,
        skillLevel: cleanSkillLevel,
        github: cleanGithub,
        linkedin: cleanLinkedin,
        whyJoin: cleanWhyJoin,
        projectType: isInternship ? 'Winter Internship 2026' : sanitizeText(body.projectType || '', 100),
        pages: typeof body.pages === 'number' ? Math.min(Math.max(body.pages, 1), 100) : undefined,
        budget: isInternship ? 'Free / Sponsored' : sanitizeText(body.budget || '', 100),
        totalEstimateFormatted: sanitizeText(body.totalEstimateFormatted || '', 50),
        totalEstimateInr: typeof body.totalEstimateInr === 'number' ? body.totalEstimateInr : undefined,
        message: cleanWhyJoin || sanitizeText(body.message || '', 2000),
        status: 'new',
        notes: isInternship ? `College: ${cleanCollege} | Degree: ${cleanDegree} | Skill: ${cleanSkillLevel}` : sanitizeText(body.notes || '', 1000),
        date: typeof body.date === 'string' ? body.date : new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error('Failed to save to MongoDB:', dbErr);
      // Fallback: If DB is unreachable, create an ephemeral record so the application doesn't fail
      savedRecord = {
        id: 'offline-' + Date.now(),
        type,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        date: new Date().toISOString(),
      };
    }

    // Trigger email notification if Resend API key is available
    const apiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'hello@devkrafters.com';
    const isApiKeySet = apiKey && apiKey !== 're_your_resend_api_key_here';

    if (isApiKeySet && isInternship && cleanEmail) {
      try {
        const resend = new Resend(apiKey);

        // 1. Alert Team
        await resend.emails.send({
          from: 'Dev Krafters Internships <onboarding@resend.dev>',
          to: receiverEmail,
          replyTo: cleanEmail,
          subject: `Winter Internship Application: ${cleanName} (${cleanDegree})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F4C4C; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
              <h2 style="color: #0F4C4C; border-bottom: 2px solid #E85A3C; padding-bottom: 12px; margin-top: 0;">
                New Winter Internship Application 🚀
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px;">Applicant Name:</td>
                  <td style="padding: 8px 0;">${escapeHtml(cleanName)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color: #E85A3C;">${escapeHtml(cleanEmail)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td>
                  <td style="padding: 8px 0;">${escapeHtml(cleanPhone || 'N/A')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">College:</td>
                  <td style="padding: 8px 0;">${escapeHtml(cleanCollege || 'N/A')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Degree & Year:</td>
                  <td style="padding: 8px 0;">${escapeHtml(cleanDegree || 'N/A')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Skill Level:</td>
                  <td style="padding: 8px 0;">${escapeHtml(cleanSkillLevel || 'N/A')}</td>
                </tr>
                ${cleanGithub ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">GitHub:</td>
                  <td style="padding: 8px 0;"><a href="${escapeHtml(cleanGithub)}" target="_blank" style="color: #0F4C4C;">${escapeHtml(cleanGithub)}</a></td>
                </tr>` : ''}
                ${cleanLinkedin ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">LinkedIn:</td>
                  <td style="padding: 8px 0;"><a href="${escapeHtml(cleanLinkedin)}" target="_blank" style="color: #0F4C4C;">${escapeHtml(cleanLinkedin)}</a></td>
                </tr>` : ''}
              </table>
              <div style="background-color: #F7F9F9; border-left: 4px solid #E85A3C; padding: 16px; border-radius: 4px; margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #0F4C4C;">Why should we select you?</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #5C6B6B;">${escapeHtml(cleanWhyJoin || '')}</p>
              </div>
            </div>
          `,
        });

        // 2. Confirmation to Applicant
        await resend.emails.send({
          from: 'Dev Krafters <onboarding@resend.dev>',
          to: cleanEmail,
          subject: 'Application Received — Dev Krafters Winter Internship 2026',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F4C4C; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
              <h2 style="color: #0F4C4C; margin-top: 0;">Hi ${escapeHtml(cleanName)},</h2>
              <p style="font-size: 15px; color: #374151; line-height: 1.6;">
                Thank you for applying to the <strong>Dev Krafters Winter Internship 2026 (Full-Stack Web Development)</strong>!
              </p>
              <div style="background-color: #F7F9F9; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: #0F4C4C;">Next Steps in the Selection Process:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4B5563; line-height: 1.6;">
                  <li>Our engineering team will review your application and profile details.</li>
                  <li>Shortlisted candidates will receive a short coding & logical task via email within 48 hours.</li>
                  <li>Selected cohort members will be onboarded on December 15, 2026.</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #6B7280;">
                Best regards,<br />
                <strong>Dev Krafters Engineering Team</strong>
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to dispatch internship notification emails:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully.',
      lead: savedRecord,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/leads - Update lead status or notes (Admin only)
export async function PATCH(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid Lead ID is required' }, { status: 400 });
    }

    const sanitizedStatus = status ? sanitizeText(status, 50) : undefined;
    const sanitizedNotes = notes !== undefined ? sanitizeText(notes, 2000) : undefined;

    const updated = await updateLeadAsync(id, {
      status: sanitizedStatus,
      notes: sanitizedNotes,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update lead';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/leads - Clear leads database (Admin only)
export async function DELETE(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    await clearLeadsAsync();
    return NextResponse.json({ success: true, message: 'Leads database cleared successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear leads database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
