import { getPool } from '../lib/db';

export type CertificateRecord = {
  certificate_id: string;
  name: string;
  designation: string;
  department: string;
  start_date: string;
  end_date: string;
  experience: string;
  description: string;
  cert_date: string;
  updated_at: string;
};

export async function getCertificate(certificateId: string): Promise<CertificateRecord | null> {
  const { rows } = await getPool().query<CertificateRecord>(
    'SELECT * FROM certificates WHERE certificate_id = $1',
    [certificateId]
  );
  return rows[0] ?? null;
}

export async function upsertCertificates(
  records: Omit<CertificateRecord, 'updated_at'>[]
): Promise<{ upserted: number; total: number }> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        certificate_id VARCHAR(32) PRIMARY KEY,
        name           VARCHAR(120) NOT NULL,
        designation    VARCHAR(200) NOT NULL,
        department     VARCHAR(200) NOT NULL,
        start_date     VARCHAR(200) NOT NULL,
        end_date       VARCHAR(200) NOT NULL,
        experience     VARCHAR(200) NOT NULL,
        description    VARCHAR(2000) NOT NULL,
        cert_date      VARCHAR(200) NOT NULL,
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    for (const r of records) {
      await client.query(
        `INSERT INTO certificates
           (certificate_id, name, designation, department, start_date, end_date, experience, description, cert_date, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
         ON CONFLICT (certificate_id) DO UPDATE SET
           name = EXCLUDED.name,
           designation = EXCLUDED.designation,
           department = EXCLUDED.department,
           start_date = EXCLUDED.start_date,
           end_date = EXCLUDED.end_date,
           experience = EXCLUDED.experience,
           description = EXCLUDED.description,
           cert_date = EXCLUDED.cert_date,
           updated_at = now()`,
        [
          r.certificate_id,
          r.name,
          r.designation,
          r.department,
          r.start_date,
          r.end_date,
          r.experience,
          r.description,
          r.cert_date,
        ]
      );
    }

    const { rows } = await client.query<{ count: string }>('SELECT COUNT(*) FROM certificates');
    await client.query('COMMIT');

    return { upserted: records.length, total: Number(rows[0].count) };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
