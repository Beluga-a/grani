import type { Quest } from "./types";

/* ───── ХЕЛПЕРЫ ДЛЯ ЦЕНЫ ───── */
// Безопасны для использования и на сервере, и на клиенте.

export function formatPrice(q: Quest): string {
  return `от ${q.basePrice.toLocaleString("ru-RU")} ₽`;
}

export function formatPriceFull(q: Quest): string {
  return `${q.basePrice.toLocaleString("ru-RU")} ₽ до ${q.baseUpTo} чел · +${q.extraPrice} ₽`;
}

export function categoryLabel(cat: Quest["cat"]): string {
  if (cat === "extreme") return "Экстрим";
  if (cat === "mystery") return "Мистика";
  return "Классика";
}
