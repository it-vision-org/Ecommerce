import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

type CardProps = MotionProps & {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "", ...motionProps }: CardProps) {
  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}