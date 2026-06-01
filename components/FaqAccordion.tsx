"use client";

import { useState } from "react";
import { FAQ_DATA, FAQ_CATS } from "@/data/faq";

export default function FaqAccordion() {
  const [filter, setFilter] = useState("all");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const visible =
    filter === "all" ? FAQ_DATA : FAQ_DATA.filter((f) => f.cat === filter);

  return (
    <div className="faq-layout">
      <aside>
        {FAQ_CATS.map((c) => (
          <button
            key={c.id}
            className={`faq-cat ${filter === c.id ? "active" : ""}`}
            onClick={() => {
              setFilter(c.id);
              setOpenIdx(null);
            }}
          >
            {c.label}
          </button>
        ))}
      </aside>
      <div className="faq-list">
        {visible.map((f, i) => (
          <div
            key={i}
            className={`faq-item ${openIdx === i ? "open" : ""}`}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="faq-q">
              <div className="faq-q-text">{f.q}</div>
              <div className="faq-toggle">+</div>
            </div>
            <div className="faq-a">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
