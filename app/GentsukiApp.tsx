"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Flag,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Home,
  ListOrdered,
  BookOpen,
  Brain,
  CircleAlert,
  Lightbulb,
  RotateCcw,
  ArrowLeft,
  BookMarked,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bankRaw from "./data/questions.merged.json";
import {
  CHAPTER_VI,
  CHAPTER_JP,
  CHAPTER_MAP,
  chapterSubs,
} from "./lib/chapters";
import {
  buildMockExam,
  questionsForChapter,
  scoreExam,
} from "./lib/exam";
import type { ExamItem, MaruBatsu, QuestionBank, ScenarioGroup } from "./lib/types";

const bank = bankRaw as unknown as QuestionBank;

/* Dữ liệu chương từ file questions */
const CHAPTER_ORDER_FROM_DATA = bank.chapterOrder;
const PASS_SCORE = 45;
const EXAM_SECONDS = 30 * 60;
const TIMER_WARNING_SECONDS = 5 * 60; // 5 phút

export type Lang = "jp" | "vi";

/* ─────────────────────────── Flag-button ──────────────────────────── */
const FLAG_LABELS: Record<Lang, Record<Lang, string>> = {
  jp: { jp: "日本語", vi: "Tiếng Việt" },
  vi: { jp: "Người Nhật", vi: "Tiếng Việt" },
};

/* ─────────────────────────── Types ──────────────────────────── */
type View =
  | { mode: "home" }
  | { mode: "examPrep" }
  | { mode: "chapter"; chapterId: string; subChapter?: string }
  | { mode: "exam" }
  | { mode: "results"; paper: ExamItem[] }
  | { mode: "review"; paper: ExamItem[]; reviewAll?: boolean }
  | { mode: "history" };

interface ExamHistoryEntry {
  date: string;
  score: number;
  max: number;
  passed: boolean;
  details: {
    chapterBreakdown: Record<string, { correct: number; total: number }>;
  };
}

interface PersonalStats {
  totalExams: number;
  highestScore: number;
  lowestScore: number;
  chaptersStats: Record<string, { correct: number; total: number }>;
}

/* ─────────────────────────── localStorage helpers ──────────────────────────── */
const HISTORY_KEY = "gentsuki_exam_history";
const STATS_KEY = "gentsuki_personal_stats";

function loadHistory(): ExamHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(entry: ExamHistoryEntry) {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > 20) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadStats(): PersonalStats {
  if (typeof window === "undefined") return { totalExams: 0, highestScore: 0, lowestScore: 0, chaptersStats: {} };
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "null") ?? { totalExams: 0, highestScore: 0, lowestScore: 0, chaptersStats: {} };
  } catch {
    return { totalExams: 0, highestScore: 0, lowestScore: 0, chaptersStats: {} };
  }
}

function saveStats(stats: PersonalStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function updateStatsWithResult(score: NonNullable<ReturnType<typeof scoreExam>>) {
  const stats = loadStats();
  stats.totalExams += 1;
  if (stats.highestScore === 0 || score.total > stats.highestScore) stats.highestScore = score.total;
  if (stats.lowestScore === 0 || score.total < stats.lowestScore) stats.lowestScore = score.total;
  
  // Update chapter breakdown
  for (const d of score.details) {
    const chapterId = d.item.type === "simple" ? d.item.question.chapter : d.item.group.chapter;
    const chapterName = CHAPTER_VI[chapterId] ?? chapterId;
    if (!stats.chaptersStats[chapterName]) {
      stats.chaptersStats[chapterName] = { correct: 0, total: 0 };
    }
    stats.chaptersStats[chapterName].total += 1;
    if (d.points >= 1) stats.chaptersStats[chapterName].correct += 1;
  }
  
  saveStats(stats);
}

/* ─────────────────────────── Confirm Dialog ──────────────────────────── */
function ConfirmDialog(props: {
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "normal";
}) {
  const { message, confirmText, cancelText, onConfirm, onCancel, variant = "normal" } = props;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border-4 border-amber-950 animate-[fadeIn_0.2s_ease-out]">
        <p className="text-sm text-neutral-800 text-center mb-5 font-medium leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl font-bold border-2 border-neutral-300 text-neutral-700 bg-white active:opacity-70 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl font-bold border-2 active:opacity-70 transition ${
              variant === "danger"
                ? "border-rose-600 bg-rose-500 text-white"
                : "border-amber-600 bg-amber-500 text-amber-950"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Custom Flag Icons ──────────────────────── */
function JapanFlag({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="jpBg" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </radialGradient>
        <radialGradient id="jpRed" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ff5555" />
          <stop offset="100%" stopColor="#bb0000" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#jpBg)" />
      <circle cx="12" cy="12.5" r="9.8" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="5" fill="url(#jpRed)" />
      <circle cx="11" cy="11" r="2" fill="none" stroke="rgba(255,200,200,0.5)" strokeWidth="0.4" />
    </svg>
  );
}

function VietnamFlag({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="vnBg" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="100%" stopColor="#bb0000" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#vnBg)" />
      <circle cx="12" cy="12.5" r="9.8" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
      <polygon
        points="12,7 13.1,10.5 17,10.5 14,12.8 15.2,16.5 12,14 8.8,16.5 10,12.8 7,10.5 10.9,10.5"
        fill="#ffdd00"
      />
    </svg>
  );
}

/* ─────────────────────────── LangSwitch ──────────────────────────── */
function LangSwitch(props: {
  lang: Lang;
  onToggle: () => void;
  className?: string;
}) {
  const { lang, onToggle, className = "" } = props;
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      title={FLAG_LABELS[lang][lang === "jp" ? "vi" : "jp"]}
      className={`flex items-center justify-center rounded-full p-2.5 shadow-sm min-h-[44px] min-w-[44px] ${className}`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08 }}
    >
      {lang === "vi" ? <JapanFlag size={28} /> : <VietnamFlag size={28} />}
    </motion.button>
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

/* ─────────────────────────── IllustrationImage ──────────────────────────── */
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
      <span>HV</span>
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

/* ─────────────────────────── MaruBatsuButtons ──────────────────────────── */
function MaruBatsuButtons(props: {
  disabled?: boolean;
  value?: MaruBatsu;
  onPick: (v: MaruBatsu) => void;
}) {
  const { disabled, value, onPick } = props;
  const base =
    "flex-1 py-2 rounded-lg font-bold text-xl border-2 border-amber-950 shadow-md transition active:scale-95 active:opacity-70 disabled:opacity-40";
  return (
    <div className="flex gap-3 flex-wrap">
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

/* ─────────────────────────── NavigationButtons ──────────────────────────── */
function NavigationButtons(props: {
  disabledPrev: boolean;
  disabledNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  const { disabledPrev, disabledNext, onPrev, onNext, prevLabel, nextLabel } = props;
  return (
    <div className="flex gap-2">
      <motion.button
        type="button"
        disabled={disabledPrev}
        onClick={onPrev}
        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 text-sm disabled:opacity-30 active:opacity-70 transition"
        whileTap={{ scale: disabledPrev ? 1 : 0.95 }}
      >
        <ChevronLeft size={16} />
        {prevLabel}
      </motion.button>
      <motion.button
        type="button"
        disabled={disabledNext}
        onClick={onNext}
        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-amber-900/40 text-amber-50 border border-amber-800 text-sm disabled:opacity-30 active:opacity-70 transition"
        whileTap={{ scale: disabledNext ? 1 : 0.95 }}
      >
        {nextLabel}
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}

/* ─────────────────────────── bilingual text helper ──────────────────────────── */
function tx<T extends string | null | undefined>(
  jp: T,
  vi: T,
  lang: Lang
): string {
  if (lang === "vi" && vi) return vi;
  if (jp) return jp;
  return "";
}

/* ─────────────────────────── ProgressIndicator ──────────────────────────── */
function ProgressIndicator(props: {
  total: number;
  current: number;
  simpleAns: Record<string, MaruBatsu | undefined>;
  scenarioAns: Record<string, Record<string, MaruBatsu | undefined>>;
  paper: ExamItem[];
  flags: Set<string>;
  onJump: (index: number) => void;
  lang: Lang;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const { total, current, simpleAns, scenarioAns, paper, flags, onJump, lang, expanded, onToggleExpand } = props;
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onToggleExpand();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded, onToggleExpand]);
  
  const getQuestionId = (item: ExamItem, index: number): string => {
    if (item.type === "simple") return `s-${item.question.id}`;
    return `g-${item.group.groupId}`;
  };
  
  const isAnswered = (item: ExamItem): boolean => {
    if (item.type === "simple") {
      return simpleAns[item.question.id] !== undefined;
    }
    const gAns = scenarioAns[item.group.groupId];
    if (!gAns) return false;
    return item.group.subs.every((s) => gAns[s.partId] !== undefined);
  };
  
  const answeredCount = paper.filter(isAnswered).length;
  const flaggedCount = flags.size;
  
  const L = {
    title: lang === "vi" ? "Tiến trình" : "進捗",
    answered: lang === "vi" ? "Đã trả lời" : "回答済み",
    flagged: lang === "vi" ? "Đánh dấu" : "ブックマーク",
    jump: lang === "vi" ? "Nhảy đến câu" : "の問題に移動",
  };
  
  return (
    <div className="tile-card p-3">
      {/* Header row - clickable to expand */}
      <div className="relative">
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-full flex items-center justify-between text-xs hover:opacity-80 transition"
        >
          <span className="font-bold text-amber-900">{L.title}: {current + 1}/{total}</span>
          <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▼</span>
        </button>

        {/* Floating dropdown panel */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              ref={panelRef}
              initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-full mt-1 z-50 w-full origin-top"
            >
              <div className="bg-white border border-neutral-200 rounded-lg shadow-xl p-3 space-y-2">
                {/* Progress bar */}
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
                    style={{ width: `${(answeredCount / total) * 100}%` }}
                  />
                </div>

                {/* Question grid */}
                <div className="grid grid-cols-10 gap-1">
                  {paper.map((item, i) => {
                    const id = getQuestionId(item, i);
                    const answered = isAnswered(item);
                    const isFlagged = flags.has(id);
                    const isCurrent = i === current;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          onJump(i);
                          onToggleExpand();
                        }}
                        title={`${L.jump} ${i + 1}`}
                        className={`
                          relative aspect-square rounded-md text-[0.55rem] font-bold transition-all duration-200
                          ${isCurrent ? "ring-2 ring-amber-400 ring-offset-1 scale-110 z-10" : ""}
                          ${answered ? "bg-emerald-500 text-white" : "bg-neutral-300 text-neutral-600"}
                          ${isFlagged ? "ring-2 ring-amber-600" : ""}
                          hover:scale-105 active:scale-95
                        `}
                      >
                        {i + 1}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1"><Flag size={6} className="text-black fill-black" /></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────── ChapterGrid ──────────────────────────── */
function ChapterGrid(props: {
  lang: Lang;
  onChapter: (chapterId: string, subChapter?: string) => void;
}) {
  const { lang, onChapter } = props;

  // Đếm số câu hỏi mỗi chương
  const chapterCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of bank.simple) {
      map[q.chapter] = (map[q.chapter] ?? 0) + 1;
    }
    for (const g of bank.scenarioGroups) {
      map[g.chapter] = (map[g.chapter] ?? 0) + 1;
    }
    for (const g of bank.dangerScenarioGroups) {
      map[g.chapter] = (map[g.chapter] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="space-y-2">
      {CHAPTER_ORDER_FROM_DATA.map((chapterName) => {
        const chapterId = CHAPTER_MAP[chapterName] ?? chapterName;
        const count = chapterCountMap[chapterName] ?? 0;
        const label = lang === "vi"
          ? CHAPTER_VI[chapterId] ?? chapterName
          : chapterName;
        const isIllust = chapterName.includes("イラスト問題");

        return (
          <button
            key={chapterId}
            type="button"
            onClick={() => onChapter(chapterId)}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition active:scale-[0.98] active:opacity-70"
            style={{
              background: isIllust
                ? "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)"
                : "linear-gradient(180deg, #f7f7f7 0%, #e6e6e6 100%)",
              boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.85), inset -2px -3px 6px rgba(0,0,0,0.08), 3px 5px 12px rgba(0,0,0,0.14)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <span className="text-[0.7rem] font-bold text-neutral-900">{label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${
                isIllust
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {count}{lang === "vi" ? " câu" : "問"}
              </span>
              <ChevronRight size={14} className="text-neutral-400" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── HomeScreen ──────────────────────────── */
function HomeScreen(props: {
  lang: Lang;
  onStartExam: () => void;
  onChapter: (chapterId: string, subChapter?: string) => void;
  onShowHistory: () => void;
  personalStats: PersonalStats | null;
}) {
  const { lang, onStartExam, onChapter, onShowHistory, personalStats } = props;
  
  const L = {
    history: lang === "vi" ? "Lịch sử thi" : "試験履歴",
    stats: lang === "vi" ? "Thống kê cá nhân" : "個人統計",
    totalExams: lang === "vi" ? "Tổng số lần thi" : "総試験回数",
    highest: lang === "vi" ? "Điểm cao nhất" : "最高点",
    lowest: lang === "vi" ? "Điểm thấp nhất" : "最低点",
    noStats: lang === "vi" ? "Chưa có dữ liệu" : "データなし",
  };

  return (
    <div className="relative mx-auto w-full max-w-[430px] z-10">
      <div
        className="relative rounded-[1.75rem] border-2 border-black/20 bg-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-[3px] flex flex-col overflow-hidden"
        style={{
          height: "100dvh",
          paddingTop: "max(2.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(0.875rem, env(safe-area-inset-left))",
          paddingRight: "max(0.875rem, env(safe-area-inset-right))",
          zIndex: 50,
        }}
      >
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
            className="w-full max-w-[22rem] transition active:scale-[0.96] active:opacity-80 mt-1 relative z-[100] pointer-events-auto overflow-hidden rounded-xl"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Ảnh nền */}
            <img
              src="/home/s3.png"
              alt=""
              className="w-full h-auto object-contain pointer-events-none"
            />
            {/* Text overlay - giữ nguyên vị trí dù button to/nhỏ */}
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-base drop-shadow-lg leading-tight">
                {lang === "vi" ? "Bắt đầu thi thử" : "模擬試験を始める"}
              </span>
            </span>
          </button>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto mt-3 relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", zIndex: 10 }}
        >
          <style>{`.flex-1\\.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
          <ChapterGrid lang={lang} onChapter={onChapter} />
        </div>

        {/* Bottom row */}
        <div className="shrink-0 flex items-center justify-between pt-1 relative z-[100]">
          <button
            type="button"
            onClick={onShowHistory}
            className="flex items-center gap-1 text-[0.6rem] text-amber-800 underline active:opacity-70 transition"
          >
            <BarChart2 size={12} />
            {L.history}
          </button>
          <p className="font-serif text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-black/80 select-none">
            CREATED BY DUYHUNG
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ExamPrepScreen ──────────────────────────── */
function ExamPrepScreen(props: {
  lang: Lang;
  onStart: () => void;
  onBack: () => void;
}) {
  const { lang, onStart, onBack } = props;

  const L = {
    title: lang === "vi" ? "Cấu trúc đề thi" : "試験構成",
    start: lang === "vi" ? "Bắt đầu thi →" : "試験を始める →",
    back: lang === "vi" ? "← Trang chủ" : "← ホーム",
    part1Title: lang === "vi" ? "Phần 1 · Câu hỏi ○×" : "第1部 · ○×問題",
    part1Count: "46",
    part1Pts: lang === "vi" ? "46 điểm" : "46点",
    part1Content: lang === "vi"
      ? "Lý thuyết · Biển báo · Quy tắc ưu tiên · Luật giao thông"
      : "交通ルール · 標識 · 優先規則",
    part1Rule: lang === "vi"
      ? "Đúng mỗi câu → nhận 1 điểm. Sai → 0 điểm."
      : "正解で1点。間違うと0点。",
    part2Title: lang === "vi" ? "Phần 2 · Hình ảnh (Kiken Yosoku)" : "第2部 · イラスト問題（危険予測）",
    part2Count: "2",
    part2Pts: lang === "vi" ? "4 điểm" : "4点",
    part2Content: lang === "vi"
      ? "Mỗi câu hình ảnh có 3 ý nhỏ bắt buộc đúng TẤT CẢ."
      : "各イラスト問題は3つの小問で構成。全問正解で2点。",
    part2Rule: lang === "vi"
      ? "Đúng đủ 3 ý → nhận 2 điểm. Sai ≥1 ý → 0 điểm."
      : "3題すべて正解で2点。1問でも間違うと0点。",
    total: lang === "vi" ? "Tổng điểm" : "合計点",
    totalVal: "50",
    pass: lang === "vi" ? "Điểm đỗ" : "合格点",
    passVal: lang === "vi" ? "45 / 50" : "45 / 50",
    passNote: lang === "vi"
      ? "Cần đạt 90% (đúng 90 câu trên 100)"
      : "90%以上で合格",
    time: lang === "vi" ? "Thời gian" : "試験時間",
    timeVal: lang === "vi" ? "30 phút" : "30分",
    tip1: lang === "vi"
      ? "Dành 5 phút cuối để xem kỹ 2 câu hình ảnh — chúng quyết định kết quả!"
      : "最後の5分はイラスト問題の見直しに充てるべし！",
    tip2: lang === "vi"
      ? "2 câu hình ảnh chiếm 4 điểm, rất dễ bị đánh lừa ở chi tiết nhỏ."
      : "イラスト問題は4点分。小さなディテールで見間違えやすい。",
    tip3: lang === "vi"
      ? "Bình tĩnh, đọc kỹ từng ý nhỏ trong câu hình ảnh."
      : "落ち着いてください。イラスト問題の各小問を慎重に読みましょう。",
  };

  return (
    <div className="space-y-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-amber-200 text-sm active:opacity-70 transition"
      >
        <ArrowLeft size={14} />
        {L.back}
      </button>

      <button
        type="button"
        onClick={onStart}
        className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border-4 border-amber-950 shadow-lg transition active:scale-[0.97] active:opacity-80"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {L.start}
      </button>

      <div className="flex gap-2">
        <div className="flex-1 bg-black/30 rounded-lg p-2 text-center border border-amber-900/40">
          <p className="text-amber-200/70 text-[0.6rem] uppercase tracking-widest">{L.total}</p>
          <p className="text-amber-50 font-black text-lg">{L.totalVal}</p>
        </div>
        <div className="flex-1 bg-black/30 rounded-lg p-2 text-center border border-amber-900/40">
          <p className="text-amber-200/70 text-[0.6rem] uppercase tracking-widest">{L.pass}</p>
          <p className="text-amber-50 font-black text-lg">{L.passVal}</p>
        </div>
        <div className="flex-1 bg-black/30 rounded-lg p-2 text-center border border-amber-900/40">
          <p className="text-amber-200/70 text-[0.6rem] uppercase tracking-widest">{L.time}</p>
          <p className="text-amber-50 font-black text-lg">{L.timeVal}</p>
        </div>
      </div>

      <div className="tile-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-amber-950">{L.part1Title}</p>
          <div className="flex gap-2 items-center">
            <span className="text-[0.65rem] font-bold text-amber-800 bg-amber-100 rounded-full px-2 py-0.5">
              {L.part1Count} {lang === "vi" ? "câu" : "問"}
            </span>
            <span className="text-[0.65rem] font-black text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
              {L.part1Pts}
            </span>
          </div>
        </div>
        <p className="text-[0.7rem] text-neutral-800 leading-relaxed">
          {L.part1Content}
        </p>
        <div className="flex items-center gap-1.5 bg-amber-50 rounded p-2 border border-amber-200">
          <BookOpen size={12} className="text-amber-800 shrink-0" />
          <span className="text-[0.65rem] text-amber-900 font-medium">
            {L.part1Rule}
          </span>
        </div>
      </div>

      <div className="tile-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-amber-950">{L.part2Title}</p>
          <div className="flex gap-2 items-center">
            <span className="text-[0.65rem] font-bold text-amber-800 bg-amber-100 rounded-full px-2 py-0.5">
              {L.part2Count} {lang === "vi" ? "câu" : "問"}
            </span>
            <span className="text-[0.65rem] font-black text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
              {L.part2Pts}
            </span>
          </div>
        </div>
        <p className="text-[0.7rem] text-neutral-800 leading-relaxed">
          {L.part2Content}
        </p>
        <div className="flex items-center gap-1.5 bg-rose-50 rounded p-2 border border-rose-200">
          <BookOpen size={12} className="text-rose-700 shrink-0" />
          <span className="text-[0.65rem] text-rose-900 font-medium">
            {L.part2Rule}
          </span>
        </div>
      </div>

      <div className="tile-card p-4 space-y-2 bg-amber-50/80">
        <p className="text-[0.7rem] font-black text-amber-950 flex items-center gap-1">
          <Lightbulb size={12} />
          {lang === "vi" ? "Mẹo làm bài:" : "試験のコツ："}
        </p>
        {[
          { icon: <Clock size={11} />, text: L.tip1 },
          { icon: <CircleAlert size={11} />, text: L.tip2 },
          { icon: <Brain size={11} />, text: L.tip3 },
        ].map(({ icon, text }, i) => (
          <p key={i} className="text-[0.68rem] text-neutral-800 leading-relaxed flex items-start gap-1.5">
            <span className="shrink-0 mt-0.5">{icon}</span>
            <span>{text}</span>
          </p>
        ))}
      </div>

    </div>
  );
}

/* ─────────────────────────── AdBanner ──────────────────────────── */
function AdBanner(props: { className?: string }) {
  return (
    <div className={`mt-4 py-2 text-center border-t-2 border-dashed border-amber-800/30 ${props.className ?? ""}`}>
      <p className="text-[0.6rem] text-amber-300/60 uppercase tracking-widest mb-1">Quảng cáo</p>
      <div className="bg-black/20 rounded-lg p-2 text-amber-100 text-xs">
        Ad Banner Placeholder
      </div>
    </div>
  );
}

/* ─────────────────────────── ChapterView with Breadcrumb ──────────────────────────── */
function ChapterView(props: {
  lang: Lang;
  chapterId: string;
  subChapter?: string;
  onBack: () => void;
}) {
  const { lang, chapterId, subChapter, onBack } = props;

  const targetSubs = subChapter ? [subChapter] : chapterSubs(chapterId);

  const { simple, scenarios } = useMemo(
    () => questionsForChapter(bank, targetSubs),
    [targetSubs]
  );

  const flat: Array<
    | { kind: "s"; q: (typeof simple)[0]; i: number }
    | { kind: "g"; g: ScenarioGroup; i: number }
  > = [];
  let i = 0;
  for (const q of simple) flat.push({ kind: "s", q, i: i++ });
  for (const g of scenarios) flat.push({ kind: "g", g, i: i++ });

  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<Record<string, MaruBatsu | undefined>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [doubtful, setDoubtful] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState(false);

  const chapterTitle = CHAPTER_JP[chapterId] ?? chapterId;
  const chapterLabel = CHAPTER_VI[chapterId] ?? chapterId;
  const cur = flat[idx];
  const total = flat.length;

  const currentId = cur?.kind === "s"
    ? cur.q.id
    : cur?.kind === "g"
    ? cur.g.groupId
    : "";

  const toggleDoubt = () => {
    setDoubtful((prev) => {
      const next = new Set(prev);
      if (next.has(currentId)) {
        next.delete(currentId);
      } else {
        next.add(currentId);
      }
      return next;
    });
  };

  const navigateTo = (newIdx: number) => {
    setAnimating(true);
    setTimeout(() => {
      setIdx(newIdx);
      setAnimating(false);
    }, 150);
  };

  if (total === 0) {
    return (
      <div className="text-amber-50 space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-amber-200 text-sm active:opacity-70 transition"
        >
          <ArrowLeft size={14} />
          {lang === "vi" ? "Quay lại" : "戻る"}
        </button>
        <p>{lang === "vi" ? "Chưa có dữ liệu cho chương này." : "この章のデータはまだありません。"}</p>
      </div>
    );
  }

  const LABELS = {
    prev: lang === "vi" ? "Trước" : "前へ",
    next: lang === "vi" ? "Sau" : "次へ",
    hideAns: lang === "vi" ? "Ẩn đáp án" : "答えを隠す",
    showAns: lang === "vi" ? "Xem đáp án & giải thích" : "答えと解説を見る",
    correct: lang === "vi" ? "Đúng:" : "正解：",
    answer: lang === "vi" ? "Đáp án:" : "答え：",
    hide: lang === "vi" ? "Ẩn" : "隠す",
    show: lang === "vi" ? "Đáp án" : "答え",
    doubt: lang === "vi" ? "Nghi ngờ" : "疑問あり",
    doubtActive: lang === "vi" ? "Bỏ nghi ngờ" : "疑問取消",
    flagLabel: lang === "vi" ? "Đánh dấu" : "ブックマーク",
    unflagLabel: lang === "vi" ? "Bỏ đánh dấu" : "ブックマーク解除",
  };

  return (
    <div className="space-y-3" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-amber-200 text-sm active:opacity-70 transition"
      >
        <ArrowLeft size={14} />
        {lang === "vi" ? "Trang chủ" : "ホーム"}
      </button>

      {/* Simple progress */}
      <div className="flex items-center gap-2 text-xs">
        <span className="bg-amber-800/50 text-amber-200 px-2 py-1 rounded-full">
          {lang === "vi" ? `Câu ${idx + 1}/${total}` : `${idx + 1}/${total}問`}
        </span>
        <span className="text-amber-400">·</span>
        <span className="text-amber-200">
          {lang === "vi" ? chapterLabel : chapterTitle}
        </span>
        {subChapter && (
          <>
            <span className="text-amber-400">·</span>
            <span className="text-amber-200">
              {lang === "vi" ? CHAPTER_VI[subChapter] ?? subChapter : subChapter}
            </span>
          </>
        )}
      </div>

      {/* Fixed height container - only question content */}
      <div className="flex flex-col h-[340px] shrink-0">
        <div className={`tile-card flex flex-col flex-1 min-h-0 p-3 transition-opacity duration-150 ${animating ? "opacity-0" : "opacity-100"}`}>
          {cur.kind === "s" && (
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {/* Header - Flag only */}
              <div className="flex justify-end mb-2 shrink-0">
                <motion.button
                  type="button"
                  onClick={toggleDoubt}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition ${
                    doubtful.has(currentId)
                      ? "bg-amber-500 border-amber-600 text-amber-950"
                      : "bg-amber-900/30 border-amber-800 text-amber-200"
                  }`}
                  whileTap={{ scale: 0.92 }}
                >
                  <Flag size={12} className={doubtful.has(currentId) ? "fill-amber-950" : ""} />
                  {doubtful.has(currentId) ? LABELS.unflagLabel : LABELS.flagLabel}
                </motion.button>
              </div>

              {cur.q.image && (
                <IllustrationImage
                  file={cur.q.image}
                  className="w-full max-h-28 rounded-lg shrink-0"
                  imgClassName="w-full h-full max-h-28 object-contain"
                />
              )}
              <p className="text-sm leading-relaxed font-medium text-neutral-900 text-center mt-2">
                {tx(cur.q.text, cur.q.textVi, lang)}
              </p>
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
              onToggleDoubt={toggleDoubt}
              isDoubtful={doubtful.has(currentId)}
              flagLabel={LABELS.flagLabel}
              unflagLabel={LABELS.unflagLabel}
            />
          )}
        </div>
      </div>

      {/* MaruBatsu buttons - outside container */}
      <MaruBatsuButtons
        value={cur.kind === "s" ? ans[cur.q.id] : undefined}
        onPick={(v) => {
          if (cur.kind === "s") setAns((a) => ({ ...a, [cur.q.id]: v }));
        }}
      />

      {/* Show answer button + explanation */}
      {cur.kind === "s" && ans[cur.q.id] && (
        <div className="space-y-2">
          <button
            type="button"
            className="text-sm text-red-900 underline active:opacity-70 transition w-full text-center"
            onClick={() =>
              setShow((s) => ({ ...s, [cur.q.id]: !s[cur.q.id] }))
            }
          >
            {show[cur.q.id] ? LABELS.hideAns : LABELS.showAns}
          </button>
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

      {/* Navigation buttons */}
      <NavigationButtons
        disabledPrev={idx === 0}
        disabledNext={idx >= total - 1}
        onPrev={() => navigateTo(Math.max(0, idx - 1))}
        onNext={() => navigateTo(Math.min(total - 1, idx + 1))}
        prevLabel={LABELS.prev}
        nextLabel={LABELS.next}
      />

      <AdBanner />
    </div>
  );
}

/* ─────────────────────────── ScenarioPracticeBlock ──────────────────────────── */
function ScenarioPracticeBlock(props: {
  lang: Lang;
  group: ScenarioGroup;
  values: Record<string, MaruBatsu | undefined>;
  show: Record<string, boolean>;
  onPick: (partId: string, v: MaruBatsu) => void;
  onToggleExplain: (key: string) => void;
  onToggleDoubt?: () => void;
  isDoubtful?: boolean;
  flagLabel?: string;
  unflagLabel?: string;
}) {
  const { lang, group, values, show, onPick, onToggleExplain, onToggleDoubt, isDoubtful, flagLabel, unflagLabel } = props;
  const L = {
    answer: lang === "vi" ? "Đáp án:" : "答え：",
    hide: lang === "vi" ? "Ẩn" : "隠す",
    show: lang === "vi" ? "Đáp án" : "答え",
  };
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header - Flag only */}
      <div className="flex justify-end mb-2 shrink-0">
        {onToggleDoubt && (
          <motion.button
            type="button"
            onClick={onToggleDoubt}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition ${
              isDoubtful
                ? "bg-amber-500 border-amber-600 text-amber-950"
                : "bg-amber-900/30 border-amber-800 text-amber-200"
            }`}
            whileTap={{ scale: 0.92 }}
          >
            <Flag size={12} className={isDoubtful ? "fill-amber-950" : ""} />
            {isDoubtful ? unflagLabel : flagLabel}
          </motion.button>
        )}
      </div>

      {/* Stem */}
      <p className="text-xs text-rose-700 font-medium mb-2 shrink-0 flex items-center gap-1">
        <CircleAlert size={12} />
        {lang === "vi" ? "Phải trả lời đúng TẤT CẢ 3 ý nhỏ." : "3題すべて正解で2点獲得。"}
      </p>
      <p className="text-sm font-semibold text-neutral-900 mb-2 shrink-0">
        {tx(group.stem, group.stemVi, lang)}
      </p>

      {/* Subs - scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {group.subs.map((sub) => {
          return (
            <div
              key={sub.partId}
              className="border-t-2 border-amber-800/30 pt-2 space-y-2"
            >
              <div className="flex gap-2 items-start">
                <IllustrationImage
                  file={sub.image}
                  className="w-20 h-16 shrink-0 rounded"
                  imgClassName="w-full h-full object-contain"
                />
                <p className="text-xs flex-1 text-neutral-900 leading-snug">
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
    </div>
  );
}

/* ─────────────────────────── ExamMaruBatsuSection ──────────────────────────── */
function ExamMaruBatsuSection(props: {
  item: ExamItem;
  simpleAns: Record<string, MaruBatsu | undefined>;
  scenarioAns: Record<string, Record<string, MaruBatsu | undefined>>;
  setSimple: (id: string, v: MaruBatsu) => void;
  setScenario: (gid: string, partId: string, v: MaruBatsu) => void;
  lang: Lang;
}) {
  const { item, simpleAns, scenarioAns, setSimple, setScenario, lang } = props;
  
  const base = "flex-1 py-2 rounded-lg font-bold text-xl border-2 border-amber-950 shadow transition active:scale-95 active:opacity-70 disabled:opacity-40";
  
  const MaruBatsuBtn = (value?: MaruBatsu, onPick?: () => void) => (
    <button
      type="button"
      onClick={onPick}
      className={`${base} ${onPick ? "cursor-pointer" : "opacity-40"} ${
        value === "○"
          ? "bg-emerald-600 text-white ring-2 ring-amber-200"
          : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white"
      }`}
    >
      ○
    </button>
  );
  
  const BatsuBtn = (value?: MaruBatsu, onPick?: () => void) => (
    <button
      type="button"
      onClick={onPick}
      className={`${base} ${onPick ? "cursor-pointer" : "opacity-40"} ${
        value === "×"
          ? "bg-rose-700 text-white ring-2 ring-amber-200"
          : "bg-gradient-to-b from-rose-500 to-rose-800 text-white"
      }`}
    >
      ×
    </button>
  );

  return (
    <div className="space-y-2">
      {item.type === "simple" && (
        <div className="flex gap-3 flex-wrap">
          {MaruBatsuBtn(simpleAns[item.question.id], () => setSimple(item.question.id, "○"))}
          {BatsuBtn(simpleAns[item.question.id], () => setSimple(item.question.id, "×"))}
        </div>
      )}
      
      {item.type === "scenario" && (
        <div className="space-y-3">
          {item.group.subs.map((sub) => {
            const gAns = scenarioAns[item.group.groupId] ?? {};
            return (
              <div key={sub.partId} className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 w-6">{sub.subKey}</span>
                <div className="flex-1 flex gap-3 flex-wrap">
                  {MaruBatsuBtn(gAns[sub.partId], () => setScenario(item.group.groupId, sub.partId, "○"))}
                  {BatsuBtn(gAns[sub.partId], () => setScenario(item.group.groupId, sub.partId, "×"))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── ExamQuestionPanel with Flag ──────────────────────────── */
function ExamQuestionPanel(props: {
  lang: Lang;
  item: ExamItem;
  isFlagged: boolean;
  onToggleFlag: () => void;
  animating?: boolean;
}) {
  const { lang, item, isFlagged, onToggleFlag, animating } = props;

  const L = {
    part1: lang === "vi" ? "Phần 1 · Lý thuyết ○×" : "第1部 · ○×問題",
    part1Sub: lang === "vi" ? "1 điểm / câu" : "1点 / 問",
    part2: lang === "vi" ? "Phần 2 · Hình ảnh (Kiken Yosoku)" : "第2部 · イラスト問題（危険予測）",
    part2Sub: lang === "vi" ? "Cả 3 ý đúng → 2 điểm" : "3問すべて正解 → 2点",
    part2Warning: lang === "vi"
      ? "Phải trả lời đúng TẤT CẢ 3 ý nhỏ mới được điểm."
      : "3題すべて正解で2点獲得。",
    flag: lang === "vi" ? "Đánh dấu" : "ブックマーク",
    unflag: lang === "vi" ? "Bỏ đánh dấu" : "ブックマーク解除",
  };

  return (
    <div className={`tile-card p-3 flex flex-col flex-1 min-h-0 transition-opacity duration-150 ${animating ? "opacity-0" : "opacity-100"}`}>
      {/* Header with flag - shrink-0 để giữ cố định */}
      <div className="shrink-0 flex items-center justify-between">
        {item.type === "simple" ? (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-red-900/70 font-black">{L.part1}</p>
            <span className="text-[0.6rem] text-red-800/70 bg-red-100 rounded px-1.5 py-0.5 font-bold">
              {L.part1Sub}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-rose-900/80 font-black">{L.part2}</p>
            <span className="text-[0.6rem] text-rose-800/70 bg-rose-100 rounded px-1.5 py-0.5 font-bold">
              {L.part2Sub}
            </span>
          </div>
        )}
        <motion.button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition ${
            isFlagged
              ? "bg-amber-500 border-amber-600 text-amber-950"
              : "bg-amber-900/30 border-amber-800 text-amber-200"
          }`}
          whileTap={{ scale: 0.92 }}
        >
          <Flag size={12} className={isFlagged ? "fill-amber-950" : ""} />
          {isFlagged ? L.unflag : L.flag}
        </motion.button>
      </div>

      {/* Question content - flex-1 min-h-0 để co giãn, overflow-auto nếu quá dài */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {item.type === "simple" && (
          <div className="space-y-2">
            {item.question.image && (
              <IllustrationImage
                file={item.question.image}
                className="w-full max-h-32 rounded-lg"
                imgClassName="w-full max-h-32 object-contain"
              />
            )}
            <p className="text-sm leading-relaxed text-neutral-900 font-medium text-center">
              {tx(item.question.text, item.question.textVi, lang)}
            </p>
          </div>
        )}

        {item.type === "scenario" && (
          <div className="space-y-2">
            <p className="text-[0.65rem] text-rose-700 font-medium flex items-center gap-1">
              <CircleAlert size={12} />
              {L.part2Warning}
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {tx(item.group.stem, item.group.stemVi, lang)}
            </p>
            {item.group.subs.map((sub) => {
              return (
                <div
                  key={sub.partId}
                  className="border-t-2 border-amber-800/30 pt-2 space-y-1"
                >
                  <div className="flex gap-2 items-start">
                    <IllustrationImage
                      file={sub.image}
                      className="w-20 h-16 shrink-0 rounded"
                      imgClassName="max-w-full max-h-full object-contain"
                    />
                    <p className="text-xs flex-1 text-neutral-900 leading-snug">
                      【{sub.subKey}】{tx(sub.text, sub.textVi, lang)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── ChapterBreakdownChart ──────────────────────────── */
function ChapterBreakdownChart(props: {
  details: Array<{
    index: number;
    item: ExamItem;
    points: number;
  }>;
  lang: Lang;
}) {
  const { details, lang } = props;
  
  // Calculate chapter breakdown
  const chapterStats = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    for (const d of details) {
      const chapterId = d.item.type === "simple" 
        ? d.item.question.chapter 
        : d.item.group.chapter;
      const label = CHAPTER_VI[chapterId] ?? chapterId;
      if (!stats[label]) stats[label] = { correct: 0, total: 0 };
      stats[label].total += 1;
      if (d.points >= 1) stats[label].correct += 1;
    }
    return stats;
  }, [details]);

  const L = {
    title: lang === "vi" ? "Phân bố điểm theo chương" : "章別正解率",
    correct: lang === "vi" ? "Đúng" : "正解",
    wrong: lang === "vi" ? "Sai" : "不正解",
  };

  return (
    <div className="tile-card p-4 space-y-2">
      <p className="text-xs font-black text-neutral-800 uppercase tracking-wider">
        {L.title}
      </p>
      {Object.entries(chapterStats).map(([chapter, stats]) => {
        const pct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
        const isGood = pct >= 70;
        const isBad = pct < 50;
        
        return (
          <div key={chapter} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-700 truncate max-w-[120px]">{chapter}</span>
              <span className={isBad ? "text-rose-600 font-bold" : isGood ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                {stats.correct}/{stats.total} ({Math.round(pct)}%)
              </span>
            </div>
            <div className="h-3 bg-neutral-200 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-500 ${isBad ? "bg-rose-500" : isGood ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${pct}%` }}
              />
              {pct < 100 && (
                <div 
                  className="h-full bg-neutral-400"
                  style={{ width: `${100 - pct}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── ResultsView ──────────────────────────── */
function ResultsView(props: {
  lang: Lang;
  score: NonNullable<ReturnType<typeof scoreExam>>;
  onReview: () => void;
  onReviewAll: () => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const { lang, score, onReview, onReviewAll, onHome, onRetry } = props;
  const wrong = score.details.filter((d) => d.points < 1);
  const allItems = score.details;

  const simpleCorrect = score.details
    .filter((d) => d.item.type === "simple" && d.points >= 1)
    .length;
  const scenarioCorrect = score.details
    .filter((d) => d.item.type === "scenario" && d.points >= 1)
    .length;
  const totalScenarioGroups = score.details.filter(
    (d) => d.item.type === "scenario"
  ).length;

  const L = {
    title: lang === "vi" ? "Kết quả bài thi" : "試験結果",
    condition: lang === "vi"
      ? `Điều kiện đạt: từ 45/50 điểm trở lên (≥ 90%)`
      : `合格条件：50点中45点以上（90%以上）`,
    part1: lang === "vi" ? "Phần 1 · Lý thuyết" : "第1部 · 理論",
    part2: lang === "vi" ? "Phần 2 · Hình ảnh" : "第2部 · イラスト",
    reviewBtn: lang === "vi"
      ? `Giải thích & xem lại ${wrong.length} phần sai`
      : `解説を見る · ${wrong.length}問の間違いを復習`,
    reviewAllBtn: lang === "vi" ? "Xem lại tất cả câu" : "全問を復習",
    perfect: lang === "vi" ? "Không có câu sai — xuất sắc!" : "全問正解 — お見事！",
    retry: lang === "vi" ? "Làm đề mới" : "新しい問題に挑戦",
    home: lang === "vi" ? "Về trang chủ" : "ホームに戻る",
    passed: lang === "vi" ? "ĐẠT" : "合格",
    failed: lang === "vi" ? "CHƯA ĐẠT" : "不合格",
    maxLabel: lang === "vi" ? "tối đa" : "満点",
    loading: lang === "vi" ? "Đang nộp bài..." : "提出中...",
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      {/* Score card */}
      <div className="tile-card p-5 text-center space-y-3">
        <p className="text-sm text-neutral-700 font-medium">{L.title}</p>

        <div>
          <p className="text-5xl font-black text-neutral-900 leading-none">
            {score.total}
          </p>
          <p className="text-lg font-bold text-neutral-500">
            / {score.max}
          </p>
        </div>

        <motion.div
          className={`inline-flex items-center gap-1.5 px-6 py-1.5 rounded-full font-black text-base ${
            score.passed
              ? "bg-emerald-500 text-white shadow"
              : "bg-rose-600 text-white shadow"
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {score.passed ? <Check size={16} /> : <X size={16} />}
          {score.passed ? L.passed : L.failed}
        </motion.div>

        <p className="text-xs text-neutral-600 px-2">{L.condition}</p>
      </div>

      {/* Chapter breakdown chart */}
      <ChapterBreakdownChart details={score.details} lang={lang} />

      {/* Part breakdown */}
      <div className="tile-card p-4 space-y-3">
        <p className="text-xs font-black text-neutral-800 uppercase tracking-wider">
          {lang === "vi" ? "Chi tiết từng phần" : "内訳"}
        </p>

        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-black text-red-800">1</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-900">{L.part1}</p>
            <p className="text-[0.65rem] text-red-700/80">
              {lang === "vi"
                ? `${simpleCorrect}/46 câu đúng`
                : `${simpleCorrect}/46問 正解`}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-red-900">{simpleCorrect}</p>
            <p className="text-[0.6rem] text-red-700/80">{L.maxLabel} 46</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
          <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-black text-rose-800">2</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-rose-900">{L.part2}</p>
            <p className="text-[0.65rem] text-rose-700/80">
              {lang === "vi"
                ? `${totalScenarioGroups} câu hình · ${scenarioCorrect} câu đúng (đủ 3 ý)`
                : `${totalScenarioGroups}イラスト · ${scenarioCorrect}問 正解（3問全て）`}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-rose-900">{scenarioCorrect * 2}</p>
            <p className="text-[0.6rem] text-rose-700/80">{L.maxLabel} 4</p>
          </div>
        </div>
      </div>

      {/* Review buttons */}
      <div className="flex gap-2">
        {wrong.length > 0 && (
          <motion.button
            type="button"
            onClick={onReview}
            className="flex-1 py-2 rounded-xl font-bold bg-amber-200 text-amber-950 border-2 border-amber-950 active:opacity-70 transition"
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center justify-center gap-1">
              <BookOpen size={14} />
              {L.reviewBtn}
            </span>
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={onReviewAll}
          className={`${wrong.length > 0 ? "flex-1" : "w-full"} py-2 rounded-xl font-bold bg-emerald-200 text-emerald-950 border-2 border-emerald-800 active:opacity-70 transition`}
          whileTap={{ scale: 0.97 }}
        >
          <span className="flex items-center justify-center gap-1">
            <ListOrdered size={14} />
            {L.reviewAllBtn}
          </span>
        </motion.button>
      </div>
      {wrong.length === 0 && (
        <p className="text-center text-emerald-200 text-sm font-medium">
          {L.perfect}
        </p>
      )}

      {/* Action buttons */}
      <motion.button
        type="button"
        onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold bg-orange-300 text-amber-950 border-2 border-amber-950 active:opacity-70 transition"
        whileTap={{ scale: 0.97 }}
      >
        <RotateCcw size={16} />
        {L.retry}
      </motion.button>
      <button
        type="button"
        onClick={onHome}
        className="w-full text-amber-200 underline text-sm active:opacity-70 transition"
      >
        {L.home}
      </button>

      <AdBanner />
    </div>
  );
}

/* ─────────────────────────── ReviewView ──────────────────────────── */
function ReviewView(props: {
  lang: Lang;
  score: NonNullable<ReturnType<typeof scoreExam>>;
  onBackResults: () => void;
  onHome: () => void;
  reviewAll?: boolean;
}) {
  const { lang, score, onBackResults, onHome, reviewAll = false } = props;
  const wrong = score.details.filter((d) => d.points < 1);
  const itemsToShow = reviewAll ? score.details : wrong;

  const L = {
    back: lang === "vi" ? "← Kết quả" : "← 結果",
    title: lang === "vi" ? "Câu / nhóm sai" : "間違い一覧",
    titleAll: lang === "vi" ? "Tất cả câu hỏi" : "全問題一覧",
    questionNum: (n: number) => lang === "vi" ? `Câu ${n + 1} trong đề` : `問${n + 1}`,
    yourChoice: lang === "vi" ? "Bạn chọn:" : "あなたの選択：",
    correctAns: lang === "vi" ? "Đúng:" : "正解：",
    scenarioNote: lang === "vi"
      ? "Nhóm hình ảnh: cả 3 ý đúng → được 2 điểm."
      : "イラスト問題：3題すべて正解で2点",
    home: lang === "vi" ? "Trang chủ" : "ホーム",
    answer: lang === "vi" ? "Đáp án:" : "答え：",
    correct: lang === "vi" ? "Đúng" : "正解",
    wrong: lang === "vi" ? "Sai" : "不正解",
  };

  return (
    <div className="space-y-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={onBackResults}
        className="flex items-center gap-1 text-amber-200 text-sm active:opacity-70 transition"
      >
        <ArrowLeft size={14} />
        {L.back}
      </button>
      <h3 className="text-amber-50 font-bold">{reviewAll ? L.titleAll : L.title}</h3>
      <div className="space-y-4">
        {itemsToShow.map((d) => (
          <div key={d.index} className={`tile-card p-4 text-sm space-y-2 ${d.points >= 1 ? "border-l-4 border-emerald-500" : "border-l-4 border-rose-500"}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-red-800">
                {L.questionNum(d.index)}
              </p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${d.points >= 1 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                {d.points >= 1 ? <Check size={10} /> : <X size={10} />}
                {d.points >= 1 ? L.correct : L.wrong}
              </span>
            </div>
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
                <p className={d.simple.correct ? "text-emerald-700" : "text-rose-700"}>
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
                      className={`rounded p-2 border ${ok ? "border-emerald-300 bg-emerald-50/50" : "border-rose-400 bg-rose-50/80"}`}
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
                      <p className={`text-xs mt-1 font-medium ${ok ? "text-emerald-700" : "text-rose-700"}`}>
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
        className="w-full py-2 rounded-xl font-bold bg-amber-900/50 text-amber-50 border border-amber-700 active:opacity-70 transition"
      >
        {L.home}
      </button>
    </div>
  );
}

/* ─────────────────────────── HistoryView ──────────────────────────── */
function HistoryView(props: {
  lang: Lang;
  history: ExamHistoryEntry[];
  onBack: () => void;
}) {
  const { lang, history, onBack } = props;
  
  const L = {
    back: lang === "vi" ? "← Trang chủ" : "← ホーム",
    title: lang === "vi" ? "Lịch sử thi" : "試験履歴",
    empty: lang === "vi" ? "Chưa có lịch sử thi" : "試験履歴がありません",
    date: lang === "vi" ? "Ngày" : "日付",
    score: lang === "vi" ? "Điểm" : "点数",
    result: lang === "vi" ? "Kết quả" : "結果",
    passed: lang === "vi" ? "ĐẠT" : "合格",
    failed: lang === "vi" ? "CHƯA ĐẠT" : "不合格",
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "vi" ? "vi-VN" : "ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-amber-200 text-sm active:opacity-70 transition"
      >
        <ArrowLeft size={14} />
        {L.back}
      </button>
      <h3 className="text-amber-50 font-bold text-lg">{L.title}</h3>
      
      {history.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-amber-200/60">{L.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <div key={i} className="tile-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-600">{formatDate(entry.date)}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${entry.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {entry.passed ? L.passed : L.failed}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-neutral-900">{entry.score}</span>
                <span className="text-neutral-500">/ {entry.max}</span>
                <span className="ml-auto text-sm font-medium text-amber-800">
                  {Math.round((entry.score / entry.max) * 100)}%
                </span>
              </div>
              {/* Chapter breakdown mini bar */}
              <div className="mt-2 flex gap-1 flex-wrap">
                {Object.entries(entry.details.chapterBreakdown).slice(0, 5).map(([ch, stats]) => {
                  const pct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                  return (
                    <div key={ch} className="text-[0.5rem] text-neutral-500" title={ch}>
                      <div className="h-1.5 w-8 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pct >= 70 ? "bg-emerald-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span>{ch.slice(0, 6)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── LoadingOverlay ──────────────────────────── */
function LoadingOverlay(props: { message: string }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 text-center space-y-3 shadow-2xl">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-neutral-800">{props.message}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main App ──────────────────────────── */
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examFlags, setExamFlags] = useState<Set<string>>(new Set());
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [animating, setAnimating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const examPaperRef = useRef(examPaper);
  examPaperRef.current = examPaper;

  // Count answered questions for progress bar
  const answeredCount = useMemo(() => {
    return examPaper.filter((item) => {
      if (item.type === "simple") return simpleAns[item.question.id] !== undefined;
      const gAns = scenarioAns[item.group.groupId];
      if (!gAns) return false;
      return item.group.subs.every((s) => gAns[s.partId] !== undefined);
    }).length;
  }, [examPaper, simpleAns, scenarioAns]);

  // Load stats and history on mount
  useEffect(() => {
    setPersonalStats(loadStats());
    setExamHistory(loadHistory());
  }, []);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "jp" ? "vi" : "jp"));
  }, []);

  const goToExamPrep = useCallback(() => {
    setView({ mode: "examPrep" });
  }, []);

  const startExam = useCallback(() => {
    const paper = buildMockExam(bank);
    setExamPaper(paper);
    setExamIndex(0);
    setSimpleAns({});
    setScenarioAns({});
    setSecondsLeft(EXAM_SECONDS);
    setSubmitted(false);
    setExamFlags(new Set());
    setView({ mode: "exam" });
  }, []);

  const submitExam = useCallback(() => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);
    
    // Simulate submission delay for animation
    setTimeout(() => {
      const paper = examPaperRef.current;
      const result = scoreExam(paper, simpleAns, scenarioAns);
      
      // Update personal stats
      updateStatsWithResult(result);
      setPersonalStats(loadStats());
      
      // Save to history
      const chapterBreakdown: Record<string, { correct: number; total: number }> = {};
      for (const d of result.details) {
        const chapterId = d.item.type === "simple" ? d.item.question.chapter : d.item.group.chapter;
        const label = CHAPTER_VI[chapterId] ?? chapterId;
        if (!chapterBreakdown[label]) chapterBreakdown[label] = { correct: 0, total: 0 };
        chapterBreakdown[label].total += 1;
        if (d.points >= 1) chapterBreakdown[label].correct += 1;
      }
      
      const entry: ExamHistoryEntry = {
        date: new Date().toISOString(),
        score: result.total,
        max: result.max,
        passed: result.passed,
        details: { chapterBreakdown },
      };
      saveHistory(entry);
      setExamHistory(loadHistory());
      
      setIsSubmitting(false);
      setSubmitted(true);
      setView({ mode: "results", paper });
    }, 800);
  }, [submitted, isSubmitting, simpleAns, scenarioAns]);

  // Timer effect
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
  const isWarning = secondsLeft <= TIMER_WARNING_SECONDS;

  const currentItem =
    view.mode === "exam" ? examPaper[examIndex] : undefined;

  const getItemFlagId = (item: ExamItem): string => {
    if (item.type === "simple") return `s-${item.question.id}`;
    return `g-${item.group.groupId}`;
  };

  const toggleFlag = () => {
    if (!currentItem) return;
    const id = getItemFlagId(currentItem);
    setExamFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigateTo = (newIndex: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setExamIndex(newIndex);
      setAnimating(false);
    }, 150);
  };

  const handleBackHome = () => {
    if (view.mode === "exam" && !submitted) {
      setShowExitConfirm(true);
    } else {
      setView({ mode: "home" });
    }
  };

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

  const L = {
    backHome: lang === "vi" ? "Về trang chủ" : "ホームに戻る",
    submit: lang === "vi" ? "Nộp bài" : "答案を提出",
    prev: lang === "vi" ? "Trước" : "前へ",
    next: lang === "vi" ? "Sau" : "次へ",
    confirmExit: lang === "vi" 
      ? "Bạn có chắc muốn thoát?\nTiến trình sẽ bị mất." 
      : "終了してもよろしいですか？\n進捗が失われます。",
    confirmExitBtn: lang === "vi" ? "Thoát" : "終了",
    cancelBtn: lang === "vi" ? "Hủy" : "キャンセル",
    loadingSubmit: lang === "vi" ? "Đang nộp bài..." : "提出中...",
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-y-auto ${
        isHome ? "text-amber-950" : "brick-bg text-amber-950"
      }`}
      style={{ width: "390px", maxWidth: "430px" }}
    >
      {/* Loading overlay */}
      {isSubmitting && <LoadingOverlay message={L.loadingSubmit} />}
      
      {/* Exit confirmation */}
      {showExitConfirm && (
        <ConfirmDialog
          message={L.confirmExit}
          confirmText={L.confirmExitBtn}
          cancelText={L.cancelBtn}
          onConfirm={() => {
            setShowExitConfirm(false);
            setView({ mode: "home" });
          }}
          onCancel={() => setShowExitConfirm(false)}
          variant="danger"
        />
      )}

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

      {/* Language toggle */}
      <div className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-[200]">
        <LangSwitch lang={lang} onToggle={toggleLang} />
      </div>

      <div
        className={`relative z-10 mx-auto w-full ${isHome ? "" : "px-3 pb-10"}`}
        style={{
          maxWidth: "430px",
          paddingTop: isHome ? "0" : "max(2.5rem, env(safe-area-inset-top))",
          paddingBottom: isHome ? "0" : "max(2rem, env(safe-area-inset-bottom))",
        }}
      >
        {!isHome && view.mode !== "exam" && (
          <header className="mb-4" />
        )}

        {view.mode === "home" && (
          <HomeScreen
            lang={lang}
            onStartExam={goToExamPrep}
            onChapter={(chapterId, subChapter) =>
              setView({ mode: "chapter", chapterId, subChapter })
            }
            onShowHistory={() => setView({ mode: "history" })}
            personalStats={personalStats}
          />
        )}

        {view.mode === "examPrep" && (
          <ExamPrepScreen
            lang={lang}
            onStart={startExam}
            onBack={() => setView({ mode: "home" })}
          />
        )}

        {view.mode === "chapter" && (
          <ChapterView
            lang={lang}
            chapterId={view.chapterId}
            subChapter={view.subChapter}
            onBack={() => setView({ mode: "home" })}
          />
        )}

        {view.mode === "history" && (
          <HistoryView
            lang={lang}
            history={examHistory}
            onBack={() => setView({ mode: "home" })}
          />
        )}

        {view.mode === "exam" && currentItem && (
          <div className="space-y-3" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
            {/* Header: Back + Progress + Timer + Submit */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleBackHome}
                className="text-amber-100 text-xs underline active:opacity-70 shrink-0"
              >
                {L.backHome}
              </button>
              
              {/* Progress bar */}
              <div className="flex-1 min-w-[100px] h-2 bg-neutral-700/50 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
                  style={{ width: `${(answeredCount / examPaper.length) * 100}%` }}
                />
              </div>
              <span className="text-[0.6rem] text-amber-200 shrink-0">{examIndex + 1}/{examPaper.length}</span>

              {/* Timer */}
              <span className={`font-mono text-xs shrink-0 ${isWarning ? "text-rose-300" : "text-amber-200"}`}>
                <Clock size={11} className="inline" /> {mm}:{ss}
              </span>

              {/* Submit button */}
              <motion.button
                type="button"
                onClick={submitExam}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white border border-rose-500 transition active:scale-95 shrink-0"
                whileTap={{ scale: 0.95 }}
              >
                {L.submit}
              </motion.button>
            </div>

            {/* Expandable question list */}
            <ProgressIndicator
              total={examPaper.length}
              current={examIndex}
              simpleAns={simpleAns}
              scenarioAns={scenarioAns}
              paper={examPaper}
              flags={examFlags}
              onJump={navigateTo}
              lang={lang}
              expanded={showQuestionList}
              onToggleExpand={() => setShowQuestionList(!showQuestionList)}
            />

            {/* Fixed height question container */}
            <div className="flex flex-col h-[340px] shrink-0">
              <ExamQuestionPanel
                lang={lang}
                item={currentItem}
                isFlagged={examFlags.has(getItemFlagId(currentItem))}
                onToggleFlag={toggleFlag}
                animating={animating}
              />
            </div>

            {/* MaruBatsu buttons - outside container, like practice section */}
            <ExamMaruBatsuSection
              item={currentItem}
              simpleAns={simpleAns}
              scenarioAns={scenarioAns}
              setSimple={setSimple}
              setScenario={setScenario}
              lang={lang}
            />

            {/* Navigation buttons */}
            <NavigationButtons
              disabledPrev={examIndex === 0}
              disabledNext={examIndex >= examPaper.length - 1}
              onPrev={() => navigateTo(Math.max(0, examIndex - 1))}
              onNext={() => navigateTo(Math.min(examPaper.length - 1, examIndex + 1))}
              prevLabel={L.prev}
              nextLabel={L.next}
            />

            <AdBanner />
          </div>
        )}

        {view.mode === "results" && score && (
          <ResultsView
            lang={lang}
            score={score}
            onReview={() => setView({ mode: "review", paper: view.paper, reviewAll: false })}
            onReviewAll={() => setView({ mode: "review", paper: view.paper, reviewAll: true })}
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
            reviewAll={view.reviewAll}
          />
        )}
      </div>
      
      {/* Timer warning pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
