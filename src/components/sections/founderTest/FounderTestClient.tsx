'use client';

import { useRef } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Box } from '@mui/material';
import { useFounderTestEngine } from '@/lib/hooks/useFounderTestEngine';
import { TestIntroScreen } from './TestIntroScreen';
import { TestQuestionScreen } from './TestQuestionScreen';
import { TestContactScreen } from './TestContactScreen';
import { TestSubmittingScreen } from './TestSubmittingScreen';

/* ── Page transition — cinematic slide with depth ────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const pageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '6%' : '-6%',
    opacity: 0,
    filter: 'blur(4px)',
    scale: 0.985,
  }),
  center: {
    x: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-5%' : '5%',
    opacity: 0,
    filter: 'blur(3px)',
    scale: 0.988,
    transition: { duration: 0.38, ease: EASE },
  }),
};

export function FounderTestClient() {
  const engine = useFounderTestEngine();
  const dirRef  = useRef(1);

  /* Track direction for prev/next */
  const prevIdx = useRef(0);
  const curIdx  = engine.currentStep === 'questions' ? engine.currentQuestionIndex : -1;
  if (curIdx !== -1 && curIdx !== prevIdx.current) {
    dirRef.current  = curIdx > prevIdx.current ? 1 : -1;
    prevIdx.current = curIdx;
  }

  const stepKey = engine.currentStep === 'questions'
    ? `q-${engine.currentQuestionIndex}`
    : engine.currentStep;

  const renderStep = () => {
    switch (engine.currentStep) {
      case 'intro':
        return <TestIntroScreen
          isLoading={engine.isLoading}
          isError={engine.isError}
          totalQuestions={engine.totalQuestions}
          onStart={engine.handleStart}
        />;
      case 'questions':
        return <TestQuestionScreen engine={engine} />;
      case 'contact':
        return <TestContactScreen
          onSubmit={engine.handleContactSubmit}
          onBack={engine.handlePrev}
          isSubmitting={engine.isSubmitting}
        />;
      case 'submitting':
        return <TestSubmittingScreen />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait" custom={dirRef.current}>
        <motion.div
          key={stepKey}
          custom={dirRef.current}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}