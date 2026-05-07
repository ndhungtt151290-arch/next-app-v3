/**
 * Cấu trúc chương — 13 chương, khớp 100% với chapterOrder trong questions.merged.json.
 *
 * CHAPTER_ORDER = CHAPTERS.map(c => c.jp) — dùng JP name vì đó là key trong data.
 * GentsukiApp.tsx dùng CHAPTER_ORDER_FROM_DATA (từ questions.merged.json) để render,
 * rồi CHAPTER_MAP để chuyển JP name → JP name (identity) cho logic lọc câu hỏi.
 *
 * Thứ tự chapters (đúng với chapterOrder trong data):
 *  1  運転の基礎知識
 *  2  標識・標示・信号
 *  3  道路の走行方法
 *  4  追い越し・駐停車
 *  5  危険な状況での運転
 *  6  総合演習1
 *  7  総合演習2
 *  8  総合演習3
 *  9  総合演習4
 * 10  総合演習5
 * 11  危険予測【イラスト問題】
 * 12  総合演習6【イラスト問題】
 */
export type ChapterDef = {
  id: string;
  jp: string;
  vi: string;
  /** Các sub-chapter name (JP gốc) — dùng để filter dữ liệu */
  subs?: string[];
};

/** 12 chương theo đúng thứ tự trong questions.merged.json */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "ch1",
    jp: "運転の基礎知識",
    vi: "Kiến thức cơ bản về lái xe",
  },
  {
    id: "ch2",
    jp: "標識・標示・信号",
    vi: "Biển báo · Kẻ đường · Đèn tín hiệu",
  },
  {
    id: "ch3",
    jp: "道路の走行方法",
    vi: "Cách chạy xe trên đường",
  },
  {
    id: "ch4",
    jp: "追い越し・駐停車",
    vi: "Vượt xe · Dừng đỗ",
  },
  {
    id: "ch5",
    jp: "危険な状況での運転",
    vi: "Lái xe trong tình huống nguy hiểm",
  },
  {
    id: "ch6",
    jp: "総合演習1",
    vi: "Ôn tập tổng hợp 1",
  },
  {
    id: "ch7",
    jp: "総合演習2",
    vi: "Ôn tập tổng hợp 2",
  },
  {
    id: "ch8",
    jp: "総合演習3",
    vi: "Ôn tập tổng hợp 3",
  },
  {
    id: "ch9",
    jp: "総合演習4",
    vi: "Ôn tập tổng hợp 4",
  },
  {
    id: "ch10",
    jp: "総合演習5",
    vi: "Ôn tập tổng hợp 5",
  },
  {
    id: "ch11",
    jp: "危険予測【イラスト問題】",
    vi: "Dự đoán nguy hiểm",
  },
  {
    id: "ch12",
    jp: "総合演習6【イラスト問題】",
    vi: "Ôn tập hình ảnh 6",
  },
];

/** Tên tiếng Việt theo JP name */
export const CHAPTER_VI: Record<string, string> = Object.fromEntries(
  CHAPTERS.map((c) => [c.jp, c.vi])
);

/** Tên tiếng Nhật theo JP name */
export const CHAPTER_JP: Record<string, string> = Object.fromEntries(
  CHAPTERS.map((c) => [c.jp, c.jp])
);

/** Map JP name → JP name (identity, CHAPTER_ORDER dùng JP name rồi) */
export const CHAPTER_MAP: Record<string, string> = Object.fromEntries(
  CHAPTERS.map((c) => [c.jp, c.jp])
);

/** Lấy JP name từ chapter key */
export function chapterSubs(id: string): string[] {
  const c = CHAPTERS.find((x) => x.jp === id);
  return c?.subs ?? [c?.jp ?? id];
}
