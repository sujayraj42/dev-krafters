import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // On Vercel (serverless), we can't write to the filesystem.
    // Store file metadata in MongoDB and return a reference.
    // For production file storage, integrate Cloudinary, AWS S3, or Vercel Blob.

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'application/octet-stream';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Save file reference to MongoDB
    try {
      const clientPromise = (await import('@/lib/mongodb')).default;
      if (clientPromise) {
        const client = await clientPromise;
        const db = client.db('dev_krafters');
        await db.collection('uploads').insertOne({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          dataUrl: dataUrl.length < 5_000_000 ? dataUrl : undefined, // Only store if < 5MB
          uploadedAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.error('[Upload DB Save Error]', dbErr);
    }

    return NextResponse.json({
      success: true,
      fileUrl: dataUrl.length < 5_000_000 ? dataUrl : undefined,
      fileName: file.name,
      fileSize: file.size,
      message: dataUrl.length >= 5_000_000
        ? 'File too large for inline storage. Integrate cloud storage (S3/Cloudinary) for production.'
        : 'File uploaded successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'File upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
