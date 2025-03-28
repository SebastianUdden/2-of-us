import { AnimatePresence, motion } from "framer-motion";

import { ANIMATION_DURATION } from "./constants";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}

const AnimatedCard = ({
  children,
  isVisible,
  className = "",
}: AnimatedCardProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: ANIMATION_DURATION / 1000,
            ease: "easeOut",
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedCard;
