import { NextResponse } from 'next/server';
import { getAllLeadsAsync, saveLeadAsync, clearLeadsAsync, updateLeadAsync } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/leads - Retrieve all leads from MongoDB (Protected: Requires Admin Auth)
export async function GET(request: Request) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required to access leads.' },
        { status: 401 }
      );
    }

    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      return NextResponse.json(
        {
          success: false,
          error: 'MONGODB_URI contains placeholder <db_password>. Set your real MongoDB Atlas password in Vercel Dashboard → Environment Variables.',
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

// POST /api/leads - Save a new lead to MongoDB (Public for inquiry submission)
export async function POST(request: Request) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      return NextResponse.json(
        { success: false, error: 'MONGODB_URI contains placeholder <db_password>. Set your real MongoDB Atlas password in Vercel Dashboard → Environment Variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!body.email && !body.name) {
      return NextResponse.json({ success: false, error: 'Email or name is required' }, { status: 400 });
    }

    const savedRecord = await saveLeadAsync({
      type: body.type || 'contact',
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      projectType: body.projectType || '',
      pages: body.pages,
      budget: body.budget || '',
      totalEstimateFormatted: body.totalEstimateFormatted || '',
      totalEstimateInr: body.totalEstimateInr,
      message: body.message || '',
      status: body.status || 'new',
      notes: body.notes || '',
      date: body.date,
    });

    return NextResponse.json({ success: true, lead: savedRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save lead to database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/leads - Update lead status or notes (Protected: Requires Admin Auth)
export async function PATCH(request: Request) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required to update leads.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const updated = await updateLeadAsync(id, { status, notes });
    return NextResponse.json({ success: true, updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update lead';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/leads - Clear leads database (Protected: Requires Admin Auth)
export async function DELETE(request: Request) {
  try {
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required to clear leads.' },
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
