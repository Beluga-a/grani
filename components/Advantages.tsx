"use client";

import { useRef, useState } from "react";
import { ADVANTAGES } from "@/data/advantages";

export default function Advantages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 12 : el.clientWidth;
    setCurrent(Math.round(el.scrollLeft / cardW));
  };

  return (
    <div
      style={{
        background: "var(--off-black)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section">
        <div className="eyebrow">Преимущества</div>
        <h2 className="h2" style={{ marginBottom: 48 }}>
          Почему <em>мы</em>
        </h2>

        {/* Desktop — обычная сетка */}
        <div className="adv-grid adv-grid-desktop">
          {ADVANTAGES.map((a, i) => (
            <div className="adv-item" key={a.title}>
              <div className="adv-num">// 0{i + 1}</div>
              <div className="adv-icon-wrap">
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: a.svg }} />
              </div>
              <div className="adv-title">{a.title}</div>
              <div className="adv-text">{a.text}</div>
            </div>
          ))}
        </div>

        {/* Mobile — горизонтальный свайпер */}
        <div className="adv-swiper-wrap">
          <div className="adv-swiper" ref={scrollRef} onScroll={handleScroll}>
            {ADVANTAGES.map((a, i) => (
              <div className="adv-item adv-swiper-card" key={a.title}>
                <div className="adv-num">// 0{i + 1}</div>
                <div className="adv-icon-wrap">
                  <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: a.svg }} />
                </div>
                <div className="adv-title">{a.title}</div>
                <div className="adv-text">{a.text}</div>
              </div>
            ))}
          </div>
          <div className="swipe-dots">
            {ADVANTAGES.map((_, i) => (
              <div key={i} className={`swipe-dot${i === current ? " active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
