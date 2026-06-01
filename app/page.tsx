import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import QuestsGrid from "@/components/QuestsGrid";
import Advantages from "@/components/Advantages";
import Reviews from "@/components/Reviews";
import CtaBand from "@/components/CtaBand";
import Link from "next/link";
import { readQuests } from "@/lib/quests";

// Этот roum принудительно перерендеривается на каждый запрос —
// чтобы изменения в quests.json от бота были видны сразу
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const quests = await readQuests();

  return (
    <>
      <Hero />
      <Ticker />

      <section className="section">
        <div className="eyebrow">Популярные квесты</div>
        <h2 className="h2" style={{ marginBottom: 48 }}>
          Выбери свой <em>кошмар</em>
        </h2>
        <QuestsGrid quests={quests} limit={3} />
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link className="btn btn-outline" href="/quests">
            Все квесты →
          </Link>
        </div>
      </section>

      <Advantages />
      <Reviews />

      {/* ── STATS ── */}
      <div className="stats-row">
        {[
          { n: "6+",   l: "лет работы" },
          { n: "4",    l: "квеста" },
          { n: "50К+", l: "игроков" },
          { n: "4.9",  l: "рейтинг" },
        ].map((s) => (
          <div key={s.l} className="stat-cell">
            <div className="stat-num">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── ABOUT / STORY ── */}
      <section className="section">
        <div className="eyebrow">О компании</div>
        <h2 className="h2" style={{ marginBottom: 48 }}>
          Как всё <em>начиналось</em>
        </h2>
        <div className="about-story">
          <p>
            Всё началось с общей страсти к мистике, загадкам и острым ощущениям.
            Несколько лет назад мы часто обсуждали, как здорово было бы создать
            что-то по-настоящему необычное — не просто развлечение, а настоящее
            приключение, где каждый сможет испытать себя на прочность.
          </p>
          <p>
            Вдохновлялись классическими фильмами ужасов, городскими легендами и
            историями о заброшенных местах. Постепенно идея переросла в конкретный
            план: создать пространство, где атмосфера, сюжет и загадки погружают
            участников в другой мир. Мы хотели, чтобы люди не просто играли, а
            проживали историю, забывая о реальности.
          </p>
          <p>
            Начали с небольших экспериментов: собирали реквизит, продумывали
            сценарии, тестировали первые комнаты на друзьях. Каждый новый квест
            рождался из обсуждений, споров и желания сделать что-то по-настоящему
            крутое и страшное. Со временем появились «Бункер 404», «Тайна отеля»,
            «Проклятие монахини» — каждый со своей уникальной атмосферой и тайной.
          </p>
          <p>
            Сегодня мы гордимся тем, что наши квесты стали местом, где люди
            получают незабываемые эмоции, учатся работать в команде и открывают
            для себя новые грани смелости. Но для нас это только начало — впереди
            ещё много мрачных историй и загадок, которые ждут своих героев.
          </p>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Осмелишься<em>?</em>
          </>
        }
        sub="Выбери квест и звони — мы всё расскажем"
      />
    </>
  );
}
