import { motion } from 'framer-motion';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-void">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      {/* Top Right Orb - Electric Blue */}
      <motion.div
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-electric/10 rounded-full blur-[120px]"
      />

      {/* Bottom Left Orb - Crimson */}
      <motion.div
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-crimson/10 rounded-full blur-[150px]"
      />

      {/* Center Orb - Gold */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -20, 30, 0],
          scale: [0.8, 1, 0.9, 0.8],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-gold/5 rounded-full blur-[100px]"
      />
    </div>
  );
};

export default AmbientBackground;
