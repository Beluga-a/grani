import type { Quest } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface Props {
  quest: Quest;
  onClick: () => void;
}

export default function QuestCard({ quest, onClick }: Props) {
  return (
    <button className="qcard" onClick={onClick} type="button">
      <div className="qcard-img">
        {quest.photo ? (
          <img src={quest.photo} alt={quest.name} className="qcard-photo" />
        ) : (
          <div className="qcard-img-inner">{quest.icon}</div>
        )}
      </div>
      <div className="qcard-body">
        <div className="qcard-top">
          <span className="qcard-badge">{quest.badge}</span>
          <span className="qcard-rating">★ {quest.rating}</span>
        </div>
        <div className="qcard-name">{quest.name}</div>
        <div className="qcard-desc">{quest.desc}</div>
        <div className="qcard-fear" title="Уровень страха">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`fear-dot ${i < quest.fear ? "on" : ""}`}
            />
          ))}
        </div>
        <div className="qcard-meta">
          <span>👥 {quest.players}</span>
          <span>⏱ {quest.time}</span>
          <span>{quest.age}</span>
        </div>
        <div className="qcard-footer">
          <span className="qcard-price">{formatPrice(quest)}</span>
          <span className="qcard-rating" style={{ color: "var(--red)" }}>→</span>
        </div>
      </div>
    </button>
  );
}
