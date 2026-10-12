import { NextResponse } from 'next/server';
import { getAllLeadsAsync, saveLeadAsync, clearLeadsAsync, updateLeadAsync } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { sanitizeText, isValidEmail } from '@/lib/sanitize';

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
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      return NextResponse.json(
        { success: false, error: 'Database service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';

    const isEstimate = body.type === 'estimate';
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

    const allowedTypes = ['contact', 'newsletter', 'estimate', 'chatbot'];
    const type = allowedTypes.includes(body.type) ? body.type : 'contact';

    const defaultName = isEstimate ? 'Visitor (Saved Estimate)' : 'Anonymous Lead';

    const savedRecord = await saveLeadAsync({
      type,
      name: sanitizeText(rawName || defaultName, 100),
      email: rawEmail ? sanitizeText(rawEmail, 150) : undefined,
      phone: rawPhone ? sanitizeText(rawPhone, 30) : undefined,
      projectType: sanitizeText(body.projectType || '', 100),
      pages: typeof body.pages === 'number' ? Math.min(Math.max(body.pages, 1), 100) : undefined,
      budget: sanitizeText(body.budget || '', 100),
      totalEstimateFormatted: sanitizeText(body.totalEstimateFormatted || '', 50),
      totalEstimateInr: typeof body.totalEstimateInr === 'number' ? body.totalEstimateInr : undefined,
      message: sanitizeText(body.message || '', 2000),
      status: 'new',
      notes: sanitizeText(body.notes || '', 1000),
      date: typeof body.date === 'string' ? body.date : new Date().toISOString(),
    });

    return NextResponse.json({ success: true, lead: savedRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save lead to database';
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
