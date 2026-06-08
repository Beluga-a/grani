import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "reviews.json");

export interface ReviewRecord {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  quest: string;
  rating: number;
  text: string;
  date: string;
}

export function readReviews(): ReviewRecord[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeReviews(reviews: ReviewRecord[]): void {
  fs.writeFileSync(FILE, JSON.stringify(reviews, null, 2), "utf-8");
}
