'use client';

import { AnimatePresence, motion, Variants} from 'framer-motion';
import { Box } from '@mui/material';
import { useFounderTestEngine } from '@/lib/hooks/useFounderTestEngine';
import { TestIntroScreen } from './TestIntroScreen';
import { TestQuestionScreen } from './TestQuestionScreen';
import { TestContactScreen } from './TestContactScreen';
import { TestSubmittingScreen } from './TestSubmittingScreen';

const pageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  }),
};

export function FounderTestClient() {
  const engine = useFounderTestEngine();

  const renderStep = () => {
    switch (engine.currentStep) {
      case 'intro':
        return (
          <motion.div key="intro" custom={1} variants={pageVariants} initial="enter" animate="center" exit="exit">
            <TestIntroScreen
              isLoading={engine.isLoading}
              isError={engine.isError}
              totalQuestions={engine.totalQuestions}
              onStart={engine.handleStart}
            />
          </motion.div>
        );
      case 'questions':
        return (
          <motion.div key={`q-${engine.currentQuestionIndex}`} custom={1} variants={pageVariants} initial="enter" animate="center" exit="exit">
            <TestQuestionScreen engine={engine} />
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div key="contact" custom={1} variants={pageVariants} initial="enter" animate="center" exit="exit">
            <TestContactScreen
              onSubmit={engine.handleContactSubmit}
              onBack={engine.handlePrev}
              isSubmitting={engine.isSubmitting}
            />
          </motion.div>
        );
      case 'submitting':
        return (
          <motion.div key="submitting" variants={pageVariants} initial="enter" animate="center" exit="exit">
            <TestSubmittingScreen />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: { xs: 4, md: 6 } }}>
      <AnimatePresence mode="wait" custom={1}>
        {renderStep()}
      </AnimatePresence>
    </Box>
  );
}