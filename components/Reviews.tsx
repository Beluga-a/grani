import { REVIEWS } from "@/data/reviews";

export default function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="eyebrow">Отзывы</div>
      <h2 className="h2" style={{ marginBottom: 48 }}>
        Они <em>пережили</em> это
      </h2>
      <div className="reviews-grid">
        {REVIEWS.slice(0, 6).map((r, i) => (
          <div className="rcard" key={i}>
            <div className="rcard-head">
              <div className="ravatar">{r.av}</div>
              <div style={{ flex: 1 }}>
                <div className="rname">{r.name}</div>
                <div className="rdate">{r.date}</div>
              </div>
              <div className="rstars">{"★".repeat(r.rating)}</div>
            </div>
            <div className="rquest">// {r.quest}</div>
            <div className="rtext">«{r.text}»</div>
          </div>
        ))}
      </div>
    </section>
  );
}
