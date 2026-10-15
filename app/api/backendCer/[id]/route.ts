import { NextRequest, NextResponse } from 'next/server';
import { getBackendCer } from '../../../../backend/backendCerService';
import { isRateLimited } from '../../../../lib/rateLimit';

export const runtime = 'nodejs';

const CERT_ID_PATTERN = /^[a-f0-9]{6,32}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResult = isRateLimited(request, 'backendCer-lookup', {
      limit: 60,
      windowMs: 60 * 1000,
    });

    if (rateLimitResult.limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { id } = await params;
    if (!CERT_ID_PATTERN.test(id)) {
      return NextResponse.json({ error: 'Invalid certificate ID format.' }, { status: 400 });
    }

    const certificate = await getBackendCer(id);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error('Error handling certificate lookup request:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
