/** Thứ tự 12 chương trùng file dữ liệu + nhãn tiếng Việt ngắn */
export const CHAPTER_ORDER = [
  "運転の基礎知識",
  "道路の走行方法",
  "追い越し・駐停車",
  "標識・標示・信号",
  "危険な状況での運転",
  "総合演習1",
  "総合演習2",
  "総合演習3",
  "総合演習4",
  "総合演習5",
  "総合演習6【イラスト問題】",
  "危険予測【イラスト問題】",
] as const;

const VI_LABEL: Record<string, string> = {
  "運転の基礎知識": "Kiến thức cơ bản",
  "道路の走行方法": "Cách chạy xe trên đường",
  "追い越し・駐停車": "Vượt xe · dừng đỗ",
  "標識・標示・信号": "Biển báo · kẻ đường · đèn",
  "危険な状況での運転": "Lái trong tình huống nguy hiểm",
  "総合演習1": "Ôn tập tổng hợp 1",
  "総合演習2": "Ôn tập tổng hợp 2",
  "総合演習3": "Ôn tập tổng hợp 3",
  "総合演習4": "Ôn tập tổng hợp 4",
  "総合演習5": "Ôn tập tổng hợp 5",
  "総合演習6【イラスト問題】": "Ôn tập 6 (minh họa)",
  "危険予測【イラスト問題】": "Dự đoán nguy hiểm (minh họa)",
};

export function chapterVietnamese(jp: string): string {
  return VI_LABEL[jp] ?? jp;
}
