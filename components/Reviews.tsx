"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import type { ReviewRecord } from "@/lib/reviews";

const QUEST_NAMES = ["Бункер 404", "Тайна отеля", "Проклятие монахини"];

function Avatar({ review }: { review: ReviewRecord }) {
  if (review.avatar) {
    return (
      <img
        src={review.avatar}
        alt={review.name}
        className="ravatar"
        style={{ objectFit: "cover" }}
      />
    );
  }
  return <div className="ravatar">{review.name[0].toUpperCase()}</div>;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: 26,
            cursor: "pointer",
            color: s <= (hover || value) ? "var(--red)" : "var(--muted)",
            transition: "color .15s",
          }}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [quest, setQuest] = useState(QUEST_NAMES[0]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const card = el.firstElementChild as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 12 : el.clientWidth;
    setCurrent(Math.round(el.scrollLeft / cardW));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest, rating, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ошибка");
      } else {
        setSuccess(true);
        setText("");
        setRating(5);
        setShowForm(false);
        fetchReviews();
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setSubmitting(false);
    }
  };

  const items = reviews.slice(0, 6);

  return (
    <section className="section" id="reviews">
      <div className="eyebrow">Отзывы</div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 48,
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Они <em>пережили</em> это
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {session ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setSuccess(false);
                setError("");
              }}
            >
              {showForm ? "Отмена" : "Оставить отзыв"}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => signIn("google")}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <GoogleIcon />
              Войти через Google
            </button>
          )}
        </div>
      </div>

      {showForm && session && (
        <form
          onSubmit={handleSubmit}
          className="review-form"
        >
          <div className="review-form-row">
            <div className="review-form-field">
              <label className="review-form-label">Квест</label>
              <select
                className="review-form-select"
                value={quest}
                onChange={(e) => setQuest(e.target.value)}
              >
                {QUEST_NAMES.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div className="review-form-field">
              <label className="review-form-label">Оценка</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
          </div>
          <div className="review-form-field">
            <label className="review-form-label">Ваш отзыв</label>
            <textarea
              className="review-form-textarea"
              placeholder="Расскажите о своём опыте..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
            />
          </div>
          {error && (
            <div style={{ color: "var(--red)", fontSize: 13 }}>{error}</div>
          )}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Отправка..." : "Отправить отзыв"}
          </button>
        </form>
      )}

      {success && (
        <div
          style={{
            background: "var(--panel)",
            border: "1px solid #1e3a1e",
            color: "#7fd17f",
            padding: "14px 20px",
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          Спасибо! Ваш отзыв опубликован.
        </div>
      )}

      {items.length === 0 ? (
        <div
          style={{
            color: "var(--text-soft)",
            fontSize: 14,
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          Пока нет отзывов. Будьте первым!
        </div>
      ) : (
        <>
          <div className="reviews-grid" ref={scrollRef} onScroll={handleScroll}>
            {items.map((r) => (
              <div className="rcard" key={r.id}>
                <div className="rcard-head">
                  <Avatar review={r} />
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
          <div className="swipe-dots">
            {items.map((_, i) => (
              <div
                key={i}
                className={`swipe-dot${i === current ? " active" : ""}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
