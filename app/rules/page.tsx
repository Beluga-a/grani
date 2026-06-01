import RulesLayout from "@/components/RulesLayout";

export const metadata = { title: "Правила — ГРАНИ СТРАХА" };

export default function RulesPage() {
  return (
    <>
      <div className="section-hero">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="eyebrow">Документация</div>
          <h1 className="h1">
            Правила <em>посещения</em>
          </h1>
        </div>
      </div>
      <div className="section">
        <RulesLayout />
      </div>
    </>
  );
}
