import type {
  ExamItem,
  MaruBatsu,
  QuestionBank,
  ScenarioGroup,
  SimpleQuestion,
} from "./types";

function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 45 câu ○× ngẫu nhiên + 3 nhóm tình huống (危険予測), mỗi nhóm 3 ý — tối đa 48 điểm */
export function buildMockExam(bank: QuestionBank): ExamItem[] {
  const pool = [...bank.simpleForExam];
  const picked = shuffle(pool).slice(0, 45);
  const scenarios = shuffle([...bank.dangerScenarioGroups]).slice(0, 3);
  const simpleItems: ExamItem[] = picked.map((question) => ({
    type: "simple",
    question,
  }));
  const scenItems: ExamItem[] = scenarios.map((group) => ({
    type: "scenario",
    group,
  }));
  return [...simpleItems, ...scenItems];
}

export type SimpleAttempt = { correct: boolean; user?: MaruBatsu };
export type ScenarioAttempt = {
  correct: boolean;
  subs: Record<string, { user?: MaruBatsu; correct: boolean }>;
};

export function scoreExam(
  paper: ExamItem[],
  simpleAns: Record<string, MaruBatsu | undefined>,
  scenarioAns: Record<string, Record<string, MaruBatsu | undefined>>
): {
  total: number;
  max: number;
  passed: boolean;
  details: Array<{
    index: number;
    item: ExamItem;
    points: number;
    simple?: SimpleAttempt;
    scenario?: ScenarioAttempt;
  }>;
} {
  const max = 48;
  let total = 0;
  const details: Array<{
    index: number;
    item: ExamItem;
    points: number;
    simple?: SimpleAttempt;
    scenario?: ScenarioAttempt;
  }> = [];

  paper.forEach((item, index) => {
    if (item.type === "simple") {
      const id = item.question.id;
      const user = simpleAns[id];
      const correct = user === item.question.answer;
      if (correct) total += 1;
      details.push({
        index,
        item,
        points: correct ? 1 : 0,
        simple: { correct, user },
      });
    } else {
      const gid = item.group.groupId;
      const perSub: Record<string, { user?: MaruBatsu; correct: boolean }> =
        {};
      let allOk = true;
      for (const sub of item.group.subs) {
        const user = scenarioAns[gid]?.[sub.partId];
        const ok = user === sub.answer;
        perSub[sub.partId] = { user, correct: ok };
        if (!ok) allOk = false;
      }
      if (allOk) total += 1;
      details.push({
        index,
        item,
        points: allOk ? 1 : 0,
        scenario: { correct: allOk, subs: perSub },
      });
    }
  });

  return { total, max, passed: total >= 45, details };
}

export function questionsForChapter(
  bank: QuestionBank,
  chapter: string
): { simple: SimpleQuestion[]; scenarios: ScenarioGroup[] } {
  const simple = bank.simple.filter((q) => q.chapter === chapter);
  const scenarios = bank.scenarioGroups.filter((g) => g.chapter === chapter);
  return { simple, scenarios };
}
