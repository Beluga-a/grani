import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool, { initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
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
    await initDb();
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
