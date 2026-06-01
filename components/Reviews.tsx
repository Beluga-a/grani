"use client";

import { useState, useRef } from "react";
import { REVIEWS } from "@/data/reviews";

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = REVIEWS.slice(0, 6);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 12 : el.clientWidth;
    setCurrent(Math.round(el.scrollLeft / cardW));
  };

  return (
    <section className="section" id="reviews">
      <div className="eyebrow">Отзывы</div>
      <h2 className="h2" style={{ marginBottom: 48 }}>
        Они <em>пережили</em> это
      </h2>
      <div className="reviews-grid" ref={scrollRef} onScroll={handleScroll}>
        {items.map((r, i) => (
          <div className="rcard" key={i}>
            <div className="rcard-head">
              <div className="ravatar">{r.av}</div>
              <div style={{ flex: 1 }}>
                <div className="rname">{r.name}</div>
                <div className="rdate">{r.date}</div>
              </div>
              <div className="rstars">{"★".repeat(r.rating)}</div>
            </div>
            <div className="rquest">// {r.quest}</div>
            <div className="rtext">«{r.text}»</div>
          </div>
        ))}
      </div>
      <div className="swipe-dots">
        {items.map((_, i) => (
          <div key={i} className={`swipe-dot${i === current ? " active" : ""}`} />
        ))}
      </div>
    </section>
  );
}
