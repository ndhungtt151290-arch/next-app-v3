'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Check, 
  X, 
  Award,
  Languages,
} from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import allQuestions from './data/questions.json';
import { Question, ExamQuestion } from './types';
import MockExam from './components/MockExam';
import QuestionNav from './components/QuestionNav';
import { generateExam } from './utils/examUtils';

// import.meta.glob removed since images are in public

export default function Page() {
  const { t, language, toggleLanguage } = useLanguage();
  const [view, setView] = useState<'home' | 'practice' | 'exam'>('home');
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, '○' | '×' | null>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const questions: Question[] = useMemo(() => allQuestions as Question[], []);
  const chapters = useMemo(() => Array.from(new Set(questions.map(q => q.chapter))), [questions]);

  const chapterQuestions = useMemo(() => {
    if (!selectedChapter) return [];
    return questions.filter(q => q.chapter === selectedChapter);
  }, [questions, selectedChapter]);

  const question = chapterQuestions[currentQuestionIndex];

  const handleStartExam = () => {
    const freshExam = generateExam(questions);
    setExamQuestions(freshExam);
    setView('exam');
  };

  const setQuestionIndex = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };

  const handleAnswer = (answer: '○' | '×') => {
    if (showExplanation || !question) return;
    setPracticeAnswers(prev => ({ ...prev, [question.id]: answer }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < chapterQuestions.length - 1) {
      setQuestionIndex(currentQuestionIndex + 1);
    } else {
      setView('home');
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Find the image for the current question
  const foundImage = question?.image ? `/images/${question.image}` : null;

  return (
    <div 
      className={`min-h-screen font-sans text-neutral-900 selection:bg-red-100 selection:text-red-700 relative transition-all duration-700 flex flex-col ${view === 'home' ? 'bg-white' : 'bg-neutral-50'}`}
      style={{ 
        backgroundImage: view === 'home' ? 'url("/bgh.jpg")' : 'url("/images/q9.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between safe-pt safe-px" style={{ paddingTop: '13px' }}>
        <div className="flex items-center gap-2">
          {view === 'home' ? (
            <>
              <div className="bg-red-600 p-1.5 rounded-lg shadow-sm">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-neutral-900 uppercase">
                {t('appTitle')}
              </h1>
            </>
          ) : (
            <button 
              onClick={() => setView('home')}
              className="p-1.5 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-neutral-200 transition-colors shadow-sm flex items-center group"
              style={{ marginTop: '12px', paddingTop: '3px', marginLeft: '14px', marginRight: '0px', height: '37px', width: '39px' }}
            >
              <div 
                className="bg-white rounded-md shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center"
                style={{ width: '25px', height: '26px', paddingBottom: '3px' }}
              >
                <Home className="w-4 h-4 text-red-600" />
              </div>
            </button>
          )}
        </div>

        <button 
          onClick={toggleLanguage}
          className="relative inline-flex items-center h-9 rounded-full px-0 bg-neutral-100 border border-neutral-200 transition-all hover:bg-neutral-200 active:scale-95 focus:outline-none shadow-sm"
          style={{ height: '35px', width: '63.375px', marginTop: '-3px', marginRight: '15px' }}
        >
          <Languages className="text-red-600" style={{ height: '28px', marginLeft: '7px' }} />
          <span className="text-xs font-black text-neutral-600 uppercase tracking-wider">
            {language === 'vi' ? 'VN' : 'JA'}
          </span>
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-3 flex-1 flex flex-col min-h-0 safe-pb">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4 py-2"
            >
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleStartExam}
                className="group relative w-full overflow-hidden rounded-2xl p-6 shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_0%,_rgba(255,255,255,0.4),_transparent_60%)]" />
                
                <div className="relative flex items-center gap-6 text-white">
                  <div className="glass p-3 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/40">
                    <Play className="w-8 h-8 fill-current text-white/90" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <span className="block text-2xl font-black tracking-tight">{t('mockExam')}</span>
                    <div className="flex items-center gap-2 text-white/70 text-[0.625rem] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                      48 Qs • 50 Mins
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Chapter Selection - Compact Grid */}
              <section className="space-y-3">

                
                <div className="grid grid-cols-2 gap-2">
                  {chapters.map((chapter, idx) => (
                    <motion.button
                      key={chapter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedChapter(chapter); setView('practice'); }}
                      className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-red-300 transition-all text-left group"
                    >
                      <div className="bg-neutral-50 text-neutral-400 group-hover:bg-red-50 group-hover:text-red-600 w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-[0.625rem] font-black transition-colors">
                        {idx + 1}
                      </div>
                      <h3 className="font-bold text-[0.625rem] text-neutral-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight flex-1">{t(chapter)}</h3>
                    </motion.button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'practice' && question && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col flex-1 min-h-0 space-y-4"
            >
              {/* Progress & Chapter Label */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <h2 className="text-[0.625rem] font-black text-red-600 uppercase tracking-widest truncate max-w-[70%]">{t(question.chapter)}</h2>
                  <span className="text-[0.625rem] font-bold text-neutral-400">{currentQuestionIndex + 1} / {chapterQuestions.length}</span>
                </div>
                <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-600" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / chapterQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Navigation */}
              <QuestionNav 
                questions={chapterQuestions}
                currentIndex={currentQuestionIndex}
                onSelect={setQuestionIndex}
                answers={practiceAnswers}
              />

              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-white/50 flex flex-col gap-4 flex-1 min-h-0 overflow-auto" style={{ marginLeft: '0px', width: '343px' }}>
                {foundImage && (
                  <div className="relative group shrink-0" style={{ paddingTop: '10px', marginLeft: '0px', height: '92px', width: '302px', marginTop: '-11px', paddingLeft: '0px' }}>
                    <img 
                      src={foundImage} 
                      alt="Question scenario" 
                      className="object-contain bg-neutral-50 rounded-2xl shadow-sm" 
                      style={{ height: '102px', width: '300px', marginLeft: '1px', marginTop: '-10px', marginBottom: '-11px' }}
                    />
                  </div>
                )}
                <div className="space-y-2 shrink-0">
                  <p className="font-bold leading-tight text-neutral-800" style={{ fontSize: '15px', lineHeight: '18px', textAlign: 'left', fontFamily: 'Times New Roman', marginLeft: '5px', marginTop: '7px' }}>
                    {language === 'vi' && question.contentVi ? question.contentVi : question.content}
                  </p>
                  
                  {language === 'vi' && question.contentVi && (
                    <p className="text-neutral-400 font-medium italic border-l-2 border-neutral-100 pl-3 py-0.5" style={{ fontSize: '11px', lineHeight: '16px', textAlign: 'left', marginLeft: '0px', marginTop: '4px' }}>
                      {question.content}
                    </p>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="flex justify-center shrink-0">
                <div className="flex gap-4" style={{ height: '84px', width: '254px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer('○')}
                    disabled={showExplanation}
                    className={`relative flex-1 rounded-2xl flex items-center justify-center text-6xl font-sans transition-all shadow-md ${
                      showExplanation 
                        ? (question.answer === '○' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white translate-y-[-2px]' : 'bg-neutral-100 text-neutral-300 grayscale opacity-40')
                        : 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white hover:shadow-green-300/50 hover:translate-y-[-2px]'
                    }`}
                    style={{ width: '100px', height: '80px', flex: 'none', marginLeft: '0px', marginRight: '0px' }}
                  >
                    <span className="drop-shadow-lg" style={{ marginTop: '-9px', fontSize: '57px', lineHeight: '57px' }}>○</span>
                    {showExplanation && question.answer === '○' && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-white text-green-500 p-1.5 rounded-full shadow-lg border-2 border-green-500"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer('×')}
                    disabled={showExplanation}
                    className={`relative flex-1 rounded-2xl flex items-center justify-center text-6xl font-sans transition-all shadow-md ${
                      showExplanation 
                        ? (question.answer === '×' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white translate-y-[-2px]' : 'bg-neutral-100 text-neutral-300 grayscale opacity-40')
                        : 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white hover:shadow-red-300/50 hover:translate-y-[-2px]'
                    }`}
                    style={{ width: '100px', height: '80px', flex: 'none', marginTop: '1px', marginLeft: '36px' }}
                  >
                    <span className="drop-shadow-lg" style={{ fontFamily: 'Courier New', height: '74px', fontSize: '80px', lineHeight: '80px', marginTop: '-1px' }}>×</span>
                    {showExplanation && question.answer === '×' && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-white text-red-500 p-1.5 rounded-full shadow-lg border-2 border-red-500"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Feedback & Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className={`p-4 rounded-2xl border shadow-sm ${
                      practiceAnswers[question.id] === question.answer 
                        ? 'bg-green-50/50 border-green-200 text-green-800' 
                        : 'bg-red-50/50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {practiceAnswers[question.id] === question.answer ? (
                          <div className="bg-green-500 p-0.5 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                        ) : (
                          <div className="bg-red-500 p-0.5 rounded-full"><X className="w-3 h-3 text-white" /></div>
                        )}
                        <span className="font-bold text-sm tracking-tight">{practiceAnswers[question.id] === question.answer ? t('correct') : t('incorrect')}</span>
                      </div>
                      
                      <div className="overflow-auto max-h-16">
                        <p className="text-xs font-medium leading-relaxed">
                          {language === 'vi' && question.explanationVi ? question.explanationVi : question.explanation}
                        </p>
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleNext}
                      className="w-full bg-neutral-900 text-white p-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>{currentQuestionIndex < chapterQuestions.length - 1 ? t('next') : t('finish')}</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Nav */}
              {!showExplanation && (
                <div className="flex items-center justify-end pt-1">
                  <div className="flex gap-2">
                    <button 
                      onClick={handleBack}
                      disabled={currentQuestionIndex === 0}
                      className="p-2.5 bg-neutral-100 text-neutral-500 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="px-5 py-2.5 bg-neutral-100 text-neutral-900 font-bold rounded-xl text-[0.625rem] hover:bg-neutral-200 transition-colors"
                    >
                      {t('next')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'exam' && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MockExam 
                questions={examQuestions} 
                onExit={() => setView('home')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

