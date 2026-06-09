import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool, { initReviewsTable } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "change-me-to-random-string";
function checkAdmin(req: Request) {
  return req.headers.get("x-admin-secret") === ADMIN_SECRET;
}

export async function GET() {
  try {
    await initReviewsTable();
    const { rows } = await pool.query(
      "SELECT * FROM reviews ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { quest, rating, text } = body;

  if (!quest || !rating || !text?.trim()) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Некорректный рейтинг" }, { status: 400 });
  }
  if (text.trim().length < 10) {
    return NextResponse.json({ error: "Отзыв слишком короткий" }, { status: 400 });
  }

  try {
    await initReviewsTable();
    const { rows } = await pool.query(
      `INSERT INTO reviews (name, email, avatar, quest, rating, text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        session.user.name ?? "Пользователь",
        session.user.email ?? null,
        session.user.image ?? null,
        quest,
        rating,
        text.trim(),
      ]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json() as { id: string };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await initReviewsTable();
  const { rowCount } = await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
  if (!rowCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
