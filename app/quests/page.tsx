import QuestsGrid from "@/components/QuestsGrid";
import CtaBand from "@/components/CtaBand";
import { readQuests } from "@/lib/quests";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const quests = await readQuests();

  return (
    <>
      <div className="section-hero">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="eyebrow">Каталог</div>
          <h1 className="h1">
            Все <em>квесты</em>
          </h1>
        </div>
      </div>

      <div className="section">
        <QuestsGrid quests={quests} />
      </div>

      <CtaBand
        title={
          <>
            Готов <em>войти?</em>
          </>
        }
        sub="Звони — забронируем место"
        buttons={
          <a className="btn btn-primary" href="tel:+79145163188">
            +7 (914) 516-31-88
          </a>
        }
      />
    </>
  );
}
