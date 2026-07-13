"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  variant?: "fade" | "zoom";
  delay?: number;
};

const variants = {
  hidden: (v: "fade" | "zoom") => ({
    opacity: 0,
    y: 16,
    scale: v === "zoom" ? 0.95 : 1,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export function Reveal({ children, variant = "fade", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -48px 0px" });

  return (
    <motion.div
      ref={ref}
      custom={variant}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration: 0.55,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
