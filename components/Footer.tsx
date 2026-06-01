import Link from "next/link";
import { readQuests } from "@/lib/quests";

export default async function Footer() {
  const quests = await readQuests();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <svg className="footer-logo-svg" viewBox="0 0 587 494" aria-hidden="true">
              <use href="#logoMark" />
            </svg>
            <div className="footer-logo-text">
              <strong>ГРАНИ СТРАХА</strong>
              <small>Horror Quest</small>
            </div>
          </div>
          <p className="footer-desc">
            Экстремальные хоррор-квесты с 2017 года. Живые актёры, профессиональные
            декорации, незабываемые впечатления. 18+.
          </p>
        </div>

        <div>
          <div className="footer-head">Навигация</div>
          <ul className="footer-links">
            <li><Link href="/">Главная</Link></li>
            <li><Link href="/quests">Квесты</Link></li>
            <li><Link href="/rules">Правила</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/feartest">Тест на страх</Link></li>
            <li><Link href="/certificates">Сертификаты</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-head">Квесты</div>
          <ul className="footer-links">
            {quests.slice(0, 6).map((q) => (
              <li key={q.id}>
                <Link href="/quests">{q.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-head">Контакты</div>
          <ul className="footer-links">
            <li><a>📍 ул. Страха, 13</a></li>
            <li><a href="tel:+79990000000">📞 +7 (999) 000-00-00</a></li>
            <li><a href="mailto:info@granistraha.ru">✉ info@granistraha.ru</a></li>
            <li><a>🕐 Пн–Вс 10:00–23:00</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 ГРАНИ СТРАХА. Все права защищены.</div>
        <div className="footer-social">
          <a href="#" className="social-btn">VK</a>
          <a href="#" className="social-btn">TG</a>
          <a href="#" className="social-btn">IG</a>
          <a href="#" className="social-btn">YT</a>
        </div>
      </div>
    </footer>
  );
}
