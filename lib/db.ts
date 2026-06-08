import { Pool } from "pg";
import type { Quest } from "./types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// ─── REVIEWS ───────────────────────────────────────────────

export async function initReviewsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      quest TEXT NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

// ─── QUESTS ────────────────────────────────────────────────

export async function initQuestsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quests (
      id INT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `);
}

export async function getQuests(): Promise<Quest[]> {
  const { rows } = await pool.query("SELECT data FROM quests ORDER BY id");
  return rows.map((r) => r.data as Quest);
}

export async function updateQuestField(
  id: number,
  field: string,
  value: unknown
): Promise<Quest | null> {
  const { rows } = await pool.query(
    `UPDATE quests
     SET data = jsonb_set(data, ARRAY[$2::text], $3::jsonb, true)
     WHERE id = $1
     RETURNING data`,
    [id, field, JSON.stringify(value)]
  );
  return (rows[0]?.data as Quest) ?? null;
}

export async function seedQuests(quests: Quest[]) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM quests");
  if (parseInt(rows[0].count) === 0) {
    for (const q of quests) {
      await pool.query("INSERT INTO quests (id, data) VALUES ($1, $2)", [
        q.id,
        JSON.stringify(q),
      ]);
    }
  }
}

export default pool;
