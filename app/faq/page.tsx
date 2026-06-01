import FaqAccordion from "@/components/FaqAccordion";
import CtaBand from "@/components/CtaBand";

export const metadata = { title: "FAQ — ГРАНИ СТРАХА" };

export default function FaqPage() {
  return (
    <>
      <div className="section-hero">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="eyebrow">Помощь</div>
          <h1 className="h1">
            Часто задаваемые <em>вопросы</em>
          </h1>
        </div>
      </div>
      <div className="section">
        <FaqAccordion />
      </div>
      <CtaBand
        title={
          <>
            Не нашёл <em>ответ?</em>
          </>
        }
        sub="Позвони нам — расскажем всё"
        buttons={
          <>
            <a className="btn btn-primary" href="tel:+79990000000">
              +7 (999) 000-00-00
            </a>
            <a className="btn btn-outline" href="mailto:info@granistraha.ru">
              info@granistraha.ru
            </a>
          </>
        }
      />
    </>
  );
}
