export type MaruBatsu = "○" | "×";

export type SimpleQuestion = {
  kind: string;
  id: string;
  chapter: string;
  section: string;
  text: string;
  answer: MaruBatsu;
  explanation: string;
  image?: string;
  textVi?: string | null;
  explanationVi?: string | null;
};

export type ScenarioSub = {
  subKey: string;
  text: string;
  answer: MaruBatsu;
  explanation: string;
  image?: string;
  partId: string;
  textVi?: string | null;
  explanationVi?: string | null;
};

export type ScenarioGroup = {
  groupId: string;
  chapter: string;
  section: string;
  stem: string;
  stemVi?: string | null;
  subs: ScenarioSub[];
};

export type QuestionBank = {
  chapterOrder: string[];
  simple: SimpleQuestion[];
  simpleForExam: SimpleQuestion[];
  scenarioGroups: ScenarioGroup[];
  dangerScenarioGroups: ScenarioGroup[];
};

export type ExamSimpleItem = { type: "simple"; question: SimpleQuestion };
export type ExamScenarioItem = { type: "scenario"; group: ScenarioGroup };
export type ExamItem = ExamSimpleItem | ExamScenarioItem;
