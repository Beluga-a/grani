"use client";

import { useState, useRef } from "react";
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
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  let visible = filter === "all" ? quests : quests.filter((q) => q.cat === filter);
  if (limit) visible = visible.slice(0, limit);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 12 : el.clientWidth;
    setCurrent(Math.round(el.scrollLeft / cardW));
  };

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

      <div className="quests-grid" ref={scrollRef} onScroll={handleScroll}>
        {visible.map((q) => (
          <QuestCard key={q.id} quest={q} onClick={() => setSelected(q)} />
        ))}
      </div>

      <div className="swipe-dots">
        {visible.map((_, i) => (
          <div key={i} className={`swipe-dot${i === current ? " active" : ""}`} />
        ))}
      </div>

      <QuestModal quest={selected} onClose={() => setSelected(null)} />
    </>
  );
}
