"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HeartAnimation = () => {
  const correctWord = "LOVE";
  const [letters, setLetters] = useState(shuffleLetters(["L", "O", "V", "E"]));
  const [selected, setSelected] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [showCouple, setShowCouple] = useState(false);
  const [failed, setFailed] = useState(false);

  function shuffleLetters(arr: string[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  const handleSelect = (letter: string) => {
    if (selected.length >= 4) return;
    const newSelected = [...selected, letter];
    setSelected(newSelected);

    if (newSelected.length === 4) {
      const formedWord = newSelected.join("");
      if (formedWord === correctWord) {
        setTimeout(() => setShowButton(true), 500);
      } else {
        setFailed(true);
        setTimeout(() => {
          setFailed(false);
          setSelected([]);
          setLetters(shuffleLetters(["L", "O", "V", "E"]));
        }, 1200);
      }
    }
  };

  const handleRetry = () => {
    setSelected([]);
    setShowButton(false);
    setShowCouple(false);
    setLetters(shuffleLetters(["L", "O", "V", "E"]));
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-16">

      {!showCouple && (
        <>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-rose-700 mb-6 text-sm font-medium"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Susunlah huruf-huruf di bawah ini menjadi kata{" "}
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-bold text-rose-600 inline-block"
            >
              LOVE
            </motion.span>{" "}
            ❤️
            <br />
            untuk dapat melihat mempelai.
          </motion.p>

          <div className="flex gap-3 mb-8">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl text-3xl font-bold ${
                    selected[i]
                      ? "bg-rose-200 text-rose-700 border-rose-400"
                      : "border-gray-300 text-gray-400"
                  }`}
                  animate={{
                    scale: failed ? [1, 1.1, 0.9, 1.1, 1] : 1,
                  }}
                >
                  {selected[i] || "_"}
                </motion.div>
              ))}
          </div>

          <div className="flex gap-6">
            {letters.map((letter, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.9 }}
                disabled={selected.includes(letter)}
                onClick={() => handleSelect(letter)}
                className={`w-16 h-16 rounded-full text-2xl font-bold shadow-md border-2 transition ${
                  selected.includes(letter)
                    ? "bg-gray-200 text-gray-400 border-gray-300"
                    : "bg-white text-rose-600 border-rose-300 hover:bg-rose-50"
                }`}
              >
                {letter}
              </motion.button>
            ))}
          </div>

          {showButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => setShowCouple(true)}
              className="mt-10 bg-rose-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-rose-700 transition"
            >
              Yey, yuk lihat mempelai
            </motion.button>
          )}

          {failed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2 }}
              onClick={handleRetry}
              className="mt-8 bg-gray-300 text-gray-700 px-6 py-2 rounded-full shadow hover:bg-gray-400 transition"
            >
              Coba Lagi
            </motion.button>
          )}
        </>
      )}
      {showCouple && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">
              WEDDING COUPLE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mempelai
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8"></div>
            <p className="text-rose-800/70 max-w-2xl mx-auto leading-relaxed italic text-sm">
              &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
              untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
              dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa
              kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
              terdapat tanda-tanda bagi kaum yang berpikir.&quot; (QS. Ar-Rum:
              21)
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-12 mt-16">
          <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-rose-300/30 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative w-48 h-48 mx-auto rounded-full bg-white/70 backdrop-blur-sm border-2 border-amber-300/50 overflow-hidden shadow-xl flex items-center justify-center">
                  <Image
                    src="/images/alfi1.png"
                    alt="Pengantin Wanita"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <h3
                className="text-xl font-serif text-rose-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Alfi Magfiroh Effendy, S.Pd
              </h3>
              <p className="text-rose-700/60 text-sm tracking-wider">
                Putri Bungsu dari Bapak Rebiyono Efendi & Almh. Ibu Partini
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-300/30 to-amber-300/30 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative w-48 h-48 mx-auto rounded-full bg-white/70 backdrop-blur-sm border-2 border-rose-300/50 overflow-hidden shadow-xl flex items-center justify-center">
                  <Image
                    src="/images/adryan1.png"
                    alt="Pengantin Pria"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <h3
                className="text-xl font-serif text-rose-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Adryan, S.Kom
              </h3>
              <p className="text-rose-700/60 text-sm tracking-wider">
                Putra Kedua dari Alm. Bapak Anwar & Ibu Yerliyen
              </p>
            </motion.div>

            
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeartAnimation;
