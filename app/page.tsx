"use client";
import { useState, useEffect, useRef, useMemo } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '../utils/supabase'; 
import { useSearchParams } from 'next/navigation';
import { FaPlay, FaPause, FaHome, FaHeart, FaCalendarAlt, FaImages, FaGift, FaBaby, FaCopy, FaEnvelopeOpenText } from 'react-icons/fa'; 
import CircularImageSlider from '../components/CircularImageSlider'; 
import HeartAnimation from '../components/HeartAnimation';
import Image from 'next/image';

interface Submission {
  id: string; 
  name: string;
  status: string;
  message: string;
  date: string;
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  // const [guestName, setGuestName] = useState<string | null>(null); 
  // const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    status: "Hadir",
    message: ""
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]); 
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isFirstCardFlipped, setIsFirstCardFlipped] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isThirdCardFlipped, setIsThirdCardFlipped] = useState(false)

  const [firstAqiqahPhotoIndex, setFirstAqiqahPhotoIndex] = useState(0);
  const firstAqiqahPhotos = [
    { src: "/images/giska.png", alt: "Shaqueena Ghiska Abd. Ghany" },
    { src: "/images/ghafi.png", alt: "Atthallah Ghafi Abd. Ghany" },
  ];
  
  const [secondAqiqahPhotoIndex, setSecondAqiqahPhotoIndex] = useState(0);
  const secondAqiqahPhotos = [
    { src: "/images/nuha.png", alt: "Nuha Bilqis Ashauqi" },
    { src: "/images/azqiara_dinar.jpg", alt: "Azqyara Dinar Alzeena" },
  ];

  const [thirdAqiqahPhotoIndex, setThirdAqiqahPhotoIndex] = useState(0);
  const thirdAqiqahPhotos = [
    { src: "/images/sulthon.jpeg", alt: "Sultan Zavian Atharrazka" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5; 

  const [particlePositions, setParticlePositions] = useState<{ left: string; top: string }[]>([]);

  const targetDate = new Date('2025-12-28T09:00:00').getTime();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAccount(text);
      setTimeout(() => setCopiedAccount(null), 2000); // Reset status setelah 2 detik
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const sections = useMemo(() => [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "mempelai", label: "Mempelai", icon: <FaHeart /> },
    { id: "acara", label: "Acara", icon: <FaCalendarAlt /> },
    { id: "galeri", label: "Galeri", icon: <FaImages /> },
    { id: "kehadiran", icon: <FaEnvelopeOpenText /> },
    { id: "kado-online", icon: <FaGift /> },
  ], []);

  const galleryImages = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/6.png",
    "/images/8.png",
    "/images/12.png",
    "/images/14.png",
    "/images/edit-1.png",
    "/images/edit-2.png",
    "/images/gabungan1.png",
    "/images/gabungan2.png",
  ];

  useEffect(() => {
    const generateParticles = () => {
      const positions = Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }));
      setParticlePositions(positions);
    };

    if (typeof window !== 'undefined') {
      generateParticles();
    }
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        setIsCountingDown(false);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setCountdown(calculateTimeLeft());

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setCountdown(timeLeft);
      if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(timer);
        setIsCountingDown(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // useEffect(() => {
  //   const fetchGuest = async () => {
  //     const toSlug = searchParams.get('to');
  //     if (toSlug) {
  //       const { data, error } = await supabase
  //         .from('guests')
  //         .select('name')
  //         .eq('slug', toSlug)
  //         .single();

  //       if (error) {
  //         console.error('Error fetching guest:', error);
  //         setGuestName(null);
  //       } else if (data) {
  //         setGuestName(data.name);
  //       } else {
  //         setGuestName(null);
  //       }
  //     } else {
  //       setGuestName(null);
  //     }
  //   };

  //   fetchGuest();
  // }, [searchParams]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', JSON.stringify(error, null, 2));
      } else {
        const formattedData = data.map(item => ({
          id: item.id, 
          ...item,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setSubmissions(formattedData as Submission[]);
        setCurrentPage(1); 
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (opened && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Autoplay prevented:", error);
        
      });
    } else if (!opened && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [opened]);

   useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // Mengubah threshold menjadi 0.1 agar lebih sensitif
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);


    // Observe each section
    sections.forEach((s) => {
      const element = document.getElementById(s.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup function
    return () => {
      sections.forEach((s) => {
        const element = document.getElementById(s.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections]);

  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name.trim() && formData.message.trim()) {
      const newSubmission = {
        ...formData,
      };

      const { data, error } = await supabase
        .from('submissions')
        .insert([newSubmission]) // Mengubah 'newSubmissionData' menjadi 'newSubmission'
        .select();

      if (error) {
        console.error('Error inserting submission:', error);
        alert('Gagal mengirim ucapan. Silakan coba lagi.');
      } else {
        const insertedSubmission = data[0]; // Ambil data yang diinsert (asumsi hanya satu)
        const displaySubmission = {
          id: insertedSubmission.id, // Gunakan ID dari data yang diinsert
          ...formData,
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        // Tambahkan ucapan baru ke awal daftar
        setSubmissions([displaySubmission, ...submissions]);
        setFormData({ name: "", status: "Hadir", message: "" });
        setShowSubmissions(true);
        setCurrentPage(1); // Reset ke halaman pertama setelah ucapan baru dikirim
        alert('Ucapan berhasil dikirim!');
      }
    }
  };

  // Logika paginasi
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 min-h-screen relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl"></div>
      </div>

      
      <audio ref={audioRef} loop src="/sound/ariana_grande_stuck_with_u.mp3" />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
          key="opener"
          className="relative flex flex-col items-center justify-between min-h-screen px-6 py-16 bg-cover sm:bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/bg-pertama.png")' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          onClick={() => {
            setOpened(true);
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(error => {
                console.error("Autoplay prevented on section click:", error);
              });
            }
          }}
        >
          <div className="absolute inset-0"></div>

          {/* Top content */}
          <div className="relative z-10 text-center w-full">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              {/* <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-white text-xl sm:text-2xl font-medium"
              >
                Kepada Yth.
              </motion.p> */}
              
              {/* <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white text-xl sm:text-2xl font-medium"
              >
                {guestName || ""}
              </motion.p>

              <motion.p
                className="text-white tracking-[0.2em] text-sm font-light"
              >
                Diundang pada Acara
              </motion.p> */}

              <motion.h1
                className="text-3xl sm:text-6xl font-serif font-light text-white mt-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                The Wedding
              </motion.h1>

              <motion.h1
                className="text-4xl sm:text-6xl font-serif font-light text-white mt-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Alfi & Adryan
              </motion.h1>

              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-400/50"></div>
                <p className="text-white text-sm tracking-widest">28 Desember 2025</p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-400/50"></div>
              </div>
            </motion.div>
          </div>

          {/* Bottom content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="relative z-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(244, 63, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation(); 
                setOpened(true);
                if (audioRef.current) {
                  audioRef.current.play().then(() => {
                    setIsPlaying(true);
                  }).catch(error => {
                    console.error("Autoplay prevented on button click:", error);
                  });
                }
              }}
              className="group relative bg-rose-700/80 text-white rounded-full px-10 py-4 font-light tracking-wider shadow-2xl transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>✉️</span>
                <span>Buka Undangan</span>
              </span>
              <div className="absolute inset-0 bg-rose-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.button>
          </motion.div>
        </motion.section>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="pb-20"
          >
            <main className="relative z-10">
              <section
                id="home"
                className="min-h-screen flex items-center justify-center px-6 scroll-mt-16 relative overflow-hidden" // Hapus bg-cover, bg-center, tambahkan relative overflow-hidden
              >
                {/* Video Background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/images/video-background.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Overlay untuk membuat teks lebih mudah dibaca */}
                <div className="absolute inset-0"></div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-center relative z-10" // Tambahkan relative z-10 agar konten di atas video
                >
                  <p className="text-rose-600 tracking-[0.3em] text-xs mb-6">SAVE THE DATE</p>
                  <h1 className="text-4xl sm:text-6xl font-serif font-light mb-6 text-rose-800 bg-clip-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Alfi & Adryan
                  </h1>

                  {isCountingDown && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="flex justify-center gap-4 mb-12 mt-8"
                    >
                      <div className="bg-white/70 backdrop-blur-sm border border-rose-300/50 rounded-lg p-4 text-center shadow-md">
                        <p className="text-4xl font-bold text-rose-800">{countdown.days}</p>
                        <p className="text-xs text-rose-600 tracking-wider mt-1">HARI</p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm border border-rose-300/50 rounded-lg p-4 text-center shadow-md">
                        <p className="text-4xl font-bold text-rose-800">{countdown.hours}</p>
                        <p className="text-xs text-rose-600 tracking-wider mt-1">JAM</p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm border border-rose-300/50 rounded-lg p-4 text-center shadow-md">
                        <p className="text-4xl font-bold text-rose-800">{countdown.minutes}</p>
                        <p className="text-xs text-rose-600 tracking-wider mt-1">MENIT</p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm border border-rose-300/50 rounded-lg p-4 text-center shadow-md">
                        <p className="text-4xl font-bold text-rose-800">{countdown.seconds}</p>
                        <p className="text-xs text-rose-600 tracking-wider mt-1">DETIK</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400/50"></div>
                    <p className="text-rose-800 text-sm tracking-widest">Minggu, 28 Desember 2025</p>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400/50"></div>
                  </div>
                </motion.div>
              </section>

              <section id="mempelai" className="py-24 px-6 scroll-mt-16">
              <HeartAnimation />
              </section>

              <section
                id="acara"
                className="py-24 px-6 scroll-mt-16 bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/backgroud-simple.jpg")' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="text-center mb-16">
                    <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">WEDDING EVENT</p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Akad & Resepsi
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-300/20 to-amber-300/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-12 shadow-2xl">
                      <div className="text-center space-y-6">
                        <div className="inline-block p-4 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4">
                        <span className="text-3xl"><FaCalendarAlt /></span>
                        </div>

                        <div>
                          <p className="text-rose-600 text-lg tracking-widest mb-2">HARI & TANGGAL</p>
                          <p className="text-rose-900 text-lg font-light">Minggu, 28 Desember 2025</p> {/* Mengubah text-2xl menjadi text-xl */}
                        </div>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                        <div>
                          <p className="text-rose-600 text-lg tracking-widest mb-2">AKAD</p>
                          <p className="text-rose-900 text-lg font-light">09.00 WIB - Selesai</p> {/* Mengubah text-xl menjadi text-lg */}
                        </div>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                        <div>
                          <p className="text-rose-600 text-lg tracking-widest mb-2">RESEPSI</p>
                          <p className="text-rose-900 text-lg font-light">11.00 WIB - 16.00 WIB</p> {/* Mengubah text-xl menjadi text-lg */}
                        </div>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                        <div>
                          <p className="text-rose-600 text-lg tracking-widest mb-2">LOKASI</p>
                          <p className="text-rose-900 text-lg font-light">Jl. Iswahyudi RT. 10 Lrg. Mawar Kel. Pasir Putih Kota Jambi</p> {/* Mengubah text-xl menjadi text-lg */}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open('https://maps.app.goo.gl/tXjsXJshxtiBVcQaA', '_blank')}
                          className="mt-8 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-8 py-3 rounded-full text-sm tracking-wider hover:shadow-lg hover:shadow-rose-500/50 transition-all"
                        >
                          Lihat Lokasi
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto mt-16"
                >
                  <div className="text-center mb-16">
                    <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">AQIQAHAN EVENT</p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Walimatul Aqiqah
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>
                  </div>

                  <div className="relative perspective-1000">
                    <motion.div
                      className="relative w-full"
                      animate={{ rotateY: isFirstCardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Card */}
                      <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-12 shadow-2xl backface-hidden">
                        <div className="text-center space-y-6">
                          <div className="inline-block p-4 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4">
                            <span className="text-3xl"><FaBaby /></span>
                          </div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Anak Ke-4 & Ke-5</p>
                            <p className="text-rose-900 text-lg font-light">Shaqueena Ghiska Abd. Ghany</p>
                            <p className="text-rose-900 text-lg font-light">Dan</p>
                            <p className="text-rose-900 text-lg font-light">Atthallah Ghafi Abd. Ghany</p>
                          </div>

                          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Dari Orang Tua</p>
                            <p className="text-rose-900 text-lg font-light">H. Wahyudi, S.E & Nurul Lailatal Qodri</p>
                          </div>
                        </div>

                        {/* Peek Handle */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsFirstCardFlipped(!isFirstCardFlipped)}
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isFirstCardFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>

                      {/* Back Card (Photos) */}
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-6 shadow-2xl backface-hidden rotate-y-180">
                        <div className="relative w-full h-[390px] md:h-[420px] rounded-2xl overflow-hidden">
                          <Image
                            src={firstAqiqahPhotos[firstAqiqahPhotoIndex].src}
                            alt={firstAqiqahPhotos[firstAqiqahPhotoIndex].alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={false}
                          />

                          {/* Tombol Prev */}
                          <button
                            aria-label="Foto sebelumnya"
                            onClick={() =>
                              setFirstAqiqahPhotoIndex((prev) =>
                                prev === 0 ? firstAqiqahPhotos.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ‹
                          </button>

                          {/* Tombol Next */}
                          <button
                            aria-label="Foto berikutnya"
                            onClick={() =>
                              setFirstAqiqahPhotoIndex((prev) =>
                                (prev + 1) % firstAqiqahPhotos.length
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ›
                          </button>

                          {/* Nama anak + indikator */}
                          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/80 border border-rose-300/50 text-rose-800 text-xs">
                              {firstAqiqahPhotos[firstAqiqahPhotoIndex].alt}
                            </span>
                            <div className="flex gap-2">
                              {firstAqiqahPhotos.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setFirstAqiqahPhotoIndex(i)}
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    i === firstAqiqahPhotoIndex
                                      ? "bg-rose-500"
                                      : "bg-white/80 border border-rose-300/50"
                                  }`}
                                  aria-label={`Pilih foto ${i + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Close Handle (tetap sama) */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsFirstCardFlipped(!isFirstCardFlipped)}
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isFirstCardFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto mt-16"
                >
                  <div className="relative perspective-1000">
                    {/* Card Container */}
                    <motion.div
                      className="relative w-full"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Card (Info) */}
                      <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-12 shadow-2xl backface-hidden">
                        <div className="text-center space-y-6">
                          <div className="inline-block p-4 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4">
                            <span className="text-3xl"><FaBaby /></span>
                          </div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Anak Ke-2 & Ke-3</p>
                            <p className="text-rose-900 text-lg font-light">Nuha Bilqis Ashauqi</p>
                            <p className="text-rose-900 text-lg font-light">Dan</p>
                            <p className="text-rose-900 text-lg font-light">Azqyara Dinar Alzeena</p>
                          </div>

                          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Dari Orang Tua</p>
                            <p className="text-rose-900 text-lg font-light">Joko Adhari & Aisa Mai Effendy</p>
                          </div>
                        </div>

                        {/* Peek Handle */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsFlipped(!isFlipped)}
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>

                      {/* Back Card (Photos) */}
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-6 shadow-2xl backface-hidden rotate-y-180">
                        <div className="relative w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden">
                          <Image
                            src={secondAqiqahPhotos[secondAqiqahPhotoIndex].src}
                            alt={secondAqiqahPhotos[secondAqiqahPhotoIndex].alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={false}
                          />

                          {/* Tombol Prev */}
                          <button
                            aria-label="Foto sebelumnya"
                            onClick={() =>
                              setSecondAqiqahPhotoIndex((prev) =>
                                prev === 0 ? secondAqiqahPhotos.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ‹
                          </button>

                          {/* Tombol Next */}
                          <button
                            aria-label="Foto berikutnya"
                            onClick={() =>
                              setSecondAqiqahPhotoIndex((prev) =>
                                (prev + 1) % secondAqiqahPhotos.length
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ›
                          </button>

                          {/* Nama anak + indikator */}
                          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/80 border border-rose-300/50 text-rose-800 text-xs">
                              {secondAqiqahPhotos[secondAqiqahPhotoIndex].alt}
                            </span>
                            <div className="flex gap-2">
                              {secondAqiqahPhotos.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSecondAqiqahPhotoIndex(i)}
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    i === secondAqiqahPhotoIndex
                                      ? "bg-rose-500"
                                      : "bg-white/80 border border-rose-300/50"
                                  }`}
                                  aria-label={`Pilih foto ${i + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Close Handle (fix to use second card's flip state) */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsFlipped(!isFlipped)}
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto mt-16"
                >
                  <div className="relative perspective-1000">
                    {/* Card Container */}
                    <motion.div
                      className="relative w-full"
                      animate={{ rotateY: isThirdCardFlipped ? 180 : 0 }} // CHANGED: use isThirdCardFlipped
                      transition={{ duration: 0.6, type: "spring" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Card (Info) */}
                      <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-12 shadow-2xl backface-hidden">
                        <div className="text-center space-y-6">
                          <div className="inline-block p-4 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4">
                            <span className="text-3xl"><FaBaby /></span>
                          </div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Anak Pertama</p>
                            <p className="text-rose-900 text-lg font-light">Sultan Zavian Atharrazka</p>
                          </div>

                          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                          <div>
                            <p className="text-rose-600 text-lg tracking-widest mb-2">Dari Orang Tua</p>
                            <p className="text-rose-900 text-lg font-light">Jamaluki, S.E & Anisa Mai Effendy</p>
                          </div>
                        </div>

                        {/* Peek Handle */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsThirdCardFlipped(!isThirdCardFlipped)} // CHANGED
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isThirdCardFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>

                      {/* Back Card (Photos) */}
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-6 shadow-2xl backface-hidden rotate-y-180">
                        <div className="relative w-full h-[340px] md:h-[420px] rounded-2xl overflow-hidden">
                          <Image
                            src={thirdAqiqahPhotos[thirdAqiqahPhotoIndex].src} // CHANGED
                            alt={thirdAqiqahPhotos[thirdAqiqahPhotoIndex].alt} // CHANGED
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={false}
                          />

                          {/* Tombol Prev */}
                          {/* <button
                            aria-label="Foto sebelumnya"
                            onClick={() =>
                              setThirdAqiqahPhotoIndex((prev) =>
                                prev === 0 ? thirdAqiqahPhotos.length - 1 : prev - 1 // CHANGED
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ‹
                          </button> */}

                          {/* Tombol Next */}
                          {/* <button
                            aria-label="Foto berikutnya"
                            onClick={() =>
                              setThirdAqiqahPhotoIndex((prev) =>
                                (prev + 1) % thirdAqiqahPhotos.length // CHANGED
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-rose-300/50 text-rose-700 hover:text-rose-900 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                          >
                            ›
                          </button> */}

                          {/* Nama anak + indikator */}
                          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/80 border border-rose-300/50 text-rose-800 text-xs">
                              {thirdAqiqahPhotos[thirdAqiqahPhotoIndex].alt} {/* CHANGED */}
                            </span>
                            <div className="flex gap-2">
                              {thirdAqiqahPhotos.map((_, i) => (  // CHANGED
                                <button
                                  key={i}
                                  onClick={() => setThirdAqiqahPhotoIndex(i)} // CHANGED
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    i === thirdAqiqahPhotoIndex
                                      ? "bg-rose-500"
                                      : "bg-white/80 border border-rose-300/50"
                                  }`}
                                  aria-label={`Pilih foto ${i + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Close Handle */}
                        <motion.button
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-48 bg-gradient-to-r from-rose-300 to-amber-300 rounded-r-xl cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setIsThirdCardFlipped(!isThirdCardFlipped)} // CHANGED
                        >
                          <div className="text-rose-800 text-xs flex flex-col items-center justify-center h-full space-y-0.5">
                            {isThirdCardFlipped ? (
                              <>
                                {'TUTUP'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            ) : (
                              <>
                                {'LIHAT'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                                <span className="my-0.2">•</span>
                                {'FOTO'.split('').map((letter, i) => (
                                  <span key={i} className="leading-tight">{letter}</span>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              <section id="galeri" className="py-24 px-6 scroll-mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-6xl mx-auto"
                >
                  <div className="text-center mb-16">
                    <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">MEMORIES</p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Galeri
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>
                  </div>
                  <CircularImageSlider images={galleryImages} />

                </motion.div>
              </section>

              <section id="kehadiran" className="py-24 px-6 scroll-mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="text-center mb-16">
                    <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">RSVP</p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Konfirmasi Kehadiran
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8"></div>
                    <p className="text-rose-800/70 max-w-2xl mx-auto leading-relaxed text-sm">
                      Mohon konfirmasi kehadiran Anda dan kirimkan doa terbaik untuk kedua mempelai
                    </p>
                  </div>

                  
                  <div className="relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-300/20 to-amber-300/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-8 shadow-2xl">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                          <label className="block text-rose-900 text-sm font-medium mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/70 border border-rose-300/50 rounded-2xl px-4 py-3 text-rose-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all placeholder-rose-400/50"
                            placeholder="Masukkan nama Anda"
                            required
                          />
                        </div>


                        <div>
                          <label className="block text-rose-900 text-sm font-medium mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Status Kehadiran
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full bg-white/70 border border-rose-300/50 rounded-2xl px-4 py-3 text-rose-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all cursor-pointer"
                          >
                            <option value="Hadir">✅ Hadir</option>
                            <option value="Tidak Hadir">❌ Tidak Hadir</option>
                            <option value="Masih Ragu">🤔 Masih Ragu</option>
                          </select>
                        </div>

                        
                        <div>
                          <label className="block text-rose-900 text-sm font-medium mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Ucapan & Doa
                          </label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-white/70 border border-rose-300/50 rounded-2xl px-4 py-3 text-rose-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all placeholder-rose-400/50 resize-none"
                            placeholder="Tulis ucapan dan doa terbaik Anda..."
                            rows={4}
                            required
                          />
                        </div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-4 rounded-full hover:shadow-lg hover:shadow-rose-500/50 transition-all tracking-wider font-medium"
                        >
                          Kirim Ucapan dan Doa
                        </motion.button>
                      </form>
                    </div>
                  </div>

                  
                  {submissions.length > 0 && (
                    <div className="text-center mb-6">
                      <button
                        onClick={() => setShowSubmissions(!showSubmissions)}
                        className="text-rose-600 hover:text-rose-700 text-sm tracking-wide underline"
                      >
                        {showSubmissions ? "Sembunyikan" : "Lihat"} Ucapan ({submissions.length})
                      </button>
                    </div>
                  )}

                  
                  <AnimatePresence>
                    {showSubmissions && submissions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {currentSubmissions.map((sub, index) => ( // <-- Digunakan di sini
                          <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-2xl p-6 shadow-lg"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-rose-900 font-semibold text-lg">{sub.name}</h4>
                                <p className="text-rose-600 text-xs mt-1">{sub.date}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                sub.status === "Hadir"
                                  ? "bg-green-100 text-green-700"
                                  : sub.status === "Tidak Hadir"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                            <p className="text-rose-800/80 leading-relaxed">{sub.message}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pagination Controls */}
                  {showSubmissions && submissions.length > submissionsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-300/50 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`px-4 py-2 rounded-full ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                              : "bg-white/70 backdrop-blur-sm border border-rose-300/50 text-rose-600 hover:bg-rose-50"
                          } transition-all`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-300/50 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </motion.div>
              </section>
              <section id="kado-online" className="py-24 px-6 scroll-mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="text-center mb-16">
                    <p className="text-rose-600 tracking-[0.3em] text-xs mb-4">KADO ONLINE</p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-light text-rose-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Amplop Digital
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8"></div>
                    <p className="text-rose-800/70 max-w-2xl mx-auto leading-relaxed text-sm">
                      Bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih, dapat melalui rekening di bawah ini:
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-300/20 to-amber-300/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-rose-300/50 rounded-3xl p-12 shadow-2xl">
                      <div className="space-y-8">
                        {/* Bank Jambi */}
                        <div className="text-center">
                          <p className="text-rose-600 text-xs tracking-widest mb-2">BANK JAMBI</p>
                          <p className="text-rose-900 text-xl font-medium mb-2">70011829728</p>
                          <p className="text-rose-800/70 text-sm mb-4">a/n Alfi Magfiroh Effendy</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard("70011829728")}
                            className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-2 rounded-full text-sm tracking-wider hover:shadow-lg hover:shadow-rose-500/50 transition-all flex items-center justify-center mx-auto gap-2"
                          >
                            <FaCopy /> {copiedAccount === "70011829728" ? "Disalin!" : "Salin No. Rekening"}
                          </motion.button>
                        </div>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto"></div>

                        {/* Dana */}
                        <div className="text-center">
                          <p className="text-rose-600 text-xs tracking-widest mb-2">DANA</p>
                          <p className="text-rose-900 text-xl font-medium mb-2">083172675529</p>
                          <p className="text-rose-800/70 text-sm mb-4">a/n Alfi Magfiroh Effendy</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard("083172675529")}
                            className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-2 rounded-full text-sm tracking-wider hover:shadow-lg hover:shadow-rose-500/50 transition-all flex items-center justify-center mx-auto gap-2"
                          >
                            <FaCopy /> {copiedAccount === "083172675529" ? "Disalin!" : "Salin No. Telepon"}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              
              <footer className="py-12 text-center">
                <div className="text-rose-600/60 text-xs tracking-widest mb-4">Terima Kasih</div>
                <p className="text-rose-700/50 text-sm">الحمدلله جزاكم الله خيرا</p>
                <p className="text-rose-700/50 text-sm">Atas kehadiran dan doa restu Anda</p>
                <p className="text-rose-700/50 text-sm mt-1">Kami yang berbahagia, Alfi & Adryan</p>
              </footer>
            </main>

            
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-white/90 backdrop-blur-xl border border-rose-300/50 rounded-full px-4 py-3 shadow-2xl">
                <div className="flex gap-2">
                  {sections.map((s) => (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveSection(s.id);
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all ${ // Mengubah w-14 h-14 menjadi w-12 h-12
                        activeSection === s.id
                          ? "bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/50"
                          : "text-rose-400/60 hover:text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span> {/* Mengubah text-xl menjadi text-lg */}
                    </motion.button>
                  ))}
                </div>
              </div>
            </nav>
            <motion.button
              key="audio-control"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              onClick={toggleAudio}
              className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-xl border border-rose-300/50 rounded-full w-10 h-10 flex items-center justify-center shadow-2xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-all"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
