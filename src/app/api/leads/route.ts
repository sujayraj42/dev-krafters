import { NextResponse } from 'next/server';
import { getAllLeadsAsync, saveLeadAsync, saveManyLeadsAsync, clearLeadsAsync, updateLeadAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/leads - Retrieve all leads from MongoDB
export async function GET() {
  try {
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

// POST /api/leads - Save a new lead or multiple leads to MongoDB
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

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ success: true, leads: [] });
      }

      const leadsToSave = body.map((item) => ({
        type: item.type || 'contact',
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        projectType: item.projectType || '',
        pages: item.pages,
        budget: item.budget || '',
        totalEstimateFormatted: item.totalEstimateFormatted || '',
        totalEstimateInr: item.totalEstimateInr,
        message: item.message || '',
        status: item.status || 'new',
        notes: item.notes || '',
        date: item.date,
      }));

      const savedRecords = await saveManyLeadsAsync(leadsToSave);
      return NextResponse.json({ success: true, leads: savedRecords });
    }

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

// PATCH /api/leads - Update lead status or notes
export async function PATCH(request: Request) {
  try {
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

// DELETE /api/leads - Clear leads database
export async function DELETE() {
  try {
    await clearLeadsAsync();
    return NextResponse.json({ success: true, message: 'Leads database cleared successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear leads database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
