"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Главная" },
  { href: "/quests", label: "Квесты" },
  { href: "/rules", label: "Правила" },
  { href: "/faq", label: "Часто задаваемые вопросы" },
  { href: "/feartest", label: "Тест на страх" },
  { href: "/certificates", label: "Сертификаты" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Закрываем меню при смене страницы
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="nav-logo">
        <svg className="nav-logo-svg" viewBox="0 0 587 494" aria-hidden="true">
          <use href="#logoMark" />
        </svg>
        <div className="nav-logo-text">
          <strong>ГРАНИ СТРАХА</strong>
          <small>Horror Quest</small>
        </div>
      </Link>

      <ul className={`nav-center ${open ? "open" : ""}`}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <span className="nav-phone">+7 (999) 000-00-00</span>
        {session ? (
          <div className="nav-user">
            {session.user?.image && (
              <img src={session.user.image} alt="" className="nav-user-avatar" />
            )}
            <span className="nav-user-name">{session.user?.name}</span>
            <button className="nav-user-out" onClick={() => signOut()}>Выйти</button>
          </div>
        ) : null}
        <button
          className={`burger ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
