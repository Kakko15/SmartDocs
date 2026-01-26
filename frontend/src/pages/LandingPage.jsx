import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThemeToggle from '../components/ui/ThemeToggle';

const LandingPage = ({ onEnter, isDark, toggleTheme }) => {
  const { scrollY } = useScroll();
  // Removed local isDark state

  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  // Dynamic shadow/bg logic inside render based on isDark/isScrolled

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };



  return (
    <div className={`relative min-h-screen w-full font-sans transition-colors duration-500 overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Background Decor */}
      <div className={`absolute inset-0 z-0 grid-bg pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-10' : 'opacity-40'}`} />
      
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 transition-colors duration-500 ${isDark ? 'bg-primary-900/20' : 'bg-primary-100/50'}`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 transition-colors duration-500 ${isDark ? 'bg-secondary-900/20' : 'bg-secondary-100/50'}`} />

      {/* --- HEADER NAVIGATION --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
              ? (isDark ? 'bg-slate-900/80 backdrop-blur-md shadow-sm py-3 border-b border-slate-800' : 'bg-white/80 backdrop-blur-md shadow-sm py-3') 
              : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-20 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
              <span className="font-display">SD</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold leading-none tracking-tight font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>SMART<span className="text-primary-600">DOCS</span></h1>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">ISU Echague Campus</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <a href="#" className="hover:text-primary-600 transition-colors">HOME</a>
            <a href="#features" className="hover:text-primary-600 transition-colors">FEATURES</a>
            <a href="#about" className="hover:text-primary-600 transition-colors">ABOUT ISUE</a>
            
            <div className="pl-4 border-l border-slate-200/20">
               <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            </div>
          </nav>

          {/* CTA Button */}
          <button 
            onClick={onEnter}
            className="hidden md:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold tracking-wide transition-all shadow-md hover:shadow-lg hover:shadow-primary-500/30 text-sm"
          >
            <span>STUDENT PORTAL</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </header>

      {/* --- MAIN HERO SECTION --- */}
      <main className="relative pt-32 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="w-full grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-left space-y-6 z-10"
          >
            <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wider ${isDark ? 'bg-secondary-900/30 border-secondary-800 text-secondary-400' : 'bg-secondary-100 border-secondary-200 text-secondary-700'}`}>
              <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse"></span>
              NEW VMGO ALIGNED SYSTEM
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className={`text-5xl md:text-7xl font-bold leading-[0.9] font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`${isDark ? 'text-slate-100' : 'text-[#0f172a]'} drop-shadow-sm transition-colors duration-500`}>DIGITAL</span> <br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r drop-shadow-sm transition-all duration-500 ${isDark ? 'from-primary-400 to-secondary-400' : 'from-primary-600 to-secondary-600'}`}>CLEARANCE</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className={`text-lg max-w-lg leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Experience the next generation of academic processing. Fast, paperless, and eco-friendly clearance management for the modern <span className="text-primary-600 font-bold">Smart-Green University</span>.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onEnter}
                className={`px-8 py-4 rounded-lg font-bold tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                ACCESS SYSTEM
                <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              
              <button className={`px-8 py-4 rounded-lg font-bold tracking-widest border-2 transition-all ${isDark ? 'border-slate-700 text-white hover:border-primary-500 hover:text-primary-400 bg-slate-900' : 'border-slate-200 hover:border-primary-500 hover:text-primary-600 text-slate-600 bg-white'}`}>
                LEARN MORE
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-8 opacity-80">
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>5k+</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider">STUDENTS</p>
              </div>
              <div className={`w-px h-10 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>24h</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider">PROCESSING</p>
              </div>
              <div className={`w-px h-10 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider">PAPERLESS</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual / Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full hidden md:block"
          >
            {/* Abstract Shapes */}
            <div className={`absolute top-10 right-10 w-3/4 h-3/4 bg-gradient-to-br rounded-2xl rotate-3 opacity-10 ${isDark ? 'from-primary-400 to-primary-600' : 'from-primary-500 to-primary-700'}`}></div>
            <div className={`absolute top-10 right-10 w-3/4 h-3/4 rounded-2xl p-6 flex flex-col gap-4 rotate-[-3deg] z-10 transition-all duration-500 ${isDark ? 'spatial-glass-dark' : 'spatial-glass'}`}>
               {/* Mock UI Card */}
               <div className={`flex justify-between items-center border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                   <div>
                     <div className={`w-32 h-3 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                     <div className={`w-20 h-2 rounded mt-2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                   </div>
                 </div>
                 <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">VERIFIED</div>
               </div>
               <div className="space-y-3">
                 <div className={`w-full h-2 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                 <div className={`w-5/6 h-2 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                 <div className={`w-4/6 h-2 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
               </div>
               <div className={`mt-auto rounded-xl p-4 border transition-colors duration-500 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">STATUS</span>
                    <span className="text-xs font-bold text-primary-600">COMPLETED</span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="bg-primary-500 w-full h-full"></div>
                  </div>
               </div>
            </div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ 
                y: [0, -15],
                rotate: [0, 1] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "easeInOut" 
              }}
              className={`absolute bottom-20 left-0 p-4 rounded-xl shadow-xl border z-20 flex items-center gap-3 transition-colors duration-500 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-secondary-200'}`}
            >
               <div className={`p-3 rounded-lg ${isDark ? 'bg-secondary-900/30 text-secondary-400' : 'bg-secondary-100 text-secondary-600'}`}>
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400">IMPACT</p>
                 <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>120 Trees Saved</p>
               </div>
            </motion.div>
          </motion.div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className={`border-t pt-16 pb-8 transition-colors duration-500 ${isDark ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'}`}>
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <div className="h-8 w-8 rounded bg-primary-600 flex items-center justify-center text-white font-bold text-sm">SD</div>
                 <span className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>SMARTDOCS</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                The official digital clearance system of Isabela State University - Echague Campus. 
                Dedicated to providing efficient, transparent, and eco-friendly academic services.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-400 ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 hover:bg-primary-100 hover:text-primary-600'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"/></svg>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`font-bold mb-6 font-display text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>QUICK LINKS</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Student Login</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Admin Portal</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">System Guide</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Report Issue</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-bold mb-6 font-display text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>CONTACT</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li className="flex items-start gap-3">
                   <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   <span>San Fabian, Echague,<br/>Isabela 3309</span>
                </li>
                <li className="flex items-center gap-3">
                   <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   <span>registrar@isu.edu.ph</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 tracking-wider">
            <p>&copy; 2026 ISABELA STATE UNIVERSITY. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600">PRIVACY POLICY</a>
              <a href="#" className="hover:text-slate-600">TERMS OF USE</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;