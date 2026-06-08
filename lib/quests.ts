import "server-only";
import type { Quest } from "./types";
import {
  initQuestsTable,
  getQuests,
  updateQuestField,
  seedQuests,
  insertQuest,
  deleteQuest,
  getMaxQuestId,
} from "./db";
import questsJson from "../data/quests.json";

async function ensureReady() {
  await initQuestsTable();
  await seedQuests(questsJson as Quest[]);
}

export async function readQuests(): Promise<Quest[]> {
  await ensureReady();
  return getQuests();
}

export async function patchQuestField(
  id: number,
  field: keyof Quest,
  value: unknown
): Promise<Quest | null> {
  await ensureReady();
  return updateQuestField(id, field, value);
}

export async function addQuest(data: Omit<Quest, "id">): Promise<Quest> {
  await initQuestsTable();
  const maxId = await getMaxQuestId();
  const quest = { ...data, id: maxId + 1 } as Quest;
  return insertQuest(quest);
}

export async function removeQuest(id: number): Promise<boolean> {
  await initQuestsTable();
  return deleteQuest(id);
}
