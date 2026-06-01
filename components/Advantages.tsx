import { ADVANTAGES } from "@/data/advantages";

export default function Advantages() {
  return (
    <div
      style={{
        background: "var(--off-black)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section">
        <div className="eyebrow">Преимущества</div>
        <h2 className="h2" style={{ marginBottom: 48 }}>
          Почему <em>мы</em>
        </h2>
        <div className="adv-grid">
          {ADVANTAGES.map((a, i) => (
            <div className="adv-item" key={a.title}>
              <div className="adv-num">// 0{i + 1}</div>
              <div className="adv-icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  dangerouslySetInnerHTML={{ __html: a.svg }}
                />
              </div>
              <div className="adv-title">{a.title}</div>
              <div className="adv-text">{a.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
