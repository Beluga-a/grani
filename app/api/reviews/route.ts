import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readReviews, writeReviews } from "@/lib/reviews";

export async function GET() {
  const reviews = readReviews();
  return NextResponse.json(reviews);
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

  const reviews = readReviews();

  const now = new Date();
  const date = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const newReview = {
    id: `user-${Date.now()}`,
    name: session.user.name ?? "Пользователь",
    email: session.user.email ?? null,
    avatar: session.user.image ?? null,
    quest,
    rating,
    text: text.trim(),
    date,
  };

  reviews.unshift(newReview);
  writeReviews(reviews);

  return NextResponse.json(newReview, { status: 201 });
}
