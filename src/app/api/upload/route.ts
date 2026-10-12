import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 1. File size enforcement
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File exceeds maximum allowed size of 5 MB.' },
        { status: 413 }
      );
    }

    // 2. MIME type validation
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported file type. Only JPG, PNG, WebP, SVG, and PDF files are allowed.',
        },
        { status: 415 }
      );
    }

    // 3. Sanitize filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Save file metadata reference to MongoDB
    try {
      const clientPromise = (await import('@/lib/mongodb')).default;
      if (clientPromise) {
        const client = await clientPromise;
        const dbName = process.env.MONGODB_DB || 'Dev_Krafters';
        const db = client.db(dbName);
        await db.collection('uploads').insertOne({
          fileName: sanitizedFileName,
          fileSize: file.size,
          mimeType,
          dataUrl,
          uploadedAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.error('[Upload DB Save Error]', dbErr);
    }

    return NextResponse.json({
      success: true,
      fileUrl: dataUrl,
      fileName: sanitizedFileName,
      fileSize: file.size,
      message: 'File uploaded successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'File upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
