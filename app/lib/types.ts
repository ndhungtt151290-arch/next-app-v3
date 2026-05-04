export type MaruBatsu = "○" | "×";

export type SimpleQuestion = {
  id: string;
  chapter: string;
  section: string;
  text: string;
  answer: MaruBatsu;
  explanation: string;
  image?: string;
};

export type ScenarioSub = {
  subKey: string;
  text: string;
  answer: MaruBatsu;
  explanation: string;
  image?: string;
  partId: string;
};

export type ScenarioGroup = {
  groupId: string;
  chapter: string;
  section: string;
  stem: string;
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
