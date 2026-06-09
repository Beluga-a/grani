import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-warning">⚠ Только для смельчаков</div>
        <h1 className="hero-title">
          Самые страшные!<em style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontStyle: "normal" }}>Самые запоминающиеся</em>хоррор квесты!
        </h1>
        <p className="hero-desc">
          Премиальные хоррор-квесты с живыми актёрами, кинематографическими
          декорациями и авторскими сценариями. Принимаем гостей круглосуточно.
        </p>
        <div className="hero-rating">
          <span className="hero-stars">★★★★★</span>
          <span>4.9 / 5</span>
        </div>
        <div className="hero-btns">
          <Link className="btn btn-primary" href="/quests">
            Выбрать квест
          </Link>
          <a className="btn btn-outline" href="#reviews">
            Читать отзывы
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <div>Скролл</div>
      </div>
    </section>
  );
}
