import { NextResponse } from "next/server";
import { readQuests, writeQuests } from "@/lib/quests";
import type { Quest } from "@/lib/types";

// Секретный ключ для авторизации запросов от бота.
// Бот будет слать его в заголовке: X-Admin-Secret
// В проде ОБЯЗАТЕЛЬНО задать через переменную окружения ADMIN_SECRET
const ADMIN_SECRET = process.env.ADMIN_SECRET || "change-me-to-random-string";

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return secret === ADMIN_SECRET;
}

/**
 * GET /api/quests — публичный, отдаёт список квестов
 */
export async function GET() {
  const quests = await readQuests();
  return NextResponse.json(quests);
}

/**
 * PATCH /api/quests — защищённый, обновляет одно поле квеста
 *
 * Body: { id: number, field: string, value: any }
 * Headers: X-Admin-Secret: <secret>
 */
export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, field, value } = body as { id: number; field: keyof Quest; value: any };

  if (typeof id !== "number" || typeof field !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const quests = await readQuests();
  const quest = quests.find((q) => q.id === id);
  if (!quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  // Обновляем поле
  (quest as any)[field] = value;
  await writeQuests(quests);

  return NextResponse.json({ ok: true, quest });
}
