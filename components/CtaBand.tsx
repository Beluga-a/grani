import Link from "next/link";

interface Props {
  title: React.ReactNode;
  sub?: string;
  buttons?: React.ReactNode;
}

export default function CtaBand({ title, sub, buttons }: Props) {
  return (
    <div className="cta-band">
      <h2 className="cta-band-title">{title}</h2>
      {sub && <p className="cta-band-sub">{sub}</p>}
      <div className="cta-band-btns">
        {buttons || (
          <>
            <Link className="btn btn-primary" href="/quests">
              Смотреть квесты
            </Link>
            <a className="btn btn-outline" href="tel:+79145163188">
              +7 (914) 516-31-88
            </a>
          </>
        )}
      </div>
    </div>
  );
}
