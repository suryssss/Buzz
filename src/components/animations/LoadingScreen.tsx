"use client"
import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <motion.div className="flex space-x-1 text-5xl font-extrabold text-white">
        {"buzz".split("").map((char, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
