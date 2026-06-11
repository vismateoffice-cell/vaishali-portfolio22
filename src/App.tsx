import React, { useState, useEffect } from "react";
import { Menu, X, Maximize2, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  experienceData,
  portfolioItems,
  doesItemMatchCategory,
} from "./data";
import { PortfolioItem } from "./types";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stickyNavbar, setStickyNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [portfolioFilter, setPortfolioFilter] = useState("");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const categoriesList = React.useMemo(() => {
    const unique = new Map<string, string>();
    portfolioItems.forEach((item) => unique.set(item.category, item.categoryName));
    return Array.from(unique.entries()).map(([tag, label]) => ({ tag, label }));
  }, []);

  useEffect(() => {
    if (categoriesList.length > 0 && portfolioFilter === "") {
      setPortfolioFilter(categoriesList[0].tag);
    }
  }, [categoriesList]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setStickyNavbar(window.scrollY > 60);
      const sections = ["home", "about", "resume", "portfolio"];
      const scrollPos = window.scrollY + 150;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="bg-[#0e0e10] text-white font-sans selection:bg-[#d4af37] selection:text-black min-h-screen">

      {/* ── Loader ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-[#0e0e10] z-[9999] flex flex-col justify-center items-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-3xl font-display font-black tracking-[0.3em] text-[#d4af37]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              VAISHALI
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >

        {/* ══════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════ */}
        <nav
          id="home"
          className={`w-full z-[1001] transition-all duration-300 ${
            stickyNavbar
              ? "fixed top-0 left-0 right-0 bg-[#0e0e10]/95 border-b border-zinc-800/60 py-4 px-6 md:px-12"
              : "absolute top-0 left-0 right-0 py-6 px-6 md:px-12"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="#home" onClick={(e) => handleNavClick(e, "home")} className="flex items-center space-x-2.5 select-none">
              <PenTool size={20} className="text-[#d4af37]" />
              <span className="text-lg font-display font-black tracking-wider">VAISHALI PATAT</span>
            </a>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-10">
              {["home", "about", "resume", "portfolio"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-[12px] font-mono uppercase tracking-[0.15em] transition-colors duration-200 ${
                    activeSection === item ? "text-[#d4af37]" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-6 pb-4 space-y-4 border-t border-zinc-800 mt-4">
                  {["home", "about", "resume", "portfolio"].map((item) => (
                    <a
                      key={item}
                      href={`#${item}`}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`block text-sm font-mono uppercase tracking-wider ${
                        activeSection === item ? "text-[#d4af37]" : "text-zinc-300"
                      }`}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
          {/* Decorative top line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 bg-zinc-800" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <p className="text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-6">
              Visual Designer & Freelancer
            </p>

            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.95] tracking-tight mb-8">
              Graphic
              <br />
              <span className="text-[#d4af37]">Designer</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-10">
              I'm Vaishali Patat — a freelance graphic designer crafting clean, meaningful visuals for brands that want to stand out.
            </p>

            <a
              href="#portfolio"
              onClick={(e) => handleNavClick(e, "portfolio")}
              className="inline-block px-8 py-3.5 bg-[#d4af37] text-black text-xs font-display font-bold uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300"
            >
              View Portfolio
            </a>
          </motion.div>

          {/* Decorative bottom line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-zinc-800" />
        </section>

        {/* ══════════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════════ */}
        <section id="about" className="py-24 md:py-32 border-t border-zinc-800/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6">

            {/* Section label */}
            <div className="flex items-center space-x-4 mb-16">
              <div className="w-8 h-px bg-[#d4af37]" />
              <span className="text-[#d4af37] text-[12px] font-mono uppercase tracking-[0.2em]">About Me</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              {/* Left — Heading */}
              <div className="md:col-span-5">
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-[42px] leading-[1.1] uppercase tracking-tight">
                  Creating
                  <br />
                  Meaningful
                  <br />
                  <span className="text-[#d4af37]">Visuals</span>
                </h2>
              </div>

              {/* Right — Body text */}
              <div className="md:col-span-7 space-y-6 text-zinc-300 text-[15px] leading-relaxed">
                <p>
                  I'm a freelance graphic designer who enjoys turning ideas into creative and meaningful designs. My journey started with UI/UX design, which helped me develop a strong eye for layout, balance, and user-focused thinking.
                </p>
                <p>
                  Today, I work on branding, social media creatives, posters, marketing materials, and other visual content that helps businesses stand out. I believe good design is not just about looking attractive—it's about communicating the right message in a simple and memorable way.
                </p>
                <p>
                  With every project, I aim to create designs that are clean, engaging, and tailored to each brand's unique identity.
                </p>

                {/* Tools row */}
                <div className="pt-6 border-t border-zinc-800/50 flex flex-wrap gap-3">
                  {["Photoshop", "Illustrator", "Figma", "Canva", "InDesign"].map((tool) => (
                    <span key={tool} className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-600 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            RESUME — Timeline style
        ══════════════════════════════════════════════ */}
        <section id="resume" className="py-24 md:py-32 border-t border-zinc-800/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6">

            {/* Section label */}
            <div className="flex items-center space-x-4 mb-16">
              <div className="w-8 h-px bg-[#d4af37]" />
              <span className="text-[#d4af37] text-[12px] font-mono uppercase tracking-[0.2em]">Resume</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              {/* Left — Description */}
              <div className="md:col-span-5">
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-[42px] leading-[1.1] uppercase tracking-tight mb-6">
                  Over 1 Year of
                  <br />
                  <span className="text-[#d4af37]">Creative</span>
                  <br />
                  Experience
                </h2>
                <p className="text-zinc-300 text-[15px] leading-relaxed mb-4">
                  My design journey began with UI/UX design, where I spent over a year learning how to create user-friendly and visually balanced digital experiences.
                </p>
                <p className="text-zinc-300 text-[15px] leading-relaxed">
                  Today, I work as a Freelance Graphic Designer, creating branding, social media creatives, marketing materials, posters, and other visual content that helps businesses communicate effectively and stand out.
                </p>
              </div>

              {/* Right — Timeline */}
              <div className="md:col-span-7">
                <div className="relative pl-8">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#d4af37] via-zinc-700 to-zinc-800" />

                  {experienceData.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      className="group relative py-8 first:pt-0 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-8 top-8 first:top-0 w-[15px] h-[15px] rounded-full border-[3px] border-[#d4af37] bg-[#0e0e10] group-hover:bg-[#d4af37] transition-colors duration-300 z-10" style={{ top: idx === 0 ? '0' : undefined }} />

                      {/* Content card */}
                      <div className="ml-4 p-5 border border-zinc-800/60 bg-zinc-900/30 hover:border-[#d4af37]/40 transition-all duration-300 rounded-sm">
                        <h4 className="text-white text-lg font-display font-bold group-hover:text-[#d4af37] transition-colors">
                          {exp.title}
                        </h4>
                        <span className="text-zinc-300 text-sm font-mono uppercase tracking-wider mt-2 block">
                          {exp.subTitle}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PORTFOLIO — Clean image showcase
        ══════════════════════════════════════════════ */}
        <section id="portfolio" className="py-24 md:py-32 border-t border-zinc-800/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6">

            {/* Section label */}
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-8 h-px bg-[#d4af37]" />
              <span className="text-[#d4af37] text-[12px] font-mono uppercase tracking-[0.2em]">Selected Work</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-[42px] leading-[1.1] uppercase tracking-tight mb-12">
              Creative <span className="text-[#d4af37]">Portfolio</span>
            </h2>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2.5 mb-12 pb-6 border-b border-zinc-800/50">
              {categoriesList.map((filt) => (
                <button
                  key={filt.tag}
                  onClick={() => setPortfolioFilter(filt.tag)}
                  className={`px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider transition-all duration-200 rounded-sm ${
                    portfolioFilter === filt.tag
                      ? "bg-[#d4af37] text-black font-bold"
                      : "text-zinc-200 hover:text-white border border-zinc-600 hover:border-[#d4af37] hover:bg-zinc-800/50"
                  }`}
                >
                  {filt.label}
                </button>
              ))}
            </div>

            {/* Grid — image-only showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems
                .filter((item) => doesItemMatchCategory(item, portfolioFilter))
                .map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setLightboxItem(item)}
                      className="group cursor-pointer relative overflow-hidden rounded-sm"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden bg-zinc-900">
                        <div className={`absolute inset-0 bg-zinc-900 animate-shimmer bg-[length:200%_100%] transition-opacity duration-500 z-10 ${loadedImages[item.id] ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
                        <img
                          src={item.image}
                          alt={item.title}
                          onLoad={() => setLoadedImages((p) => ({ ...p, [item.id]: true }))}
                          className={`w-full h-auto select-none pointer-events-none group-hover:scale-[1.05] transition-transform duration-500 ${loadedImages[item.id] ? "opacity-100" : "opacity-0"}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <div className="w-12 h-12 bg-[#d4af37] flex items-center justify-center text-black rounded-full">
                            <Maximize2 size={18} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            LIGHTBOX
        ══════════════════════════════════════════════ */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              className="fixed inset-0 bg-black/95 p-4 md:p-8 flex items-center justify-center z-[1100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 text-zinc-300 hover:text-white p-2"
                aria-label="Close"
              >
                <X size={22} />
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl max-h-[90vh] flex flex-col"
              >
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-auto max-h-[85vh] object-contain select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer className="py-16 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2.5">
              <PenTool size={16} className="text-[#d4af37]" />
              <span className="font-display font-black text-sm tracking-wider">VAISHALI PATAT</span>
            </div>
            <p className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
              © 2025 All Rights Reserved
            </p>
          </div>
        </footer>

      </motion.div>
    </div>
  );
}