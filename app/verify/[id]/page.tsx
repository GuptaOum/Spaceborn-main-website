import type { Metadata } from 'next';
import { getBackendCer, type BackendCerRecord } from '../../../backend/backendCerService';

export const metadata: Metadata = {
  title: 'Certificate Verification | Spaceborn',
  description: 'Verify the authenticity of a Spaceborn certificate.',
};

const CERT_ID_PATTERN = /^[a-f0-9]{6,32}$/i;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  background: '#010101',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 640,
  border: '1px solid var(--border-c)',
  borderRadius: 12,
  padding: '40px 32px',
  background: 'rgba(241, 242, 236, 0.03)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: 'var(--dim)',
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--text)',
  marginTop: 4,
};

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="font-mono" style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}

function ValidCertificate({ certificate }: { certificate: BackendCerRecord }) {
  const tenure =
    certificate.start_date && certificate.end_date
      ? `${certificate.start_date} — ${certificate.end_date}`
      : '';

  return (
    <div style={cardStyle}>
      <div
        className="font-mono"
        style={{
          display: 'inline-block',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--cyan)',
          border: '1px solid var(--cyan)',
          borderRadius: 4,
          padding: '6px 14px',
          marginBottom: 24,
        }}
      >
        ✓ VERIFIED CERTIFICATE
      </div>

      <h1 className="font-ethno" style={{ fontSize: 26, margin: '0 0 6px', color: 'var(--heading)' }}>
        {certificate.name}
      </h1>
      <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: 14 }}>
        This certificate was issued by Spaceborn and is authentic.
      </p>

      <DetailRow label="Designation" value={certificate.designation} />
      <DetailRow label="Department" value={certificate.department} />
      <DetailRow label="Experience" value={certificate.experience} />
      <DetailRow label="Tenure" value={tenure} />
      <DetailRow label="Details" value={certificate.description} />
      <DetailRow label="Issued On" value={certificate.cert_date} />
      <DetailRow label="Certificate ID" value={certificate.certificate_id} />

      <p className="font-mono" style={{ marginTop: 24, fontSize: 11, color: 'var(--dim)' }}>
        Spaceborn Private Limited — Beyond Autonomous | CIN: U62011TN2026PTC196806 | MCA, Govt of India
      </p>
    </div>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <div style={cardStyle}>
      <div
        className="font-mono"
        style={{
          display: 'inline-block',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--red)',
          border: '1px solid var(--red)',
          borderRadius: 4,
          padding: '6px 14px',
          marginBottom: 24,
        }}
      >
        ✗ NOT VERIFIED
      </div>

      <h1 className="font-ethno" style={{ fontSize: 22, margin: '0 0 12px', color: 'var(--heading)' }}>
        Certificate Not Found
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
        No certificate matching ID <span className="font-mono" style={{ color: 'var(--text)' }}>{id}</span> was
        found in our records. It may not have been issued yet, or the link may be incorrect. If you believe
        this is an error, contact <span style={{ color: 'var(--cyan)' }}>adarshkumar@spaceborn.in</span>.
      </p>
    </div>
  );
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = CERT_ID_PATTERN.test(id) ? await getBackendCer(id) : null;

  return (
    <main style={pageStyle}>
      {certificate ? <ValidCertificate certificate={certificate} /> : <NotFound id={id} />}
    </main>
  );
}
