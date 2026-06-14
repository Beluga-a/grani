"use client";

import { useState, useRef } from "react";
import type { Quest } from "@/lib/types";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";

interface Props {
  quests: Quest[];
  limit?: number;
}

export default function QuestsGrid({ quests, limit }: Props) {
  const [selected, setSelected] = useState<Quest | null>(null);
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visible = limit ? quests.slice(0, limit) : quests;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 12 : el.clientWidth;
    setCurrent(Math.round(el.scrollLeft / cardW));
  };

  return (
    <>

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
