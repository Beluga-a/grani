import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data);
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

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: session.user.name ?? "Пользователь",
      email: session.user.email ?? null,
      avatar: session.user.image ?? null,
      quest,
      rating,
      text: text.trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
