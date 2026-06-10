import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  experienceData,
  portfolioItems,
  doesItemMatchCategory,
} from "./data";
import { PortfolioItem } from "./types";

const categoryAspectRatios: Record<string, string> = {
  'e-commerce-modul-invigorate': 'aspect-[625/310]',
  'festival-post-2025': 'aspect-square',
  'hire-invigorate-services-page': 'aspect-[1920/400]',
  'linkedin-post': 'aspect-square',
  'mobile-e-commerce-modul-invigorate': 'aspect-square',
  'mobile-hire-invigorated-banner': 'aspect-[700/360]',
  'vaishali-linkedin-post': 'aspect-[1000/562]',
  'invigotared-site-banner': 'aspect-[1920/470]',
  'mobile-size-invigortaed-site-banner': 'aspect-[700/426]',
  'normal-page': 'aspect-[7680/1880]',
};

export default function App() {
  // --- States ---
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stickyNavbar, setStickyNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [portfolioFilter, setPortfolioFilter] = useState("");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Generate unique categories dynamically from portfolioItems
  const categoriesList = React.useMemo(() => {
    const unique = new Map<string, string>();
    portfolioItems.forEach((item) => {
      unique.set(item.category, item.categoryName);
    });
    return [
      ...Array.from(unique.entries()).map(([tag, label]) => ({ tag, label }))
    ];
  }, []);

  // Set default filter to first category
  useEffect(() => {
    if (categoriesList.length > 0 && portfolioFilter === "") {
      setPortfolioFilter(categoriesList[0].tag);
    }
  }, [categoriesList]);

  // Timer Ref for fakeLoader cloning
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sticky navbar tracking & ScrollSpy highlight
  useEffect(() => {
    const handleScroll = () => {
      // Sticky behavior
      if (window.scrollY > 100) {
        setStickyNavbar(true);
      } else {
        setStickyNavbar(false);
      }

      // Scroll spy logic
      const sections = ["home", "about", "resume", "portfolio"];
      const scrollPosition = window.scrollY + 120; // offset

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler mirroring main.js
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const topOffset = targetElement.offsetTop - 50;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
  };

  return (
    <div className="bg-[#212121] text-[#fafafa] font-sans selection:bg-[#ff8c05] selection:text-white min-h-screen relative overflow-x-hidden">
      
      {/* 1. Loader Mimicking fakeLoader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            id="loader"
            className="fixed inset-0 bg-[#212121] z-[9999] flex flex-col justify-center items-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Pulsing fading logo for premium feel */}
            <motion.div
              className="text-4xl font-black tracking-[0.3em] bg-gradient-to-r from-[#d61a5e] to-[#ff8c05] bg-clip-text text-transparent italic select-none"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              VAISHALI
            </motion.div>
            <p className="text-zinc-500 text-[10px] mt-4 uppercase tracking-[0.3em] font-mono select-none">
              Loading Experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Site Content Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={loading ? "pointer-events-none select-none" : ""}
      >
        {/* 2. Sticky Interactive Global Navbar */}
        <header className="w-full relative z-[1001]" id="home">
        <nav
          className={`navbar w-full transition-all duration-500 ease-in-out px-4 py-3 md:px-[40px] flex items-center justify-between ${
            stickyNavbar
              ? "fixed top-0 left-0 right-0 bg-[#262626] shadow-lg border-b border-zinc-800 m-0 py-4"
              : "absolute top-0 left-0 right-0 bg-transparent m-0 md:mt-[27px] px-4 md:px-[40px]"
          }`}
        >
          {/* Logo Brand with custom gradient */}
          <a
            href="#home"
            onClick={(e) => handleNavLinkClick(e, "home")}
            className="navbar-brand py-1 select-none"
          >
            <h2 className="text-2xl font-black font-sans leading-none tracking-wider bg-gradient-to-r from-[#d61a5e] to-[#ff8c05] bg-clip-text text-transparent italic hover:opacity-90 transition-opacity">
              VAISHALI
            </h2>
          </a>

          {/* Nav items for desktop */}
          <ul className="hidden lg:flex items-center space-x-1">
            {["home", "about", "resume", "portfolio"].map((item) => (
              <li key={item} className="nav-item">
                <a
                  href={`#${item}`}
                  onClick={(e) => handleNavLinkClick(e, item)}
                  className={`nav-link text-sm font-medium uppercase tracking-wider px-[14px] py-[6px] transition-all duration-300 relative inline-block ${
                    activeSection === item
                      ? "text-[#ff8c05] font-semibold"
                      : "text-white hover:text-[#ff8c05]"
                  }`}
                >
                  {item}
                  {activeSection === item && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-[14px] right-[14px] h-[2px] bg-[#ff8c05]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Toggle Menu button for mobile */}
          <button
            type="button"
            className="lg:hidden text-white bg-[#333] hover:bg-[#444] rounded p-2 focus:outline-none transition-colors border border-zinc-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown for mobile */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 bg-[#262626] border-b border-zinc-800 p-6 flex flex-col space-y-4 shadow-xl lg:hidden z-50 ml-0 mr-0"
              >
                {["home", "about", "resume", "portfolio"].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={(e) => handleNavLinkClick(e, item)}
                    className={`text-sm uppercase tracking-wider block py-2 border-b border-zinc-800 font-medium ${
                      activeSection === item ? "text-[#ff8c05]" : "text-white hover:text-[#ff8c05]"
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* 3. Hero Intro Grid Container */}
        <div className="pt-24 pb-8 md:pt-36 md:pb-16 flex items-center min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="bg-[#262626] rounded-md p-6 md:p-[40px] shadow-xl border border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              {/* Floating gradient orb accents */}
              <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-[#ff8c05]/5 rounded-full blur-[80px]" />
              <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-[#d61a5e]/5 rounded-full blur-[80px]" />

              {/* Caption details (Left) */}
              <div className="w-full md:w-[60%] flex flex-col items-start text-left relative z-10">
                <span className="text-xl md:text-2xl font-light tracking-widest text-[#fafafa] uppercase mb-4 animate-pulse">
                  I am Vaishali Patat
                </span>
                
                {/* Header text with background gradient fill */}
                <h2 className="text-4xl sm:text-5xl md:text-[70px] font-black leading-tight sm:leading-none tracking-tight mb-8 bg-gradient-to-r from-[#d61a5e] to-[#ff8c05] bg-clip-text text-transparent italic select-none">
                  Graphic Designer
                </h2>
                
                <button
                  onClick={(e) => handleNavLinkClick(e as any, "portfolio")}
                  className="px-6 py-3 bg-gradient-to-br from-[#ff8c05] to-[#d61a5e] hover:from-[#d61a5e] hover:to-[#ff8c05] text-[#fff] font-bold text-sm tracking-widest rounded uppercase cursor-pointer shadow-lg hover:shadow-[#ff8c05]/20 focus:outline-none focus:ring-2 focus:ring-[#ff8c05] border-none select-none transition-transform duration-300 active:scale-95"
                >
                  View Portfolio
                </button>
              </div>

              {/* Graphic Asset (Right) */}
              <div className="w-full md:w-[40%] flex justify-center scale-95 md:scale-100 hover:scale-[1.02] transition-transform duration-500">
                <div className="relative group p-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff8c05] to-[#d61a5e] rounded hover:blur-md opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src="https://raw.githubusercontent.com/vismateoffice-cell/vaishali-portfolio/main/images/intro-image.png"
                    alt="Intro Illustration"
                    className="w-full h-auto max-w-[320px] relative z-10 drop-shadow-xl select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. About Me Grid Panel */}
      <section id="about" className="py-12 md:py-16 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-[#262626] rounded-md shadow-xl overflow-hidden border border-zinc-900 grid grid-cols-1 lg:grid-cols-2">
            
            {/* Visual Block (Left) - Embedded high-fidelity visual matching design template style */}
            <div className="relative h-[250px] sm:h-[350px] lg:h-full min-h-[300px] flex items-center justify-center bg-zinc-900/50">
              <div className="absolute inset-0 z-0 bg-black/40"></div>
              {/* Exact about image */}
              <img
                src="https://raw.githubusercontent.com/vismateoffice-cell/vaishali-portfolio/main/images/about.png"
                alt="About Image"
                className="w-full h-full object-cover relative z-10 transition-transform duration-[4000ms] hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#ff8c05] to-[#d61a5e] px-3 py-1 text-xs uppercase font-bold tracking-widest rounded shadow">
                Est 2013
              </div>
            </div>

            {/* Description Text Side (Right) */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
              <div className="mb-6 flex flex-col space-y-2">
                <h3 className="text-[#ff8c05] text-lg font-bold uppercase tracking-widest">
                  About Me
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#ff8c05] to-[#d61a5e] rounded" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-white leading-tight mb-6 tracking-tight">
                I am a Graphic Designer
              </h2>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-light">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut doloremque ratione
                perferendis possimus voluptatibu distinctio autem expedita qui unde modi impedit
                officia illum praesentium amet, vero quos natus veritatis totam!
              </p>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                With a strong dedication to aesthetic clarity, minimalism, and composition rules,
                I translate abstract brand concepts into responsive visual structures. Exploring geometric grids, 
                high-contrast typography layouts, and clean vector visuals encapsulates my design philosophies.
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-8 text-xs font-mono uppercase tracking-wider text-gray-400">
                <div>
                  <span className="text-[#ff8c05] block font-bold">Role:</span> Full-Time Freelancer
                </div>
                <div>
                  <span className="text-[#ff8c05] block font-bold">Focus:</span> Brand & Product Design
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Resume (Experience Timeline Panel) */}
      <section id="resume" className="py-12 md:py-16 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-[#262626] rounded-md p-6 md:p-[40px] shadow-xl border border-zinc-900">
            
            {/* Header section */}
            <div className="text-center mb-10">
              <h3 className="text-[#ff8c05] text-2xl font-bold tracking-widest uppercase">
                My Resume
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-[#ff8c05] to-[#d61a5e] mx-auto mt-2 rounded" />
            </div>

            {/* Resume Content: Statically Rendered Experience Timeline */}
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
                
                {/* Left Column Description Detail Area */}
                <div className="flex flex-col items-start pr-0 md:pr-4">
                  <div className="title-resume">
                    <h3 className="text-[#ff8c05] text-lg sm:text-xl font-light tracking-wide uppercase mb-4 block">
                      Experience
                    </h3>
                    <h2 className="text-3xl sm:text-4xl md:text-[46px] leading-[1.1] font-black text-white">
                      More than 6 years experience as a <span className="text-[#ff8c05]">Designer</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-6 leading-relaxed">
                      I began my journey crafting print media layouts and translated my knowledge 
                      interactively into branding assets. Designing layouts based on standard structural systems 
                      allows me to convey solid visual logic for premium brands.
                    </p>
                  </div>
                </div>

                {/* Right Column: Experience Timeline List */}
                <div className="w-full pl-0 md:pl-4">
                  <div className="relative border-l border-zinc-700 pl-6 space-y-8 select-none">
                    {experienceData.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        {/* Glowing dot anchor */}
                        <div className="absolute top-2 left-[-31px] w-4.5 h-4.5 bg-[#212121] border border-white rounded-full group-hover:border-[#ff8c05] transition-colors" />
                        <h4 className="text-xl font-bold text-white group-hover:text-[#ff8c05] transition-colors mb-2">
                          {exp.title}
                        </h4>
                        <span className="text-zinc-400 text-xs font-mono uppercase tracking-wider block">
                          {exp.subTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Portfolio Module (Animated Filters, Layout, and Captions Overlay) */}
      <section id="portfolio" className="py-12 md:py-16 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-[#262626] rounded-md p-6 md:p-[40px] shadow-xl border border-zinc-900">
            
            {/* Sec Heading */}
            <div className="text-center mb-8">
              <h3 className="text-[#ff8c05] text-2xl font-bold tracking-widest uppercase mb-2">
                My Portfolio
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-[#ff8c05] to-[#d61a5e] mx-auto rounded" />
            </div>

            {/* Filter Menu buttons generated dynamically */}
            <div className="portfolio-filter-menu justify-center flex flex-wrap gap-2 sm:gap-6 mb-8 border-b border-zinc-800 pb-4 max-w-4xl mx-auto">
              {categoriesList.map((filt) => (
                <button
                  key={filt.tag}
                  type="button"
                  onClick={() => setPortfolioFilter(filt.tag)}
                  className={`relative px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors focus:outline-none ${
                    portfolioFilter === filt.tag ? "text-[#ff8c05]" : "text-white hover:text-[#ff8c05]"
                  }`}
                >
                  <span className="relative z-10">{filt.label}</span>
                  {portfolioFilter === filt.tag && (
                    <motion.div
                      layoutId="filterActive"
                      className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#ff8c05] z-0"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Portfolio Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems
                .filter((item) => doesItemMatchCategory(item, portfolioFilter))
                .map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onClick={() => setLightboxItem(item)}
                    className={`group relative cursor-pointer overflow-hidden rounded bg-[#181818] flex items-center justify-center border border-zinc-800/10 w-full ${categoryAspectRatios[item.category] || 'aspect-[4/3]'}`}
                  >
                    {/* Skeleton Shimmer Loader */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-[#181818] via-[#242424] to-[#181818] bg-[length:200%_100%] animate-shimmer transition-opacity duration-700 z-10 ${
                        loadedImages[item.id] ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    />

                    {/* Image asset with complete referral configurations */}
                    <img
                      src={item.image}
                      alt={item.title}
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [item.id]: true }))}
                      className={`w-full h-full object-contain block select-none pointer-events-none group-hover:scale-105 transition-all duration-700 ease-out z-0 ${
                        loadedImages[item.id] ? "opacity-100" : "opacity-0"
                      }`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Floating overlay mimicking magnific/style.css */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6 text-left">
                      
                      <div className="overflow-hidden">
                        <span className="text-[#ff8c05] font-semibold text-xs tracking-wider uppercase block transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          {item.subtitle}
                        </span>
                      </div>

                      <div className="overflow-hidden mt-1">
                        <h4 className="text-white text-lg font-bold tracking-tight transform translate-y-6 group-hover:translate-y-0 transition-all duration-300 delay-75">
                          {item.title}
                        </h4>
                      </div>

                      <div className="absolute top-4 right-4 bg-[#212121]/80 hover:bg-[#d61a5e] border border-zinc-700 hover:border-zinc-500 rounded p-2 transition-all shadow transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300">
                        <Plus size={16} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. Lightbox Popup Portal Overlay */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 bg-black/90 p-4 md:p-8 flex items-center justify-center z-[1100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors z-[1200]"
              aria-label="Close lightbox"
            >
              <X size={26} />
            </button>

            {/* Slider back indicator button */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center bg-[#262626] rounded border border-zinc-850 p-3 sm:p-5 shadow-2xl"
            >
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-auto max-h-[60vh] object-contain rounded select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="w-full mt-4 text-left px-1 sm:px-3">
                <span className="text-[#ff8c05] font-bold text-xs uppercase tracking-widest block mb-1">
                  {lightboxItem.subtitle}
                </span>
                <h3 className="text-white text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {lightboxItem.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-2 italic font-mono uppercase tracking-wider">
                  Category Tag: #{lightboxItem.categoryName}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. Footer Credits */}
      <footer className="py-8 border-t border-zinc-800 bg-[#262626]/20 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-[#fafafa]/50">
          <p>Copyright © All Rights Reserved</p>
          <p className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="font-bold bg-gradient-to-r from-[#d61a5e] to-[#ff8c05] bg-clip-text text-transparent italic">
              VAISHALI
            </span>
          </p>
        </div>
      </footer>

      </motion.div>
    </div>
  );
}