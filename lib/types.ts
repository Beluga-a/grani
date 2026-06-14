export interface Quest {
  id: number;
  name: string;
  fear: number;
  diff: number;
  players: string;
  time: string;
  age: string;
  rating: string;
  reviews: number;
  badge: string;
  basePrice: number;
  baseUpTo: number;
  extraPrice: number;
  icon: string;
  photo?: string;
  video?: string;
  desc: string;
  full: string;
  tags: string[];
  atmosphere: string[];
  included: string[];
  schedule: string;
}

export interface Review {
  name: string;
  quest: string;
  rating: number;
  text: string;
  date: string;
  av: string;
}

export interface FaqItem {
  cat: string;
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  label: string;
}

export type RuleBlock =
  | { type: "text"; t: string }
  | { type: "warn"; t: string }
  | { type: "list"; items: string[] };

export interface RuleSection {
  id: string;
  title: string;
  items: RuleBlock[];
}

export interface Advantage {
  title: string;
  text: string;
  svg: string;
}
