"use client";

import { useState } from "react";
import { RULES_DATA } from "@/data/rules";
import type { RuleBlock } from "@/lib/types";

function RuleBlockRender({ block }: { block: RuleBlock }) {
  if (block.type === "text") return <p className="rules-text">{block.t}</p>;
  if (block.type === "warn") return <div className="rules-warning">{block.t}</div>;
  return (
    <ul className="rules-list">
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function RulesLayout() {
  const [active, setActive] = useState(RULES_DATA[0].id);

  function scrollTo(id: string) {
    setActive(id);
    const el = document.getElementById(`rule-${id}`);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }

  return (
    <div className="rules-layout">
      <aside className="rules-nav">
        {RULES_DATA.map((r) => (
          <button
            key={r.id}
            className={`rules-nav-item ${active === r.id ? "active" : ""}`}
            onClick={() => scrollTo(r.id)}
          >
            {r.title}
          </button>
        ))}
      </aside>
      <div>
        {RULES_DATA.map((r) => (
          <div key={r.id} className="rules-section" id={`rule-${r.id}`}>
            <div className="rules-section-title">{r.title}</div>
            {r.items.map((item, i) => (
              <RuleBlockRender key={i} block={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
