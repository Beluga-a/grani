"use client";

import { useState } from "react";

const DENOMINATIONS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];

function CertCard({ amount }: { amount: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`cert-flip${flipped ? " flipped" : ""}`}
      onClick={() => setFlipped((v) => !v)}
    >
      <div className="cert-flip-inner">
        {/* ЛИЦЕВАЯ СТОРОНА */}
        <div className="cert-face cert-front">
          <div className="cert-top-row">
            <span className="cert-brand">ГРАНИ СТРАХА</span>
            <span className="cert-label">ПОДАРОЧНЫЙ КУПОН</span>
          </div>
          <div className="cert-amount">
            {amount.toLocaleString("ru-RU")} <span>₽</span>
          </div>
          <div className="cert-hint">нажмите, чтобы узнать как получить</div>
        </div>

        {/* ОБРАТНАЯ СТОРОНА */}
        <div className="cert-face cert-back">
          <div className="cert-back-brand">ГРАНИ СТРАХА</div>
          <div className="cert-back-label">Для покупки позвоните нам</div>
          <a
            className="cert-back-phone"
            href="tel:+79145163188"
            onClick={(e) => e.stopPropagation()}
          >
            +7 (914) 516-31-88
          </a>
          <div className="cert-back-addr">Чита, ул. Недорезова 7В</div>
          <div className="cert-back-hint">нажмите, чтобы вернуться</div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <>
      <div className="section-hero">
        <div className="eyebrow">Подарки</div>
        <h1 className="h1">Подарочные сертификаты</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 12, fontSize: 14, maxWidth: 480 }}>
          На все квесты — от 500₽ до 8000₽. Нажми на сертификат чтобы узнать как купить.
        </p>
      </div>

      <section className="section">
        <div className="cert-grid">
          {DENOMINATIONS.map((amount) => (
            <CertCard key={amount} amount={amount} />
          ))}
        </div>
      </section>
    </>
  );
}
