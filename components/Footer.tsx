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
            декорации, незабываемые впечатления.
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
          <ul className="footer-links footer-contacts">
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21c-4.418-4.418-7-7.582-7-10a7 7 0 1 1 14 0c0 2.418-2.582 5.582-7 10z"/><circle cx="12" cy="11" r="2.5"/></svg>
              Ул. Недорезова 7В (цокольный этаж)
            </li>
            <li>
              <a href="tel:+79145163188" style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/></svg>
                +7 (914) 516-31-88
              </a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Режим работы: круглосуточно
            </li>
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
