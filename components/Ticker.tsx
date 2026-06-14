const TICKER_ITEMS = [
  "◉ Скидка в честь дня рождения 10%",
  "◉ В наличии подарочные сертификаты",
  "◉ Работаем круглосуточно",
  "◉ Новый квест: «Зов нерождённого»",
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
