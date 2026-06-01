import Footer from "@/components/Footer";
import { readQuests } from "@/lib/quests";

export default async function CertificatesPage() {
  const quests = await readQuests();

  return (
    <>
      <div className="section-hero">
        <div className="eyebrow">Подарки</div>
        <h1 className="h1">Подарочные купоны</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 12, fontSize: 14, maxWidth: 480 }}>
          Подари незабываемые впечатления — купон на любой квест ГРАНИ СТРАХА
        </p>
      </div>

      <section className="section">
        <div className="coupon-grid">
          {quests.map((q) => (
            <div key={q.id} className="coupon">
              <div className="coupon-left">
                <div className="coupon-brand">ГРАНИ СТРАХА</div>
                <div className="coupon-label">ПОДАРОЧНЫЙ КУПОН</div>
                <div className="coupon-name">{q.name}</div>
                <div className="coupon-price">
                  {q.basePrice.toLocaleString("ru-RU")} <span>₽</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
