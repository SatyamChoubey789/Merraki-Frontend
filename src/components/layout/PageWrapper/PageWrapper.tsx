'use client';

import { Box } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { CartDrawer } from '../CartDrawer/CartDrawer';
import { ToastContainer } from '../ToastContainer/ToastContainer';

interface PageWrapperProps {
  children: React.ReactNode;
  noFooter?: boolean;
  noHeader?: boolean;
}

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

export function PageWrapper({ children, noFooter = false, noHeader = false }: PageWrapperProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!noHeader && <Header />}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ flex: 1, paddingTop: noHeader ? 0 : 72 }}
      >
        {children}
      </motion.main>
      {!noFooter && <Footer />}
      <CartDrawer />
      <ToastContainer />
    </Box>
  );
}