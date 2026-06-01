const TICKER_ITEMS = [
  "◉ Открыта запись на ноябрь",
  "◉ Новый квест: «Корабль мертвецов»",
  "◉ Скидка 15% на групповые брони",
  "◉ Подарочные сертификаты со скидкой 10%",
  "◉ Корпоративные пакеты от 20 человек",
];

export default function Ticker() {
  // Дублируем чтобы анимация прокрутки была бесшовной
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-bar">
      <div className="ticker-inner">
        {items.map((t, i) => (
          <span key={i}>
            <em>◉</em>
            {t.replace("◉ ", "")}
          </span>
        ))}
      </div>
    </div>
  );
}
