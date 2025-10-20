import React, { useState } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import Image from 'next/image';

interface CircularImageSliderProps {
  images: string[];
}

const CARD_WIDTH = 250;
const CARD_SPACING_FACTOR = 0.8; 
const ROTATION_DEGREE = 30; 
const Z_OFFSET_FACTOR = 150;
const SCALE_FACTOR = 0.1;

export default function CircularImageSlider({ images }: CircularImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -500) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (offset > 50 || velocity > 500) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
    x.set(0);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto h-80 flex items-center justify-center overflow-hidden">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: 1000 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.2}
      >
        {images.map((imagePath, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          const rotationY = offset * ROTATION_DEGREE;
          const translateX = offset * (CARD_WIDTH / 2 * CARD_SPACING_FACTOR);
          const translateZ = -absOffset * Z_OFFSET_FACTOR;
          const scale = 1 - absOffset * SCALE_FACTOR;
          const opacity = 1 - absOffset * 0.3;

          return (
            <motion.div
              key={imagePath}
              className="absolute w-64 h-80 rounded-2xl overflow-hidden shadow-xl border border-rose-300/50 bg-white/70 backdrop-blur-sm cursor-grab"
              style={{
                x: x,
                transformOrigin: 'center center',
                zIndex: images.length - absOffset,
              }}
              animate={{
                rotateY: rotationY,
                translateX: translateX,
                translateZ: translateZ,
                scale: scale,
                opacity: opacity,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 40 }} // Disesuaikan untuk transisi yang lebih smooth
            >
              <Image src={imagePath} alt={`Galeri Foto ${index + 1}`} fill style={{ objectFit: 'cover' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm">Foto {index + 1}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}