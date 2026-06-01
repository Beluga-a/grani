"use client";

import { useState } from "react";
import type { Quest, QuestCategory } from "@/lib/types";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";

interface Props {
  quests: Quest[];
  /** Если true — показывает фильтры по категориям */
  showFilters?: boolean;
  /** Ограничить количество отображаемых */
  limit?: number;
}

const CATS: { id: "all" | QuestCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "extreme", label: "Экстрим" },
  { id: "mystery", label: "Мистика" },
  { id: "classic", label: "Классика" },
];

export default function QuestsGrid({ quests, showFilters = false, limit }: Props) {
  const [selected, setSelected] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<"all" | QuestCategory>("all");

  let visible = filter === "all" ? quests : quests.filter((q) => q.cat === filter);
  if (limit) visible = visible.slice(0, limit);

  return (
    <>
      {showFilters && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {CATS.map((c) => (
            <button
              key={c.id}
              className={`qfilter ${filter === c.id ? "active" : ""}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="quests-grid">
        {visible.map((q) => (
          <QuestCard key={q.id} quest={q} onClick={() => setSelected(q)} />
        ))}
      </div>

      <QuestModal quest={selected} onClose={() => setSelected(null)} />
    </>
  );
}
