"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bankRaw from "./data/questions.json";
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

/**
 * Chỉ dùng ảnh trong `public/home/` (s1…s6) cho màn home.
 * Gợi ý: s1 = nền toàn màn hình, s2 = mascot trên, s3 = minh họa nút đỏ,
 * s4–s6 = trang trí ô lưới (lặp theo chương).
 */
const HOME = "/home";
const HOME_BG = "/bgs/bgh.jpg";
const HOME_HERO = `${HOME}/s2.png`;
const HOME_CTA_BADGE = `${HOME}/s3.png`;
const HOME_TILE_ART = [`${HOME}/s4.png`, `${HOME}/s5.png`, `${HOME}/s6.png`];

const RED = "#C02026";

function homeTileArt(index: number): string {
  return HOME_TILE_ART[index % HOME_TILE_ART.length]!;
}

type View =
  | { mode: "home" }
  | { mode: "chapter"; chapter: string }
  | { mode: "exam" }
  | { mode: "results"; paper: ExamItem[] }
  | { mode: "review"; paper: ExamItem[] };

/** Ảnh trong `public/images/` — URL chuẩn Next: `/images/...` */
function imgSrc(name?: string) {
  if (!name) return null;
  return `/images/${encodeURIComponent(name)}`;
}

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
    "min-w-[88px] py-3 rounded-lg font-bold text-2xl border-4 border-amber-950 shadow-md transition active:scale-95 disabled:opacity-40";
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

/** Màn home: chỉ asset `/home/s1…s6`, bố cục theo mock iPhone (card, CTA, lưới 2 cột). */
function HomeScreen(props: {
  onStartExam: () => void;
  onChapter: (chapter: string) => void;
}) {
  const { onStartExam, onChapter } = props;

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,26.5rem)] px-[14px]">
      <div
        className="relative rounded-[1.75rem] border-2 border-black/20 bg-white/20 px-4 pb-5 pt-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-[3px]"
        style={{ marginTop: "4px", position: "relative", height: "844px", zIndex: 20 }}
      >
        <div
          className="flex flex-col items-center gap-2 pb-1 pt-1"
          style={{ width: "350px", position: "relative", display: "flex", flexFlow: "column" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/home/s1.png"
            alt=""
            className="w-full max-w-[min(100%,320px)] object-contain"
            style={{ width: "180px", textAlign: "left", position: "absolute", left: "81px", top: "63px" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HOME_HERO}
            alt=""
            className="h-[4.25rem] w-auto max-w-[min(88%,200px)] object-contain drop-shadow-md"
            style={{ width: "478px", position: "absolute", left: "67px", top: "169px" }}
          />
        </div>

        <button
          type="button"
          onClick={onStartExam}
          className="mx-auto mt-5 block w-[92%] max-w-[22rem] transition active:scale-[0.98]"
          style={{ position: "absolute", left: "8px", top: "258px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/home/s3.png"
            alt="Bắt đầu thi thử"
            className="w-full h-auto object-contain"
            style={{ width: "fit-content", height: "fit-content", display: "flex", flexFlow: "wrap", textAlign: "center", position: "absolute", left: "19px", top: "-17px" }}
          />
        </button>

        <div
          className="grid grid-cols-2 gap-x-4 gap-y-4"
          style={{ columnGap: "16px", rowGap: "12px", gap: "12px 16px", width: "325px", position: "absolute", left: "17px", top: "368px" }}
        >
          {CHAPTER_ORDER.map((ch) => {
            return (
              <button
                key={ch}
                type="button"
                onClick={() => onChapter(ch)}
                className="flex flex-col items-center justify-center gap-0.5 rounded-[1.35rem] border border-white/50 px-2 py-2 text-center transition active:scale-[0.98]"
                style={{
                  background: "linear-gradient(180deg, #f7f7f7 0%, #e6e6e6 100%)",
                  boxShadow:
                    "inset 2px 2px 5px rgba(255,255,255,0.85), inset -2px -3px 6px rgba(0,0,0,0.08), 3px 5px 12px rgba(0,0,0,0.14)",
                  minHeight: "52px",
                }}
              >
                <span className="line-clamp-2 text-[0.6rem] font-bold leading-tight text-neutral-900">
                  {ch}
                </span>
                <span className="line-clamp-1 text-[0.52rem] font-semibold text-neutral-600">
                  {chapterVietnamese(ch)}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center font-serif text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-black/80" style={{ position: "absolute", left: "94px", top: "780px" }}>
          CREATED BY DUYHUNG
        </p>
      </div>
    </div>
  );
}

export default function GentsukiApp() {
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

  return (
    <div
      className={
        isHome
          ? "relative w-full min-h-[100dvh] min-h-[100svh] text-amber-950"
          : "brick-bg min-h-screen text-amber-950 pb-10"
      }
      style={{ width: "390px" }}
    >
      {isHome && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-neutral-900 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HOME_BG})`,
              /* iPhone: phủ kín khung nhìn, giữ tỉ lệ ảnh */
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/20"
            aria-hidden
          />
        </>
      )}
      <div
        className={`relative z-10 mx-auto max-w-lg ${
          isHome
            ? "px-0 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            : "px-3 pb-10 pt-4"
        }`}
      >
        {!isHome && (
          <header className="mb-6 text-center">
            <p className="mb-1 text-xs uppercase tracking-widest text-amber-200/90">
              原付免許 · 50cc
            </p>
            <h1 className="text-2xl font-black text-amber-100 drop-shadow-md sm:text-3xl">
              Thi thử bằng xe máy Nhật
            </h1>
          </header>
        )}

        {view.mode === "home" && (
          <HomeScreen
            onStartExam={startExam}
            onChapter={(chapter) => setView({ mode: "chapter", chapter })}
          />
        )}

        {view.mode === "chapter" && (
          <ChapterView
            chapter={view.chapter}
            onBack={() => setView({ mode: "home" })}
          />
        )}

        {view.mode === "exam" && currentItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap bg-black/25 rounded-lg px-3 py-2 border border-amber-900/50">
              <button
                type="button"
                onClick={() => setView({ mode: "home" })}
                className="text-amber-100 text-sm underline"
              >
                Về trang chủ
              </button>
              <span className="font-mono font-bold text-amber-50 text-lg">
                {mm}:{ss}
              </span>
              <span className="text-amber-100 text-sm">
                {examIndex + 1} / {examPaper.length}
              </span>
            </div>

            <ExamQuestionPanel
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
                className="flex-1 py-3 rounded-lg bg-amber-900/40 text-amber-50 border-2 border-amber-800 disabled:opacity-30"
              >
                ← Trước
              </button>
              <button
                type="button"
                disabled={examIndex >= examPaper.length - 1}
                onClick={() =>
                  setExamIndex((i) =>
                    Math.min(examPaper.length - 1, i + 1)
                  )
                }
                className="flex-1 py-3 rounded-lg bg-amber-900/40 text-amber-50 border-2 border-amber-800 disabled:opacity-30"
              >
                Sau →
              </button>
            </div>

            <button
              type="button"
              onClick={submitExam}
              className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border-4 border-amber-950 shadow-lg"
            >
              Nộp bài
            </button>
          </div>
        )}

        {view.mode === "results" && score && (
          <ResultsView
            score={score}
            passScore={PASS_SCORE}
            onReview={() => setView({ mode: "review", paper: view.paper })}
            onHome={() => setView({ mode: "home" })}
            onRetry={startExam}
          />
        )}

        {view.mode === "review" && score && (
          <ReviewView
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

function ChapterView(props: { chapter: string; onBack: () => void }) {
  const { chapter, onBack } = props;
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
          className="text-amber-200 underline"
        >
          ← Quay lại
        </button>
        <p>Chưa có dữ liệu cho chương này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="text-amber-200 text-sm underline"
      >
        ← Trang chủ
      </button>
      <h2 className="text-amber-50 font-bold text-sm leading-snug">
        {chapter}
        <span className="block text-amber-200/80 text-xs font-normal mt-1">
          {chapterVietnamese(chapter)}
        </span>
      </h2>
      <p className="text-amber-100/80 text-xs">
        {idx + 1} / {total}
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
            {cur.q.text}
          </p>
          <MaruBatsuButtons
            value={ans[cur.q.id]}
            onPick={(v) => setAns((a) => ({ ...a, [cur.q.id]: v }))}
          />
          {ans[cur.q.id] && (
            <button
              type="button"
              className="text-sm text-red-900 underline"
              onClick={() =>
                setShow((s) => ({ ...s, [cur.q.id]: !s[cur.q.id] }))
              }
            >
              {show[cur.q.id] ? "Ẩn đáp án" : "Xem đáp án & giải thích"}
            </button>
          )}
          {show[cur.q.id] && (
            <div className="text-sm bg-white/80 rounded p-3 border border-amber-900/30">
              <p>
                <strong>Đúng:</strong> {cur.q.answer}
              </p>
              <p className="mt-2 text-neutral-800">{cur.q.explanation}</p>
            </div>
          )}
        </div>
      )}

      {cur.kind === "g" && (
        <ScenarioPracticeBlock
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
          className="flex-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          disabled={idx >= total - 1}
          onClick={() => setIdx((x) => Math.min(total - 1, x + 1))}
          className="flex-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}

function ScenarioPracticeBlock(props: {
  group: ScenarioGroup;
  values: Record<string, MaruBatsu | undefined>;
  show: Record<string, boolean>;
  onPick: (partId: string, v: MaruBatsu) => void;
  onToggleExplain: (key: string) => void;
}) {
  const { group, values, show, onPick, onToggleExplain } = props;
  return (
    <div className="tile-card space-y-4 p-4">
      <p className="text-sm font-semibold text-neutral-900">{group.stem}</p>
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
                【{sub.subKey}】{sub.text}
              </p>
            </div>
            <MaruBatsuButtons
              value={values[sub.partId]}
              onPick={(v) => onPick(sub.partId, v)}
            />
            {values[sub.partId] && (
              <button
                type="button"
                className="text-xs text-red-900 underline"
                onClick={() => onToggleExplain(sub.partId)}
              >
                {show[sub.partId] ? "Ẩn" : "Đáp án"}
              </button>
            )}
            {show[sub.partId] && (
              <div className="text-xs bg-white/80 rounded p-2 space-y-1">
                <p>
                  <strong>Đáp án:</strong> {sub.answer}
                </p>
                <p>{sub.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExamQuestionPanel(props: {
  item: ExamItem;
  simpleAns: Record<string, MaruBatsu | undefined>;
  scenarioAns: Record<string, Record<string, MaruBatsu | undefined>>;
  setSimple: (id: string, v: MaruBatsu) => void;
  setScenario: (gid: string, partId: string, v: MaruBatsu) => void;
}) {
  const { item, simpleAns, scenarioAns, setSimple, setScenario } = props;
  if (item.type === "simple") {
    const q = item.question;
    return (
      <div className="tile-card p-4 space-y-4">
        <p className="text-xs text-red-900/70 font-bold">○×（一問一答）</p>
        {q.image && (
          <IllustrationImage
            file={q.image}
            className="w-full max-h-52 rounded-xl"
            imgClassName="w-full max-h-52 object-contain"
          />
        )}
        <p className="text-sm leading-relaxed text-neutral-900 font-medium">
          {q.text}
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
      <p className="text-xs text-red-900/80 font-black">
        危険予測（イラスト）· 3 ý / 1 điểm
      </p>
      <p className="text-sm font-semibold text-neutral-900">{g.stem}</p>
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
                【{sub.subKey}】{sub.text}
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

function ResultsView(props: {
  score: NonNullable<ReturnType<typeof scoreExam>>;
  passScore: number;
  onReview: () => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const { score, passScore, onReview, onHome, onRetry } = props;
  const wrong = score.details.filter((d) => d.points < 1);
  return (
    <div className="space-y-5">
      <div className="tile-card p-6 text-center space-y-2">
        <p className="text-sm text-neutral-700">Kết quả</p>
        <p className="text-4xl font-black text-neutral-900">
          {score.total}/{score.max}
        </p>
        <p
          className={`text-xl font-black ${
            score.passed ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {score.passed ? "ĐẠT" : "CHƯA ĐẠT"}
        </p>
        <p className="text-xs text-neutral-600 px-2">
          Điều kiện đạt: từ {passScore}/{score.max} điểm trở lên.
        </p>
      </div>
      {wrong.length > 0 && (
        <button
          type="button"
          onClick={onReview}
          className="w-full py-3 rounded-xl font-bold bg-amber-200 text-amber-950 border-2 border-amber-950"
        >
          Giải thích &amp; xem lại {wrong.length} phần sai
        </button>
      )}
      {wrong.length === 0 && (
        <p className="text-center text-amber-100 text-sm">
          Không có câu sai — xuất sắc!
        </p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3 rounded-xl font-bold bg-orange-300 text-amber-950 border-2 border-amber-950"
      >
        Làm đề mới
      </button>
      <button
        type="button"
        onClick={onHome}
        className="w-full text-amber-200 underline text-sm"
      >
        Về trang chủ
      </button>
    </div>
  );
}

function ReviewView(props: {
  score: NonNullable<ReturnType<typeof scoreExam>>;
  onBackResults: () => void;
  onHome: () => void;
}) {
  const { score, onBackResults, onHome } = props;
  const wrong = score.details.filter((d) => d.points < 1);
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBackResults}
        className="text-amber-200 text-sm underline"
      >
        ← Kết quả
      </button>
      <h3 className="text-amber-50 font-bold">Câu / nhóm sai</h3>
      <div className="space-y-4">
        {wrong.map((d) => (
          <div key={d.index} className="tile-card p-4 text-sm space-y-2">
            <p className="text-xs font-bold text-red-800">
              Câu {d.index + 1} trong đề
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
                <p className="text-neutral-900">{d.item.question.text}</p>
                <p>
                  Bạn chọn:{" "}
                  <strong>{d.simple.user ?? "—"}</strong> · Đúng:{" "}
                  <strong>{d.item.question.answer}</strong>
                </p>
                <p className="text-neutral-700 border-l-4 border-amber-600 pl-2">
                  {d.item.question.explanation}
                </p>
              </>
            )}
            {d.item.type === "scenario" && d.scenario && (
              <>
                <p className="font-semibold text-neutral-900">
                  {d.item.group.stem}
                </p>
                <p className="text-xs text-rose-800">
                  Nhóm tình huống: chỉ được điểm khi cả 3 ý đều đúng.
                </p>
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
                          【{sub.subKey}】{sub.text}
                        </p>
                      </div>
                      <p className="text-xs mt-1">
                        Bạn: <strong>{st?.user ?? "—"}</strong> · Đáp án:{" "}
                        <strong>{sub.answer}</strong>
                      </p>
                      {!ok && (
                        <p className="text-xs text-neutral-700 mt-1">
                          {sub.explanation}
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
        className="w-full py-3 rounded-xl font-bold bg-amber-900/50 text-amber-50 border border-amber-700"
      >
        Trang chủ
      </button>
    </div>
  );
}


