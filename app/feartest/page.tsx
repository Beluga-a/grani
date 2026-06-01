import FeartestQuiz from "@/components/FeartestQuiz";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

export default function FeartestPage() {
  return (
    <>
      <div className="section-hero">
        <div className="eyebrow">Интерактив</div>
        <h1 className="h1">Тест на страх</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 12, fontSize: 14, maxWidth: 520 }}>
          Ответьте на 4 вопроса — мы подберём квест именно под вашу смелость
        </p>
      </div>

      <section className="section">
        <FeartestQuiz />
      </section>

      <CtaBand
        title={<>Готов <em>войти?</em></>}
        sub="Бронируй квест и проверь себя на прочность"
      />
      <Footer />
    </>
  );
}
