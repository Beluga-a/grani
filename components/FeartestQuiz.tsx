"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    id: 1,
    text: "Вам предлагают провести ночь в заброшенном доме. Ваша реакция?",
    options: [
      { label: "A", text: "Откажусь наотрез." },
      { label: "B", text: "Подумаю, но, скорее всего, не соглашусь." },
      { label: "C", text: "Соглашусь, если будут другие люди." },
      { label: "D", text: "С удовольствием соглашусь." },
    ],
  },
  {
    id: 2,
    text: "Как вы относитесь к просмотру фильмов ужасов в одиночестве?",
    options: [
      { label: "A", text: "Никогда не смотрю один/одна." },
      { label: "B", text: "Могу посмотреть, но потом долго не могу уснуть." },
      { label: "C", text: "Смотрю спокойно, но иногда бывает не по себе." },
      { label: "D", text: "Обожаю смотреть ужасы в одиночестве." },
    ],
  },
  {
    id: 3,
    text: "Вы идёте по коридору, и внезапно гаснет свет. Что вы сделаете?",
    options: [
      { label: "A", text: "Останусь на месте и позову на помощь." },
      { label: "B", text: "Постараюсь быстро найти выход." },
      { label: "C", text: "Включу фонарик и пойду дальше." },
      { label: "D", text: "Не обращу внимания, продолжу идти." },
    ],
  },
  {
    id: 4,
    text: "Как вы относитесь к неожиданным прикосновениям сзади?",
    options: [
      { label: "A", text: "Очень пугаюсь и вскрикиваю." },
      { label: "B", text: "Вздрагиваю, но быстро прихожу в себя." },
      { label: "C", text: "Раздражаюсь, но не боюсь." },
      { label: "D", text: "Вообще не реагирую." },
    ],
  },
];

const RESULTS = [
  {
    range: [4, 6],
    title: "Осторожный искатель",
    desc: "Вы осторожны — чуткость к опасности ваша сила. Начните с атмосферного приключения без жёсткого страха.",
    quest: "Бункер 404",
    questDesc: "Радиационный бункер, загадки и тайна военных. Страшно, но без живых актёров в догонялки.",
    fear: 4,
  },
  {
    range: [7, 10],
    title: "Любопытный смельчак",
    desc: "Вы готовы к приключениям и умеете справляться со страхом. Самое время для загадочной истории.",
    quest: "Тайна отеля",
    questDesc: "Заброшенный отель с секретами в каждой комнате. Детективные загадки + атмосфера ужаса.",
    fear: 3,
  },
  {
    range: [11, 16],
    title: "Бесстрашный герой",
    desc: "Вы настоящий бесстрашный. Вам нужно максимальное испытание — то, от чего у других кровь стынет в жилах.",
    quest: "Проклятие монахини",
    questDesc: "Заброшенный монастырь, живая монахиня и мрачные легенды. Самый жёсткий квест в нашей линейке.",
    fear: 5,
  },
];

export default function FeartestQuiz() {
  const [step, setStep] = useState(0);           // текущий вопрос (0–3)
  const [answers, setAnswers] = useState<number[]>([]); // очки за каждый вопрос
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const score = answers.reduce((s, v) => s + v, 0);
  const result = RESULTS.find((r) => score >= r.range[0] && score <= r.range[1]) ?? RESULTS[2];

  function pick(val: number) {
    const next = [...answers, val];
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  if (done) {
    return (
      <div className="ft-result-full">
        <div className="ft-result-eyebrow">Ваш результат</div>
        <div className="ft-result-title">{result.title}</div>
        <p className="ft-result-desc">{result.desc}</p>
        <div className="ft-result-quest">
          <div className="ft-rq-label">Рекомендуем квест</div>
          <div className="ft-rq-name">«{result.quest}»</div>
          <div className="ft-fear-scale">
            {[1, 2, 3, 4, 5].map((d) => (
              <div key={d} className={`ft-fear-dot ${d <= result.fear ? "on" : ""}`} />
            ))}
            <span className="ft-fear-label">Уровень страха</span>
          </div>
          <p className="ft-rq-desc">{result.questDesc}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/quests" className="btn btn-primary">Забронировать квест →</Link>
            <button className="btn btn-outline" onClick={restart}>Пройти заново</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ft-step">
      <div className="ft-progress">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`ft-progress-dot ${i < step ? "done" : i === step ? "active" : ""}`} />
        ))}
        <span className="ft-progress-label">{step + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="ft-q-num">{String(step + 1).padStart(2, "0")}</div>
      <div className="ft-q-text">{q.text}</div>

      <div className="ft-options">
        {q.options.map((opt, oi) => (
          <button
            key={opt.label}
            className="ft-option"
            onClick={() => pick(oi + 1)}
          >
            <span className="ft-opt-label">{opt.label}</span>
            <span className="ft-opt-text">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
