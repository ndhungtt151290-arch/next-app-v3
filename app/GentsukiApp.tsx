"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bankRaw from "./data/questions.vi.json";
import { CHAPTER_ORDER, chapterVietnamese } from "./lib/chapters";
import {
  buildMockExam,
  questionsForChapter,
  scoreExam,
} from "./lib/exam";
import type { ExamItem, MaruBatsu, QuestionBank, ScenarioGroup } from "./lib/types";

const bank = bankRaw as unknown as QuestionBank;
const PASS_SCORE = 45;
const EXAM_SECONDS = 30 * 60;

export type Lang = "jp" | "vi";

/* ─────────────────────────── Flag-button ──────────────────────────── */
const FLAG_ICONS: Record<Lang, string> = {
  jp: "🇯🇵",
  vi: "🇻🇳",
};
const FLAG_LABELS: Record<Lang, Record<Lang, string>> = {
  jp: { jp: "日本語", vi: "Tiếng Việt" },
  vi: { jp: "Người Nhật", vi: "Tiếng Việt" },
};

function LangSwitch(props: {
  lang: Lang;
  onToggle: () => void;
  className?: string;
}) {
  const { lang, onToggle, className = "" } = props;
  return (
    <button
      type="button"
      onClick={onToggle}
      title={FLAG_LABELS[lang][lang === "jp" ? "vi" : "jp"]}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border-2 border-amber-950 shadow-sm transition active:scale-95 ${className}`}
      style={{
        background: lang === "jp"
          ? "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)"
          : "linear-gradient(135deg, #ff3b30 0%, #cc2b22 100%)",
        color: lang === "jp" ? "#1a1a1a" : "#ffffff",
      }}
    >
      <span aria-hidden>{FLAG_ICONS[lang]}</span>
      <span className="hidden sm:inline">{FLAG_LABELS[lang][lang === "jp" ? "vi" : "jp"]}</span>
    </button>
  );
}

/* ─────────────────────────── helpers ─────────────────────────────── */
const HOME = "/home";
const HOME_BG = "/bgs/bgh.jpg";
const PRACTICE_BG = "/bgs/Q9.png";
const HOME_HERO = `${HOME}/s2.png`;
const HOME_CTA_BADGE = `${HOME}/s3.png`;
const HOME_TILE_ART = [`${HOME}/s4.png`, `${HOME}/s5.png`, `${HOME}/s6.png`];

function homeTileArt(index: number): string {
  return HOME_TILE_ART[index % HOME_TILE_ART.length]!;
}

function imgSrc(name?: string) {
  if (!name) return null;
  return `/images/${encodeURIComponent(name)}`;
}

/* ─────────────────────────── components ──────────────────────────── */
type View =
  | { mode: "home" }
  | { mode: "chapter"; chapter: string }
  | { mode: "exam" }
  | { mode: "results"; paper: ExamItem[] }
  | { mode: "review"; paper: ExamItem[] };

function IllustrationImage(props: {
  file?: string;
  className?: string;
  imgClassName?: string;
}) {
  const { file, className, imgClassName } = props;
  const src = imgSrc(file);
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 text-neutral-500 text-xs ${className ?? ""}`}
      >
        図
      </div>
    );
  }
  return (
    <div
      className={`overflow-hidden bg-neutral-100 border-2 border-amber-950/40 flex items-center justify-center ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={imgClassName ?? "max-w-full max-h-full object-contain"}
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = "none";
        }}
      />
    </div>
  );
}

function MaruBatsuButtons(props: {
  disabled?: boolean;
  value?: MaruBatsu;
  onPick: (v: MaruBatsu) => void;
}) {
  const { disabled, value, onPick } = props;
  const base =
    "min-w-[88px] py-3 rounded-lg font-bold text-2xl border-4 border-amber-950 shadow-md transition active:scale-95 active:opacity-70 disabled:opacity-40";
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPick("○")}
        className={`${base} ${
          value === "○"
            ? "bg-emerald-600 text-white ring-2 ring-amber-200"
            : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white"
        }`}
      >
        ○
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPick("×")}
        className={`${base} ${
          value === "×"
            ? "bg-rose-700 text-white ring-2 ring-amber-200"
            : "bg-gradient-to-b from-rose-500 to-rose-800 text-white"
        }`}
      >
        ×
      </button>
    </div>
  );
}

/* ──────────────── bilingual text helper ──────────────── */
function tx<T extends string | null | undefined>(
  jp: T,
  vi: T,
  lang: Lang
): string {
  if (lang === "vi" && vi) return vi;
  if (jp) return jp;
  return "";
}

/* ──────────────── HomeScreen ──────────────── */
function HomeScreen(props: {
  lang: Lang;
  onLangToggle: () => void;
  onStartExam: () => void;
  onChapter: (chapter: string) => void;
}) {
  const { lang, onLangToggle, onStartExam, onChapter } = props;
  return (
    <div className="relative mx-auto w-full max-w-[430px] z-10">
      <div
        className="relative rounded-[1.75rem] border-2 border-black/20 bg-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-[3px] flex flex-col overflow-hidden"
        style={{
          height: "100dvh",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(0.875rem, env(safe-area-inset-left))",
          paddingRight: "max(0.875rem, env(safe-area-inset-right))",
          zIndex: 50,
        }}
      >
        {/* Language toggle — top-right corner */}
        <div className="shrink-0 flex justify-end relative z-[101]">
          <LangSwitch
            lang={lang}
            onToggle={onLangToggle}
            className="absolute top-2 right-2"
          />
        </div>

        {/* Header area */}
        <div className="flex flex-col items-center shrink-0 relative z-[100]" style={{ width: "100%" }}>
          <img
            src="/home/s1.png"
            alt=""
            className="w-full max-w-[280px] object-contain"
            style={{ maxWidth: "280px", width: "180px" }}
          />
          <img
            src={HOME_HERO}
            alt=""
            className="h-[4.25rem] w-auto max-w-[200px] object-contain drop-shadow-md"
          />
          <button
            type="button"
            onClick={onStartExam}
            className="w-full max-w-[22rem] transition active:scale-[0.96] active:opacity-80 mt-1 relative z-[100] pointer-events-auto"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <img
              src="/home/s3.png"
              alt={lang === "vi" ? "Bắt đầu thi thử" : "模擬試験を始める"}
              className="w-full h-auto object-contain pointer-events-none"
            />
          </button>
        </div>

        {/* Body: chapter grid */}
        <div
          className="flex-1 overflow-y-auto mt-3 relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", zIndex: 10 }}
        >
          <style>{`.flex-1.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-3"
            style={{ columnGap: "16px", rowGap: "12px", paddingBottom: "0.5rem" }}
          >
            {CHAPTER_ORDER.map((ch) => {
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => onChapter(ch)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-[1.35rem] border border-white/50 px-2 py-2 text-center transition active:scale-[0.96] active:opacity-70"
                  style={{
                    background: "linear-gradient(180deg, #f7f7f7 0%, #e6e6e6 100%)",
                    boxShadow:
                      "inset 2px 2px 5px rgba(255,255,255,0.85), inset -2px -3px 6px rgba(0,0,0,0.08), 3px 5px 12px rgba(0,0,0,0.14)",
                    minHeight: "52px",
                  }}
                >
                  <span className="line-clamp-2 text-[0.65rem] font-bold leading-tight text-neutral-900 select-none">
                    {chapterVietnamese(ch)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="shrink-0 text-center font-serif text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-black/80 pt-1 select-none relative z-[100]">
          CREATED BY DUYHUNG
        </p>
      </div>
    </div>
  );
}

/* ──────────────── ChapterView ──────────────── */
function ChapterView(props: {
  lang: Lang;
  chapter: string;
  onBack: () => void;
}) {
  const { lang, chapter, onBack } = props;
  const { simple, scenarios } = useMemo(
    () => questionsForChapter(bank, chapter),
    [chapter]
  );
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<Record<string, MaruBatsu | undefined>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});

  const flat: Array<
    | { kind: "s"; q: (typeof simple)[0]; i: number }
    | { kind: "g"; g: ScenarioGroup; i: number }
  > = [];
  let i = 0;
  for (const q of simple) flat.push({ kind: "s", q, i: i++ });
  for (const g of scenarios) flat.push({ kind: "g", g, i: i++ });

  const cur = flat[idx];
  const total = flat.length;

  if (total === 0) {
    return (
      <div className="text-amber-50 space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="text-amber-200 underline active:opacity-70 transition"
        >
          ← {lang === "vi" ? "Quay lại" : "戻る"}
        </button>
        <p>{lang === "vi" ? "Chưa có dữ liệu cho chương này." : "この章のデータはまだありません。"}</p>
      </div>
    );
  }

  const LABELS = {
    prev: lang === "vi" ? "← Trước" : "← 前へ",
    next: lang === "vi" ? "Sau →" : "次へ →",
    hideAns: lang === "vi" ? "Ẩn đáp án" : "答えを隠す",
    showAns: lang === "vi" ? "Xem đáp án & giải thích" : "答えと解説を見る",
    correct: lang === "vi" ? "Đúng:" : "正解：",
    answer: lang === "vi" ? "Đáp án:" : "答え：",
    hide: lang === "vi" ? "Ẩn" : "隠す",
    show: lang === "vi" ? "Đáp án" : "答え",
    progress: lang === "vi"
      ? (n: number, t: number) => `${n} / ${t}`
      : (n: number, t: number) => `${n} / ${t}`,
  };

  return (
    <div className="space-y-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <button
        type="button"
        onClick={onBack}
        className="text-amber-200 text-sm underline active:opacity-70 transition"
      >
        ← {lang === "vi" ? "Trang chủ" : "ホーム"}
      </button>
      <h2 className="text-amber-50 font-bold text-sm leading-snug">
        {chapter}
        <span className="block text-amber-200/80 text-xs font-normal mt-1">
          {chapterVietnamese(chapter)}
        </span>
      </h2>
      <p className="text-amber-100/80 text-xs">
        {LABELS.progress(idx + 1, total)}
      </p>

      {cur.kind === "s" && (
        <div className="tile-card space-y-4 p-4">
          {cur.q.image && (
            <IllustrationImage
              file={cur.q.image}
              className="w-full max-h-48 rounded-lg shrink-0"
              imgClassName="w-full h-full max-h-48 object-contain"
            />
          )}
          <p className="text-sm leading-relaxed font-medium text-neutral-900">
            {tx(cur.q.text, cur.q.textVi, lang)}
          </p>
          <MaruBatsuButtons
            value={ans[cur.q.id]}
            onPick={(v) => setAns((a) => ({ ...a, [cur.q.id]: v }))}
          />
          {ans[cur.q.id] && (
            <button
              type="button"
              className="text-sm text-red-900 underline active:opacity-70 transition"
              onClick={() =>
                setShow((s) => ({ ...s, [cur.q.id]: !s[cur.q.id] }))
              }
            >
              {show[cur.q.id] ? LABELS.hideAns : LABELS.showAns}
            </button>
          )}
          {show[cur.q.id] && (
            <div className="text-sm bg-white/80 rounded p-3 border border-amber-900/30">
              <p>
                <strong>{LABELS.correct}</strong> {cur.q.answer}
              </p>
              <p className="mt-2 text-neutral-800">
                {tx(cur.q.explanation, cur.q.explanationVi, lang)}
              </p>
            </div>
          )}
        </div>
      )}

      {cur.kind === "g" && (
        <ScenarioPracticeBlock
          lang={lang}
          group={cur.g}
          values={ans}
          show={show}
          onPick={(partId, v) => setAns((a) => ({ ...a, [partId]: v }))}
          onToggleExplain={(key) =>
            setShow((s) => ({ ...s, [key]: !s[key] }))
          }
        />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((x) => Math.max(0, x - 1))}
          className="flex-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 disabled:opacity-30 active:opacity-70 transition"
        >
          {LABELS.prev}
        </button>
        <button
          type="button"
          disabled={idx >= total - 1}
          onClick={() => setIdx((x) => Math.min(total - 1, x + 1))}
          className="flex-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 disabled:opacity-30 active:opacity-70 transition"
        >
          {LABELS.next}
        </button>
      </div>
    </div>
  );
}

/* ──────────────── ScenarioPracticeBlock ──────────────── */
function ScenarioPracticeBlock(props: {
  lang: Lang;
  group: ScenarioGroup;
  values: Record<string, MaruBatsu | undefined>;
  show: Record<string, boolean>;
  onPick: (partId: string, v: MaruBatsu) => void;
  onToggleExplain: (key: string) => void;
}) {
  const { lang, group, values, show, onPick, onToggleExplain } = props;
  const L = {
    answer: lang === "vi" ? "Đáp án:" : "答え：",
    hide: lang === "vi" ? "Ẩn" : "隠す",
    show: lang === "vi" ? "Đáp án" : "答え",
  };
  return (
    <div className="tile-card space-y-4 p-4">
      <p className="text-sm font-semibold text-neutral-900">
        {tx(group.stem, group.stemVi, lang)}
      </p>
      {group.subs.map((sub) => {
        return (
          <div
            key={sub.partId}
            className="border-t border-amber-900/20 pt-3 space-y-2"
          >
            <div className="flex gap-3 items-start">
              <IllustrationImage
                file={sub.image}
                className="w-24 h-20 shrink-0 rounded"
                imgClassName="w-full h-full object-contain"
              />
              <p className="text-sm flex-1 text-neutral-900">
                【{sub.subKey}】{tx(sub.text, sub.textVi, lang)}
              </p>
            </div>
            <MaruBatsuButtons
              value={values[sub.partId]}
              onPick={(v) => onPick(sub.partId, v)}
            />
            {values[sub.partId] && (
              <button
                type="button"
                className="text-xs text-red-900 underline active:opacity-70 transition"
                onClick={() => onToggleExplain(sub.partId)}
              >
                {show[sub.partId] ? L.hide : L.show}
              </button>
            )}
            {show[sub.partId] && (
              <div className="text-xs bg-white/80 rounded p-2 space-y-1">
                <p>
                  <strong>{L.answer}</strong> {sub.answer}
                </p>
                <p>{tx(sub.explanation, sub.explanationVi, lang)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────── ExamQuestionPanel ──────────────── */
function ExamQuestionPanel(props: {
  lang: Lang;
  item: ExamItem;
  simpleAns: Record<string, MaruBatsu | undefined>;
  scenarioAns: Record<string, Record<string, MaruBatsu | undefined>>;
  setSimple: (id: string, v: MaruBatsu) => void;
  setScenario: (gid: string, partId: string, v: MaruBatsu) => void;
}) {
  const { lang, item, simpleAns, scenarioAns, setSimple, setScenario } = props;

  const L = {
    singleLabel: lang === "vi" ? "○×（一問一答）" : "○×（一問一答）",
    scenarioLabel: lang === "vi" ? "危険予測（イラスト）· 3 ý / 1 điểm" : "危険予測（イラスト）· 3題 / 1点",
  };

  if (item.type === "simple") {
    const q = item.question;
    return (
      <div className="tile-card p-4 space-y-4">
        <p className="text-xs text-red-900/70 font-bold">{L.singleLabel}</p>
        {q.image && (
          <IllustrationImage
            file={q.image}
            className="w-full max-h-52 rounded-xl"
            imgClassName="w-full max-h-52 object-contain"
          />
        )}
        <p className="text-sm leading-relaxed text-neutral-900 font-medium">
          {tx(q.text, q.textVi, lang)}
        </p>
        <MaruBatsuButtons
          value={simpleAns[q.id]}
          onPick={(v) => setSimple(q.id, v)}
        />
      </div>
    );
  }

  const g = item.group;
  const gAns = scenarioAns[g.groupId] ?? {};
  return (
    <div className="tile-card p-4 space-y-4">
      <p className="text-xs text-red-900/80 font-black">{L.scenarioLabel}</p>
      <p className="text-sm font-semibold text-neutral-900">
        {tx(g.stem, g.stemVi, lang)}
      </p>
      {g.subs.map((sub) => {
        return (
          <div
            key={sub.partId}
            className="border-t-2 border-amber-800/30 pt-3 space-y-2"
          >
            <div className="flex gap-3 items-start">
              <IllustrationImage
                file={sub.image}
                className="w-28 h-24 shrink-0 rounded-lg"
                imgClassName="max-w-full max-h-full object-contain"
              />
              <p className="text-sm flex-1 text-neutral-900 leading-snug">
                【{sub.subKey}】{tx(sub.text, sub.textVi, lang)}
              </p>
            </div>
            <MaruBatsuButtons
              value={gAns[sub.partId]}
              onPick={(v) => setScenario(g.groupId, sub.partId, v)}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────── ResultsView ──────────────── */
function ResultsView(props: {
  lang: Lang;
  score: NonNullable<ReturnType<typeof scoreExam>>;
  passScore: number;
  onReview: () => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const { lang, score, passScore, onReview, onHome, onRetry } = props;
  const wrong = score.details.filter((d) => d.points < 1);

  const L = {
    title: lang === "vi" ? "Kết quả" : "結果",
    condition: lang === "vi"
      ? `Điều kiện đạt: từ ${passScore}/${score.max} điểm trở lên.`
      : `合格条件：${score.max}点中${passScore}点以上`,
    reviewBtn: lang === "vi"
      ? `Giải thích & xem lại ${wrong.length} phần sai`
      : `解説を見る · ${wrong.length}問の間違いを復習`,
    perfect: lang === "vi" ? "Không có câu sai — xuất sắc!" : "全問正解 — お見事！",
    retry: lang === "vi" ? "Làm đề mới" : "新しい問題に挑戦",
    home: lang === "vi" ? "Về trang chủ" : "ホームに戻る",
    passed: lang === "vi" ? "ĐẠT" : "合格",
    failed: lang === "vi" ? "CHƯA ĐẠT" : "不合格",
  };

  return (
    <div className="space-y-5" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="tile-card p-6 text-center space-y-2">
        <p className="text-sm text-neutral-700">{L.title}</p>
        <p className="text-4xl font-black text-neutral-900">
          {score.total}/{score.max}
        </p>
        <p
          className={`text-xl font-black ${
            score.passed ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {score.passed ? L.passed : L.failed}
        </p>
        <p className="text-xs text-neutral-600 px-2">{L.condition}</p>
      </div>
      {wrong.length > 0 && (
        <button
          type="button"
          onClick={onReview}
          className="w-full py-3 rounded-xl font-bold bg-amber-200 text-amber-950 border-2 border-amber-950 active:opacity-70 transition"
        >
          {L.reviewBtn}
        </button>
      )}
      {wrong.length === 0 && (
        <p className="text-center text-amber-100 text-sm">{L.perfect}</p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3 rounded-xl font-bold bg-orange-300 text-amber-950 border-2 border-amber-950 active:opacity-70 transition"
      >
        {L.retry}
      </button>
      <button
        type="button"
        onClick={onHome}
        className="w-full text-amber-200 underline text-sm active:opacity-70 transition"
      >
        {L.home}
      </button>
    </div>
  );
}

/* ──────────────── ReviewView ──────────────── */
function ReviewView(props: {
  lang: Lang;
  score: NonNullable<ReturnType<typeof scoreExam>>;
  onBackResults: () => void;
  onHome: () => void;
}) {
  const { lang, score, onBackResults, onHome } = props;
  const wrong = score.details.filter((d) => d.points < 1);

  const L = {
    back: lang === "vi" ? "← Kết quả" : "← 結果",
    title: lang === "vi" ? "Câu / nhóm sai" : "間違い一覧",
    questionNum: (n: number) => lang === "vi" ? `Câu ${n + 1} trong đề` : `問${n + 1}`,
    yourChoice: lang === "vi" ? "Bạn chọn:" : "あなたの選択：",
    correctAns: lang === "vi" ? "Đúng:" : "正解：",
    scenarioNote: lang === "vi"
      ? "Nhóm tình huống: chỉ được điểm khi cả 3 ý đều đúng."
      : "グループ問題：3問すべて正解で1点",
    home: lang === "vi" ? "Trang chủ" : "ホーム",
    answer: lang === "vi" ? "Đáp án:" : "答え：",
  };

  return (
    <div className="space-y-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <button
        type="button"
        onClick={onBackResults}
        className="text-amber-200 text-sm underline active:opacity-70 transition"
      >
        {L.back}
      </button>
      <h3 className="text-amber-50 font-bold">{L.title}</h3>
      <div className="space-y-4">
        {wrong.map((d) => (
          <div key={d.index} className="tile-card p-4 text-sm space-y-2">
            <p className="text-xs font-bold text-red-800">
              {L.questionNum(d.index)}
            </p>
            {d.item.type === "simple" && d.simple && (
              <>
                {d.item.question.image && (
                  <IllustrationImage
                    file={d.item.question.image}
                    className="w-full max-h-40 rounded-lg"
                    imgClassName="w-full max-h-40 object-contain"
                  />
                )}
                <p className="text-neutral-900">
                  {tx(d.item.question.text, d.item.question.textVi, lang)}
                </p>
                <p>
                  {L.yourChoice}{" "}
                  <strong>{d.simple.user ?? "—"}</strong> · {L.correctAns}{" "}
                  <strong>{d.item.question.answer}</strong>
                </p>
                <p className="text-neutral-700 border-l-4 border-amber-600 pl-2">
                  {tx(d.item.question.explanation, d.item.question.explanationVi, lang)}
                </p>
              </>
            )}
            {d.item.type === "scenario" && d.scenario && (
              <>
                <p className="font-semibold text-neutral-900">
                  {tx(d.item.group.stem, d.item.group.stemVi, lang)}
                </p>
                <p className="text-xs text-rose-800">{L.scenarioNote}</p>
                {d.item.group.subs.map((sub) => {
                  const st = d.scenario!.subs[sub.partId];
                  const ok = st?.correct;
                  return (
                    <div
                      key={sub.partId}
                      className={`rounded p-2 border ${
                        ok
                          ? "border-emerald-300 bg-emerald-50/50"
                          : "border-rose-400 bg-rose-50/80"
                      }`}
                    >
                      <div className="flex gap-2 items-start">
                        <IllustrationImage
                          file={sub.image}
                          className="w-20 h-16 shrink-0 rounded"
                          imgClassName="w-full h-full object-contain"
                        />
                        <p className="text-neutral-900 flex-1">
                          【{sub.subKey}】{tx(sub.text, sub.textVi, lang)}
                        </p>
                      </div>
                      <p className="text-xs mt-1">
                        {L.yourChoice.replace(":", "")}{" "}<strong>{st?.user ?? "—"}</strong> · {L.answer.replace(":", "")}{" "}
                        <strong>{sub.answer}</strong>
                      </p>
                      {!ok && (
                        <p className="text-xs text-neutral-700 mt-1">
                          {tx(sub.explanation, sub.explanationVi, lang)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onHome}
        className="w-full py-3 rounded-xl font-bold bg-amber-900/50 text-amber-50 border border-amber-700 active:opacity-70 transition"
      >
        {L.home}
      </button>
    </div>
  );
}

/* ──────────────── Main App ──────────────── */
export default function GentsukiApp() {
  const [lang, setLang] = useState<Lang>("vi");
  const [view, setView] = useState<View>({ mode: "home" });
  const [examPaper, setExamPaper] = useState<ExamItem[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [simpleAns, setSimpleAns] = useState<
    Record<string, MaruBatsu | undefined>
  >({});
  const [scenarioAns, setScenarioAns] = useState<
    Record<string, Record<string, MaruBatsu | undefined>>
  >({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const examPaperRef = useRef(examPaper);
  examPaperRef.current = examPaper;

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "jp" ? "vi" : "jp"));
  }, []);

  const startExam = useCallback(() => {
    const paper = buildMockExam(bank);
    setExamPaper(paper);
    setExamIndex(0);
    setSimpleAns({});
    setScenarioAns({});
    setSecondsLeft(EXAM_SECONDS);
    setSubmitted(false);
    setView({ mode: "exam" });
  }, []);

  const submitExam = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setView({ mode: "results", paper: examPaperRef.current });
  }, [submitted]);

  useEffect(() => {
    if (view.mode !== "exam" || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          const paper = examPaperRef.current;
          queueMicrotask(() => {
            setSubmitted(true);
            setView({ mode: "results", paper });
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [view.mode, submitted]);

  const score = useMemo(() => {
    if (view.mode !== "results" && view.mode !== "review") return null;
    return scoreExam(view.paper, simpleAns, scenarioAns);
  }, [view, simpleAns, scenarioAns]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const currentItem =
    view.mode === "exam" ? examPaper[examIndex] : undefined;

  const setSimple = (id: string, v: MaruBatsu) => {
    setSimpleAns((prev) => ({ ...prev, [id]: v }));
  };

  const setScenario = (gid: string, partId: string, v: MaruBatsu) => {
    setScenarioAns((prev) => ({
      ...prev,
      [gid]: { ...prev[gid], [partId]: v },
    }));
  };

  const isHome = view.mode === "home";

  /* bilingual labels */
  const L = {
    backHome: lang === "vi" ? "Về trang chủ" : "ホームに戻る",
    submit: lang === "vi" ? "Nộp bài" : "答案を提出",
    prev: lang === "vi" ? "← Trước" : "← 前へ",
    next: lang === "vi" ? "Sau →" : "次へ →",
    examHeaderJp: "原付免許 · 50cc",
    examHeaderVi: lang === "vi"
      ? "Thi thử bằng xe gắn máy dưới 50cc"
      : "原付模擬試験 · 50cc",
    examTitle: lang === "vi" ? "Thi thử bằng xe máy Nhật" : "原付模擬試験",
    questionOf: lang === "vi"
      ? (a: number, b: number) => `${a} / ${b}`
      : (a: number, b: number) => `${a} / ${b}`,
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-y-auto ${
        isHome ? "text-amber-950" : "brick-bg text-amber-950"
      }`}
      style={{ width: "390px", maxWidth: "430px" }}
    >
      {/* Fixed background */}
      {isHome ? (
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HOME_BG})` }}
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${PRACTICE_BG})` }}
          aria-hidden
        />
      )}
      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/20 select-none"
        aria-hidden
      />

      {/* Language toggle — non-home views */}
      {!isHome && (
        <div className="relative z-20 flex justify-end px-3 pt-3">
          <LangSwitch lang={lang} onToggle={toggleLang} />
        </div>
      )}

      <div
        className={`relative z-10 mx-auto w-full ${isHome ? "" : "px-3 pb-10"}`}
        style={{
          maxWidth: "430px",
          paddingTop: isHome ? "0" : "max(1rem, env(safe-area-inset-top))",
          paddingBottom: isHome ? "0" : "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {!isHome && (
          <header className="mb-6 text-center">
            <p className="mb-1 text-xs uppercase tracking-widest text-amber-200/90">
              {L.examHeaderJp}
            </p>
            <h1 className="text-2xl font-black text-amber-100 drop-shadow-md sm:text-3xl">
              {L.examTitle}
            </h1>
          </header>
        )}

        {view.mode === "home" && (
          <HomeScreen
            lang={lang}
            onLangToggle={toggleLang}
            onStartExam={startExam}
            onChapter={(chapter) => setView({ mode: "chapter", chapter })}
          />
        )}

        {view.mode === "chapter" && (
          <ChapterView
            lang={lang}
            chapter={view.chapter}
            onBack={() => setView({ mode: "home" })}
          />
        )}

        {view.mode === "exam" && currentItem && (
          <div className="space-y-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="flex items-center justify-between gap-2 flex-wrap bg-black/25 rounded-lg px-3 py-2 border border-amber-900/50">
              <button
                type="button"
                onClick={() => setView({ mode: "home" })}
                className="text-amber-100 text-sm underline active:opacity-70"
              >
                {L.backHome}
              </button>
              <span className="font-mono font-bold text-amber-50 text-lg">
                {mm}:{ss}
              </span>
              <span className="text-amber-100 text-sm">
                {L.questionOf(examIndex + 1, examPaper.length)}
              </span>
            </div>

            <ExamQuestionPanel
              lang={lang}
              item={currentItem}
              simpleAns={simpleAns}
              scenarioAns={scenarioAns}
              setSimple={setSimple}
              setScenario={setScenario}
            />

            <div className="flex gap-2">
              <button
                type="button"
                disabled={examIndex === 0}
                onClick={() => setExamIndex((i) => Math.max(0, i - 1))}
                className="flex-1 py-3 rounded-lg bg-amber-900/40 text-amber-50 border-2 border-amber-800 disabled:opacity-30 active:opacity-70 transition"
              >
                {L.prev}
              </button>
              <button
                type="button"
                disabled={examIndex >= examPaper.length - 1}
                onClick={() =>
                  setExamIndex((i) =>
                    Math.min(examPaper.length - 1, i + 1)
                  )
                }
                className="flex-1 py-3 rounded-lg bg-amber-900/40 text-amber-50 border-2 border-amber-800 disabled:opacity-30 active:opacity-70 transition"
              >
                {L.next}
              </button>
            </div>

            <button
              type="button"
              onClick={submitExam}
              className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border-4 border-amber-950 shadow-lg transition active:opacity-70"
            >
              {L.submit}
            </button>
          </div>
        )}

        {view.mode === "results" && score && (
          <ResultsView
            lang={lang}
            score={score}
            passScore={PASS_SCORE}
            onReview={() => setView({ mode: "review", paper: view.paper })}
            onHome={() => setView({ mode: "home" })}
            onRetry={startExam}
          />
        )}

        {view.mode === "review" && score && (
          <ReviewView
            lang={lang}
            score={score}
            onBackResults={() =>
              setView({ mode: "results", paper: view.paper })
            }
            onHome={() => setView({ mode: "home" })}
          />
        )}
      </div>
    </div>
  );
}
