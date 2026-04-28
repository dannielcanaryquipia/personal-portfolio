import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Distinctive easing curve from the skill - smooth but with character
const distinctiveEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Page entrance with scale and fade - bold, intentional motion
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: distinctiveEase,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// Staggered child elements for choreographed reveals
const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: distinctiveEase,
    },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={styles.pageWrapper}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Background gradient overlay for atmospheric depth */}
        <div className={styles.gradientOverlay} />
        
        {/* Content with staggered reveal */}
        <motion.div className={styles.content} variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for using staggered animations within pages
export const useStaggeredContent = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: distinctiveEase,
      },
    },
  };

  return { containerVariants, itemVariants };
};

// Staggered container component for easy use
interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggeredContainer = ({ children, className }: StaggeredContainerProps) => {
  const { containerVariants } = useStaggeredContent();
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

// Staggered item component
interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggeredItem = ({ children, className }: StaggeredItemProps) => {
  const { itemVariants } = useStaggeredContent();
  
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};
