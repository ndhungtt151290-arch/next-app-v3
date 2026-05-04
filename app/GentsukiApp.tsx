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

type View =
  | { mode: "home" }
  | { mode: "chapter"; chapter: string }
  | { mode: "exam" }
  | { mode: "results"; paper: ExamItem[] }
  | { mode: "review"; paper: ExamItem[] };

function imgSrc(name?: string) {
  if (!name) return null;
  return `/images/${name}`;
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

  return (
    <div className="brick-bg min-h-screen text-amber-950 pb-10">
      <div className="max-w-lg mx-auto px-3 pt-4">
        <header className="text-center mb-6">
          <p className="text-amber-200/90 text-xs tracking-widest uppercase mb-1">
            原付免許 · 50cc
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
            Thi thử bằng xe máy Nhật
          </h1>
        </header>

        {view.mode === "home" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={startExam}
              className="w-full tile-btn py-5 text-lg font-black text-amber-50 rounded-xl border-4 border-amber-950 shadow-xl"
            >
              Thi thử (48 câu · 30 phút)
            </button>
            <p className="text-center text-amber-100/85 text-sm px-2">
              Đạt yêu cầu: từ <strong>{PASS_SCORE}/48</strong> trở lên. Ba câu
              cuối là tình huống minh họa, mỗi câu gồm 3 ý — chỉ được 1 điểm
              khi cả 3 ý đều đúng.
            </p>
            <h2 className="text-amber-100 font-bold text-sm mt-6 mb-2 px-1">
              12 chương ôn lý thuyết
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CHAPTER_ORDER.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setView({ mode: "chapter", chapter: ch })}
                  className="tile-chapter text-left p-3 rounded-lg border-2 border-amber-900/80 bg-gradient-to-br from-orange-200/95 to-orange-300/90 shadow-md active:scale-[0.98] transition"
                >
                  <span className="block text-[11px] font-bold text-red-950 leading-tight">
                    {ch}
                  </span>
                  <span className="block text-[10px] text-red-900/80 mt-1">
                    {chapterVietnamese(ch)}
                  </span>
                </button>
              ))}
            </div>
          </div>
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
        const src = imgSrc(sub.image);
        return (
          <div
            key={sub.partId}
            className="border-t border-amber-900/20 pt-3 space-y-2"
          >
            <div className="flex gap-3 items-start">
              <div className="w-24 h-20 shrink-0 rounded bg-neutral-200 border-2 border-amber-900/40 overflow-hidden flex items-center justify-center text-[10px] text-neutral-500">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  "図"
                )}
              </div>
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
        const src = imgSrc(sub.image);
        return (
          <div
            key={sub.partId}
            className="border-t-2 border-amber-800/30 pt-3 space-y-2"
          >
            <div className="flex gap-3 items-start">
              <div className="w-28 h-24 shrink-0 rounded-lg bg-neutral-100 border-2 border-amber-950/50 overflow-hidden flex items-center justify-center text-neutral-400 text-xs">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  "図"
                )}
              </div>
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
                      <p className="text-neutral-900">
                        【{sub.subKey}】{sub.text}
                      </p>
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
