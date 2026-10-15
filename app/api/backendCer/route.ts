import { NextRequest, NextResponse } from 'next/server';
import { upsertBackendCer } from '../../../backend/backendCerService';
import { isRateLimited } from '../../../lib/rateLimit';
import { isValidLength, hasNewline } from '../../../lib/validation';

export const runtime = 'nodejs';

const CERT_ID_PATTERN = /^[a-f0-9]{6,32}$/i;
const MAX_BATCH_SIZE = 500;

type IncomingCertificate = {
  certificate_id: string;
  name: string;
  designation: string;
  department: string;
  start_date: string;
  end_date: string;
  experience: string;
  description: string;
  cert_date: string;
};

function validateCertificate(entry: any, index: number): { record?: IncomingCertificate; error?: string } {
  if (!entry || typeof entry !== 'object') {
    return { error: `Entry ${index}: must be an object.` };
  }

  const id = typeof entry.certificate_id === 'string' ? entry.certificate_id.trim() : '';
  if (!CERT_ID_PATTERN.test(id)) {
    return { error: `Entry ${index}: certificate_id must be 6-32 hex characters.` };
  }

  const name = typeof entry.name === 'string' ? entry.name.trim() : '';
  if (!name || !isValidLength(name, 120) || hasNewline(name)) {
    return { error: `Entry ${index}: name is required (max 120 chars, single line).` };
  }

  const singleLineFields = ['designation', 'department', 'start_date', 'end_date', 'experience', 'cert_date'] as const;
  const record: any = { certificate_id: id, name };

  for (const field of singleLineFields) {
    const value = typeof entry[field] === 'string' ? entry[field].trim() : '';
    if (!isValidLength(value, 200) || hasNewline(value)) {
      return { error: `Entry ${index}: invalid ${field} (max 200 chars, single line).` };
    }
    record[field] = value;
  }

  const description = typeof entry.description === 'string' ? entry.description.trim() : '';
  if (!isValidLength(description, 2000)) {
    return { error: `Entry ${index}: description exceeds maximum length.` };
  }
  record.description = description;

  return { record: record as IncomingCertificate };
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = isRateLimited(request, 'backendCer-sync', {
      limit: 20,
      windowMs: 15 * 60 * 1000,
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

    const configuredKey = process.env.CERT_API_KEY || process.env.SPACEBORN_API_KEY;
    if (!configuredKey) {
      return NextResponse.json(
        { error: 'Certificate API is not configured on this server.' },
        { status: 503 }
      );
    }

    const providedKey =
      request.headers.get('x-api-key') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ||
      '';
    if (providedKey !== configuredKey) {
      return NextResponse.json({ error: 'Invalid or missing API key.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request payload. Must be JSON.' },
        { status: 400 }
      );
    }

    // Accept either a single certificate object or { backendCer: [...] } or { certificates: [...] }
    const entries: any[] = Array.isArray(body?.backendCer)
      ? body.backendCer
      : Array.isArray(body?.certificates)
        ? body.certificates
        : body?.certificate_id
          ? [body]
          : [];

    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No certificates provided. Send { backendCer: [...] } or a single certificate object.' },
        { status: 400 }
      );
    }

    if (entries.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { error: `Too many certificates in one request (max ${MAX_BATCH_SIZE}).` },
        { status: 400 }
      );
    }

    const records: IncomingCertificate[] = [];
    for (let i = 0; i < entries.length; i++) {
      const { record, error } = validateCertificate(entries[i], i);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
      records.push(record!);
    }

    const result = await upsertBackendCer(records);

    return NextResponse.json({
      success: true,
      upserted: result.upserted,
      total: result.total,
    });
  } catch (error) {
    console.error('Error handling certificate sync request:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
