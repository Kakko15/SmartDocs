import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#021205]">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring - Emerald Green */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute h-64 w-64 rounded-full border-[1px] border-primary-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
        />
        
        {/* Middle Ring - Golden Yellow */}
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute h-48 w-48 rounded-full border-t-[2px] border-r-[2px] border-secondary-400/50"
        />
        
        {/* Inner Ring - Bright Green */}
        <motion.div
          animate={{
            rotate: 180,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute h-32 w-32 rounded-full border-b-[4px] border-primary-400/60 blur-[1px]"
        />

        {/* Core Text */}
        <div className="flex flex-col items-center gap-2 z-10">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl font-bold tracking-[0.2em] text-white font-[Syncopate] drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
          >
            ISUE
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-[2px] w-full bg-gradient-to-r from-primary-500 to-secondary-500"
          />
          
          <span className="text-xs tracking-widest text-primary-400/80 font-[Rajdhani] uppercase">
            System Initializing
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;