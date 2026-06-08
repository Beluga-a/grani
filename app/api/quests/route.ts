import { NextResponse } from "next/server";
import { readQuests, patchQuestField, addQuest, removeQuest } from "@/lib/quests";
import type { Quest } from "@/lib/types";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "change-me-to-random-string";

function checkAuth(request: Request): boolean {
  return request.headers.get("x-admin-secret") === ADMIN_SECRET;
}

export async function GET() {
  const quests = await readQuests();
  return NextResponse.json(quests);
}

export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, field, value } = body as { id: number; field: keyof Quest; value: unknown };

  if (typeof id !== "number" || typeof field !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const quest = await patchQuestField(id, field, value);
  if (!quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, quest });
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || !body.desc) {
    return NextResponse.json({ error: "name and desc are required" }, { status: 400 });
  }

  const quest = await addQuest(body as Omit<Quest, "id">);
  return NextResponse.json({ ok: true, quest }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json() as { id: number };
  if (typeof id !== "number") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const deleted = await removeQuest(id);
  if (!deleted) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
