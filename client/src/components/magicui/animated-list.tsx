"use client";

import { AnimatePresence, motion } from "framer-motion"; // Corrected import for framer-motion
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react";

// AnimatedListItem component for individual items with motion
export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    // Use effect to control when the next item shows up
    useEffect(() => {
      if (index < childrenArray.length) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
      }
    }, [index, delay, childrenArray.length]);

    // Create the list of items that should be displayed
    const itemsToShow = useMemo(() => {
      return childrenArray.slice(0, index); // Display items in order
    }, [index, childrenArray]);

    return (
      <div
        className={`flex flex-col items-center gap-4 ${className}`}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item, idx) => (
            <AnimatedListItem key={idx}>{item}</AnimatedListItem> // Use `idx` for unique keys
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";
