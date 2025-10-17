import React, { useState } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion'; // Import PanInfo
import Image from 'next/image';

interface CircularImageSliderProps {
  images: string[];
}

const CARD_WIDTH = 250; // Lebar perkiraan kartu
const CARD_SPACING_FACTOR = 0.8; // Faktor untuk jarak antar kartu
const ROTATION_DEGREE = 30; // Derajat rotasi untuk setiap kartu yang tidak aktif
const Z_OFFSET_FACTOR = 150; // Seberapa jauh kartu didorong ke belakang
const SCALE_FACTOR = 0.1; // Seberapa banyak kartu diskalakan

export default function CircularImageSlider({ images }: CircularImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0); // Motion value untuk drag

  // Berikan tipe yang lebih spesifik untuk event dan info
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Tentukan apakah harus pindah ke kartu berikutnya atau sebelumnya
    if (offset < -50 || velocity < -500) { // Geser ke kiri
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (offset > 50 || velocity > 500) { // Geser ke kanan
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
    x.set(0); // Reset posisi drag
  };

  return (
    <div className="relative w-full max-w-xl mx-auto h-80 flex items-center justify-center overflow-hidden">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: 1000 }} // Tambahkan perspektif untuk efek 3D
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.2}
      >
        {images.map((imagePath, index) => {
          // Hitung posisi dan rotasi untuk setiap kartu
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);

          // Logika penentuan posisi melingkar sederhana
          // Kartu aktif (offset 0) berada di depan dan tengah
          // Kartu di kiri/kanan berputar dan bergerak ke belakang
          const rotationY = offset * ROTATION_DEGREE;
          const translateX = offset * (CARD_WIDTH / 2 * CARD_SPACING_FACTOR); // Sesuaikan posisi horizontal
          const translateZ = -absOffset * Z_OFFSET_FACTOR; // Dorong kartu lebih jauh ke belakang
          const scale = 1 - absOffset * SCALE_FACTOR; // Skalakan kartu yang jauh
          const opacity = 1 - absOffset * 0.3; // Pudarkan kartu yang jauh

          return (
            <motion.div
              key={imagePath}
              className="absolute w-64 h-80 rounded-2xl overflow-hidden shadow-xl border border-rose-300/50 bg-white/70 backdrop-blur-sm cursor-grab"
              style={{
                x: x, // Terapkan motion value drag
                transformOrigin: 'center center',
                zIndex: images.length - absOffset, // Pastikan kartu aktif berada di atas
              }}
              animate={{
                rotateY: rotationY,
                translateX: translateX,
                translateZ: translateZ,
                scale: scale,
                opacity: opacity,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image src={imagePath} alt={`Galeri Foto ${index + 1}`} fill style={{ objectFit: 'cover' }} />
              {/* Overlay teks untuk setiap foto, bisa disesuaikan */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm">Foto {index + 1}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {/* Tombol navigasi (opsional) */}
      {/* <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md text-rose-600 hover:bg-rose-100 z-20"
      >
        &lt;
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md text-rose-600 hover:bg-rose-100 z-20"
      >
        &gt;
      </button> */}
    </div>
  );
}