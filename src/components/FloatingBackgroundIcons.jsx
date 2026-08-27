import { motion } from 'motion/react';
import { CustomIcon } from './CustomIcon';

export const FloatingBackgroundIcons = () => {
  const floatingItems = [
    // Left side items
    { icon: 'ball', top: '5%', left: '4%', size: 44, duration: 7, delay: 0 },
    { icon: 'bone', top: '18%', left: '16%', size: 48, duration: 8, delay: 1.2 },
    { icon: 'smiley', top: '32%', left: '6%', size: 42, duration: 7.5, delay: 0.8 },
    { icon: 'heart-illustration', top: '46%', left: '22%', size: 44, duration: 6, delay: 0.5 },
    { icon: 'star-filled', top: '60%', left: '5%', size: 40, duration: 8.4, delay: 1.5 },
    { icon: 'paw-illustration', top: '74%', left: '18%', size: 46, duration: 7.9, delay: 0.9 },
    { icon: 'smiley', top: '88%', left: '8%', size: 42, duration: 8.1, delay: 1.4 },

    // Middle items
    { icon: 'heart-illustration', top: '10%', left: '50%', size: 44, duration: 6.9, delay: 0.9 },
    { icon: 'star-filled', top: '30%', left: '45%', size: 40, duration: 7.2, delay: 1.1 },
    { icon: 'bone', top: '50%', left: '52%', size: 44, duration: 8.5, delay: 1.1 },
    { icon: 'smiley', top: '70%', left: '48%', size: 42, duration: 7.8, delay: 0.6 },
    { icon: 'paw-illustration', top: '90%', left: '52%', size: 44, duration: 8.1, delay: 0.7 },

    // Right side items
    { icon: 'paw-illustration', top: '8%', left: '88%', size: 46, duration: 7.9, delay: 0.9 },
    { icon: 'bone', top: '22%', left: '76%', size: 48, duration: 8, delay: 1.2 },
    { icon: 'smiley', top: '36%', left: '90%', size: 42, duration: 7.4, delay: 1.9 },
    { icon: 'ball', top: '50%', left: '78%', size: 40, duration: 7.2, delay: 0.4 },
    { icon: 'star-filled', top: '64%', left: '89%', size: 44, duration: 6.9, delay: 2.2 },
    { icon: 'heart-illustration', top: '78%', left: '75%', size: 46, duration: 8.5, delay: 0.8 },
    { icon: 'star-filled', top: '92%', left: '86%', size: 42, duration: 7.1, delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingItems.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          <CustomIcon
            name={item.icon}
            size={item.size}
            className="opacity-60 drop-shadow-[2px_4px_8px_rgba(15,92,148,0.15)]"
          />
        </motion.div>
      ))}
    </div>
  );
};
