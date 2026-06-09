"use client";

import { useEffect } from "react";
import type { Quest } from "@/lib/types";
import { categoryLabel } from "@/lib/format";

interface Props {
  quest: Quest | null;
  onClose: () => void;
}

const FEAR_LABELS: Record<number, string> = {
  1: "умеренный",
  2: "лёгкий",
  3: "средний",
  4: "высокий",
  5: "максимум",
};

export default function QuestModal({ quest, onClose }: Props) {
  // Esc для закрытия
  useEffect(() => {
    if (!quest) return;
    document.body.classList.add("modal-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [quest, onClose]);

  if (!quest) return null;

  const fearPercent = ((quest.fear - 1) / 4) * 100;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        {/* HERO */}
        <div className="modal-hero">
          {quest.photo ? (
            <img src={quest.photo} alt={quest.name} className="modal-hero-photo" />
          ) : (
            <>
              <div className="modal-hero-bg" />
              <svg className="modal-hero-icon" viewBox="0 0 587 494" aria-hidden="true">
                <use href="#logoMark" />
              </svg>
            </>
          )}
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <div className="modal-cat-badge">
              {quest.badge}
            </div>
            <h2 className="modal-title">{quest.name}</h2>
            <div className="modal-brand">
              Бренд: <span>ГРАНИ СТРАХА</span>
            </div>
          </div>
        </div>

        {/* META BAR */}
        <div className="modal-meta">
          <div className="modal-meta-item">
            <div className="modal-meta-label">Игроков</div>
            <div className="modal-meta-val">{quest.players}</div>
          </div>
          <div className="modal-meta-item">
            <div className="modal-meta-label">Время</div>
            <div className="modal-meta-val">{quest.time}</div>
          </div>
          <div className="modal-meta-item">
            <div className="modal-meta-label">Цена</div>
            <div className="modal-meta-val">
              <em style={{ fontSize: "0.7em", opacity: 0.7 }}>от </em>{quest.basePrice.toLocaleString("ru-RU")}
              <em> ₽</em>
            </div>
          </div>
          <div className="modal-meta-item">
            <div className="modal-meta-label">Сложность</div>
            <div className="modal-meta-val">
              {quest.diff}<em>/5</em>
            </div>
          </div>
          <div className="modal-meta-item">
            <div className="modal-meta-label">Страх</div>
            <div className="modal-meta-val">
              {quest.fear}<em>/5</em>
            </div>
          </div>
          <div className="modal-meta-item">
            <div className="modal-meta-label">Возраст</div>
            <div className="modal-meta-val">{quest.age}</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-section">
              <h3>Описание</h3>
              <div className="modal-text">
                <p>{quest.full}</p>
              </div>
            </div>

            <div className="modal-section">
              <h3>Атмосфера</h3>
              <ul className="modal-ulist">
                {quest.atmosphere.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>В стоимость входит</h3>
              <ul className="modal-ulist">
                {quest.included.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>Особенности</h3>
              <div className="modal-tags">
                <span className="modal-tag">😱 Страх: {quest.fear}/5 — {FEAR_LABELS[quest.fear]}</span>
                <span className="modal-tag">🔞 Возраст: {quest.age}</span>
                {quest.tags.map((t, i) => (
                  <span key={i} className="modal-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="modal-aside">
            <div className="aside-block">
              <div className="aside-block-label">Средняя оценка</div>
              <div className="aside-rating">
                <span className="aside-rating-num">{quest.rating}</span>
                <span className="aside-rating-max">/ 5</span>
              </div>
            </div>

            <div className="aside-block">
              <div className="aside-block-label">Уровень страха</div>
              <div className="aside-fear-scale">
                <div
                  className="aside-fear-marker"
                  style={{ left: `${fearPercent}%` }}
                />
              </div>
              <div className="aside-fear-label">
                <em>{quest.fear}/5</em> — {FEAR_LABELS[quest.fear]}
              </div>
            </div>

            <div className="aside-block">
              <div className="aside-block-label">Режим работы</div>
              <div className="aside-schedule">Круглосуточно</div>
            </div>

            <div className="aside-block">
              <div className="aside-block-label">Контакты</div>
              <div className="aside-schedule">
                📍 Ул. Недорезова 7В (цокольный этаж)<br />
                📞 +7 (914) 516-31-88
              </div>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <div className="modal-cta">
          <div className="modal-price">
            <span className="modal-price-val">
              от {quest.basePrice.toLocaleString("ru-RU")} ₽
              <em> · до {quest.baseUpTo} чел</em>
            </span>
            <span className="modal-price-label">
              + {quest.extraPrice} ₽ за каждого следующего
            </span>
          </div>
          <div className="modal-cta-btns">
            <a
              className="btn btn-outline"
              href={`mailto:info@granistraha.ru?subject=Бронь: ${encodeURIComponent(quest.name)}`}
            >
              Написать
            </a>
            <a className="btn btn-primary" href="tel:+79145163188">
              Позвонить
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
