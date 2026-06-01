import "server-only";
import fs from "fs/promises";
import path from "path";
import type { Quest } from "./types";

// Путь к JSON-файлу с квестами (тот же, что редактирует Telegram-бот)
const QUESTS_PATH = path.join(process.cwd(), "data", "quests.json");

/**
 * Прочитать квесты с диска (server-side).
 * Используется в API-роутах и в server-components.
 */
export async function readQuests(): Promise<Quest[]> {
  const raw = await fs.readFile(QUESTS_PATH, "utf-8");
  return JSON.parse(raw) as Quest[];
}

/**
 * Записать квесты на диск (server-side).
 * Используется в PATCH-эндпоинте, который дёргает бот.
 */
export async function writeQuests(quests: Quest[]): Promise<void> {
  await fs.writeFile(
    QUESTS_PATH,
    JSON.stringify(quests, null, 2),
    "utf-8"
  );
}
