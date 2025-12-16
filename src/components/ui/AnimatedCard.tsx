"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hover = true,
}: AnimatedCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={cn(
        "bg-card rounded-xl border border-border",
        "transition-colors duration-300",
        hover && "hover:border-primary/30 hover:shadow-lg dark:hover:shadow-primary/5",
        className
      )}
    >
      {children}
    </m.div>
  );
}
