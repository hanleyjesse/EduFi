import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CompanyLogo } from "./CompanyLogo";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress - 4 seconds total duration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500); // Small delay before transition
          return 100;
        }
        return prev + 1.25; // 100 / 1.25 = 80 intervals * 50ms = 4000ms (4 seconds)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // Create bar chart bars with staggered animation
  const bars = [
    { height: "40%", delay: 0 },
    { height: "60%", delay: 0.1 },
    { height: "80%", delay: 0.2 },
    { height: "50%", delay: 0.3 },
    { height: "90%", delay: 0.4 },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-[#d4e8c1] flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative circles */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#799952]/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#e0af41]/10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Growing Bar Chart Animation */}
        <motion.div
          className="flex items-end gap-2 h-24 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {bars.map((bar, index) => (
            <motion.div
              key={index}
              className="w-8 bg-[#799952] rounded-t-lg"
              initial={{ height: 0 }}
              animate={{ height: bar.height }}
              transition={{
                duration: 0.8,
                delay: bar.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Logo with Fade In and Scale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CompanyLogo size="large" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-[#45280b]/70 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Building Your Financial Future
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-2 bg-[#fff5d6] rounded-full overflow-hidden border border-[#e0af41]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#799952] to-[#578027] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Circular Pulse Effect around Logo Area */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-96 h-96 rounded-full border-4 border-[#799952]" />
        </motion.div>
      </div>

      {/* Floating Coins Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full bg-[#e0af41] shadow-lg"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-[#45280b] text-xs font-bold">
              $
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}