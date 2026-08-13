import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Landing = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const marqueeRef = useRef(null);
  const termBodyRef = useRef(null);
  const timelineRef = useRef(null);
  const timelineFillRef = useRef(null);
  const glowRef = useRef(null);

  // Check screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);
  }, []);

  // Handle hash navigation on page load (for external deep links)
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash;
      const target = document.querySelector(targetId);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    }
  }, []);

  // Cursor glow effect (desktop only)
  useEffect(() => {
    if (!reduceMotion && glowRef.current && !isMobile) {
      const glow = glowRef.current;
      const handleMouseMove = (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      };
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [reduceMotion, isMobile]);

  // Scroll reveal
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('in');
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  // Counters
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = parseInt(el.dataset.count, 10);
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 30));
          const tick = () => {
            cur = Math.min(target, cur + step);
            el.textContent = cur;
            if (cur < target) requestAnimationFrame(tick);
          };
          if (reduceMotion) {
            el.textContent = target;
          } else {
            tick();
          }
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObs.observe(el));
    return () => counterObs.disconnect();
  }, [reduceMotion]);

  // Timeline fill
  useEffect(() => {
    const steps = document.querySelectorAll('[data-step]');
    const fill = timelineFillRef.current;
    const timelineObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('in');
        });
        const inCount = document.querySelectorAll('[data-step].in').length;
        if (fill) {
          fill.style.height = (inCount / steps.length * 100) + '%';
        }
      },
      { threshold: 0.4 }
    );
    steps.forEach((el) => timelineObs.observe(el));
    return () => timelineObs.disconnect();
  }, []);

  // Marquee content
  useEffect(() => {
    const tools = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Runway', 'ElevenLabs', 'Perplexity', 'Cursor',
      'DeepSeek', 'Veo', 'Suno', 'Figma AI', 'v0', 'Kling', 'DeepL'
    ];
    if (marqueeRef.current) {
      marqueeRef.current.innerHTML = [...tools, ...tools]
        .map(
          (t) =>
            `<span class="font-['Space_Grotesk'] text-base font-semibold text-[#5c6070] whitespace-nowrap hover:text-[#2dd4ff] transition-colors">${t}</span>`
        )
        .join('');
    }
  }, []);

  // Terminal typing
  useEffect(() => {
    const examples = [
      { prompt: 'write a blog post about our launch', tool: 'Claude — writing & reasoning' },
      { prompt: 'generate a 30-second product demo', tool: 'Veo — cinematic video' },
      { prompt: 'build a landing page mockup', tool: 'v0 — UI generation' },
      { prompt: 'clean up this expense spreadsheet', tool: 'Julius AI — data analysis' },
      { prompt: 'voice a narration in Tamil', tool: 'Sarvam AI — Indian-language voice' }
    ];

    const termBody = termBodyRef.current;
    if (!termBody) return;

    const typeLine = (text, el, speed) => {
      return new Promise((resolve) => {
        let i = 0;
        const t = setInterval(() => {
          el.textContent = text.slice(0, i) + '';
          i++;
          if (i > text.length) {
            clearInterval(t);
            resolve();
          }
        }, speed);
      });
    };

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const runTerminal = async () => {
      let idx = 0;
      while (true) {
        const ex = examples[idx % examples.length];
        termBody.innerHTML = `
          <div class="term-line flex gap-2 mb-2.5 items-start">
            <span class="text-[#2dd4ff] flex-shrink-0">&gt;</span>
            <span class="text-[#eef0f5]" id="typedText"></span>
            <span class="term-cursor"></span>
          </div>
        `;
        const typedEl = document.getElementById('typedText');
        if (reduceMotion) {
          typedEl.textContent = ex.prompt;
        } else {
          await typeLine(ex.prompt, typedEl, 32);
        }
        await wait(350);
        termBody.innerHTML += `<div class="text-[#5c6070] mb-1.5 pl-5">routing…</div>`;
        await wait(reduceMotion ? 0 : 550);
        termBody.innerHTML += `
          <div class="flex items-center gap-2 pl-5 text-[#4fd18b]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#4fd18b] flex-shrink-0"></span>
            ${ex.tool}
          </div>
        `;
        await wait(reduceMotion ? 800 : 2200);
        idx++;
        if (reduceMotion) break;
      }
    };
    runTerminal();
  }, [reduceMotion]);

  // Magnetic buttons (desktop only)
  useEffect(() => {
    if (!reduceMotion && !isMobile) {
      document.querySelectorAll('[data-magnetic]').forEach((btn) => {
        const handleMouseMove = (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.25;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        };
        const handleMouseLeave = () => {
          btn.style.transform = 'translate(0,0)';
        };
        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
        return () => {
          btn.removeEventListener('mousemove', handleMouseMove);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }
  }, [reduceMotion, isMobile]);

  // Tilt cards (desktop only)
  useEffect(() => {
    if (!reduceMotion && !isMobile) {
      document.querySelectorAll('.tilt-card').forEach((card) => {
        const handleMouseMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-2px)`;
        };
        const handleMouseLeave = () => {
          card.style.transform = 'none';
        };
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }
  }, [reduceMotion, isMobile]);

  // Smooth scroll handler
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    setLoading(false);

    if (!result.success) {
      setError(result.message);
    } else {
      setShowModal(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="bg-[#030304] overflow-x-hidden">
      {/* Glow - desktop only */}
      {!isMobile && (
        <div id="glow" ref={glowRef} className="fixed w-[520px] h-[520px] rounded-full pointer-events-none z-0 bg-radial-gradient from-[#2dd4ff]/10 to-transparent/65 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-[30%] transition-opacity duration-300"></div>
      )}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#2dd4ff] opacity-[0.04] top-[-15%] left-[-10%] blur-[100px] animate-pulse hidden md:block"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#e94ec4] opacity-[0.04] bottom-[-15%] right-[-10%] blur-[100px] animate-pulse delay-1000 hidden md:block"></div>
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-4 md:px-6">
        
        {/* Navbar */}
        <nav className="flex-shrink-0 flex justify-between items-center py-3 md:py-4 border-b border-[#17171f]">
          <img src="/septexa-logo.png" alt="Septexa" className="h-8 md:h-12 w-auto" />
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-[11px] md:text-sm bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] hover:brightness-110 transition-all whitespace-nowrap"
            >
              {isMobile ? 'Get started' : 'Get started'}
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {/* HERO */}
          <section className="relative z-10 py-10 md:py-16 lg:py-24 px-0" id="hero">
            <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-center">
              <div>
                <div className="eyebrow font-['JetBrains_Mono'] text-[10px] md:text-[11.5px] tracking-[1.5px] md:tracking-[2px] uppercase text-[#5c6070] flex items-center gap-2 md:gap-2.5 mb-3 md:mb-4 reveal">
                  <span className="w-4 md:w-5 h-px bg-[#2dd4ff]"></span>LIVE AI ROUTING
                </div>
                <h1 className="reveal font-['Space_Grotesk'] font-bold text-[clamp(26px,6vw,34px)] md:text-[clamp(32px,4.6vw,54px)] leading-[1.1] md:leading-[1.08] tracking-[-0.5px] md:tracking-[-1px] mb-3 md:mb-5">
                  Your next AI task<br />is already <span className="brand-gradient-text">routed.</span>
                </h1>
                <p className="sub text-[#9297a6] text-sm md:text-base leading-relaxed max-w-[480px] mb-6 md:mb-8 reveal">
                  Type what you need. Septexa matches it to the right model across chat, code, image, video, and voice — with pricing up front, before you commit a single token.
                </p>
                <div className="hero-cta flex gap-2 md:gap-3 flex-wrap mb-6 md:mb-10 reveal">
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary magnetic px-4 md:px-6 py-2 md:py-3 text-[11px] md:text-sm font-['Inter'] font-bold rounded-lg bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] hover:brightness-110 transition-all"
                    data-magnetic
                  >
                    Get started free
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, '#channels')}
                    className="btn btn-ghost px-4 md:px-6 py-2 md:py-3 text-[11px] md:text-sm font-['Inter'] font-bold rounded-lg border border-[#232330] text-[#eef0f5] hover:border-[#2dd4ff] hover:text-[#2dd4ff] transition-all cursor-pointer bg-transparent"
                  >
                    See all channels
                  </button>
                </div>
                <div className="stat-row flex gap-4 md:gap-9 reveal">
                  <div className="stat">
                    <b className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold block" data-count="78">0</b>
                    <span className="font-['JetBrains_Mono'] text-[9px] md:text-[10.5px] text-[#5c6070] uppercase tracking-[0.5px]">Tools</span>
                  </div>
                  <div className="stat">
                    <b className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold block" data-count="12">0</b>
                    <span className="font-['JetBrains_Mono'] text-[9px] md:text-[10.5px] text-[#5c6070] uppercase tracking-[0.5px]">Channels</span>
                  </div>
                  <div className="stat">
                    <b className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold block" data-count="1">0</b>
                    <span className="font-['JetBrains_Mono'] text-[9px] md:text-[10.5px] text-[#5c6070] uppercase tracking-[0.5px]">Address</span>
                  </div>
                </div>
              </div>

              {/* Terminal - hidden on mobile, shown on tablet/desktop */}
              <div className="hidden md:block terminal bg-[#0d0d11] border border-[#17171f] rounded-2xl overflow-hidden shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] reveal">
                <div className="term-head flex items-center gap-2 px-4 py-3 border-b border-[#17171f] bg-[#141419]">
                  <div className="dot w-2.5 h-2.5 rounded-full bg-[#fb5d78]"></div>
                  <div className="dot w-2.5 h-2.5 rounded-full bg-[#e8c34d]"></div>
                  <div className="dot w-2.5 h-2.5 rounded-full bg-[#4fd18b]"></div>
                  <span className="ml-2 font-['JetBrains_Mono'] text-[11.5px] text-[#5c6070]">septexa · router</span>
                </div>
                <div className="term-body p-5 min-h-[220px] font-['JetBrains_Mono'] text-sm" ref={termBodyRef}></div>
              </div>

              {/* Mobile Terminal Preview */}
              {isMobile && (
                <div className="terminal bg-[#0d0d11] border border-[#17171f] rounded-xl overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] reveal">
                  <div className="term-head flex items-center gap-2 px-3 py-2 border-b border-[#17171f] bg-[#141419]">
                    <div className="dot w-2 h-2 rounded-full bg-[#fb5d78]"></div>
                    <div className="dot w-2 h-2 rounded-full bg-[#e8c34d]"></div>
                    <div className="dot w-2 h-2 rounded-full bg-[#4fd18b]"></div>
                    <span className="ml-1 font-['JetBrains_Mono'] text-[9px] text-[#5c6070]">septexa · router</span>
                  </div>
                  <div className="term-body p-3 min-h-[120px] font-['JetBrains_Mono'] text-[11px]" ref={termBodyRef}></div>
                </div>
              )}
            </div>
          </section>

          {/* MARQUEE */}
          <div className="border-t border-b border-[#17171f] overflow-hidden py-3 md:py-5 relative z-10">
            <div className="marquee-track flex gap-6 md:gap-11 w-max animate-marquee" ref={marqueeRef}></div>
          </div>

          {/* WHY SEPTEXA */}
          <section className="py-12 md:py-28 px-0 relative">
            <div className="max-w-[1180px] mx-auto">
              <h2 className="font-['Space_Grotesk'] font-bold text-[clamp(20px,4vw,26px)] md:text-[clamp(24px,3.2vw,34px)] text-center mb-3 md:mb-4">Built to get out of the way.</h2>
              <p className="text-center text-[#9297a6] text-xs md:text-sm max-w-[460px] mx-auto mb-8 md:mb-14">No fluff. No lock-in. Just a clean path from idea to the right AI tool.</p>
              
              <div className="why-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Card 1 - Pricing */}
                <div className="tilt-card group relative bg-[#0d0d11] border border-[#17171f] rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:border-[#2dd4ff]/20 hover:shadow-[0_0_40px_rgba(45,212,255,0.02)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#2dd4ff]/10 to-[#2dd4ff]/5 border border-[#2dd4ff]/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#2dd4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base md:text-lg font-semibold mb-1.5 md:mb-2.5 text-white">Pricing up front</h3>
                    <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed">Every tool shows real cost before you open it — no surprise bills.</p>
                    <div className="mt-3 md:mt-4 flex items-center gap-2 text-[#2dd4ff] text-[9px] md:text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Know before you click</span>
                      <svg className="w-2 h-2 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 2 - No Lock-in */}
                <div className="tilt-card group relative bg-[#0d0d11] border border-[#17171f] rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:border-[#8b5cf6]/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.02)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-[#8b5cf6] via-[#e94ec4] to-[#fb5d78] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 border border-[#8b5cf6]/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base md:text-lg font-semibold mb-1.5 md:mb-2.5 text-white">No lock-in</h3>
                    <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed">Septexa links straight to the real tool. No wrapper, no proxy, no rebranded API.</p>
                    <div className="mt-3 md:mt-4 flex items-center gap-2 text-[#8b5cf6] text-[9px] md:text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Your tools, your control</span>
                      <svg className="w-2 h-2 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 3 - One Address */}
                <div className="tilt-card group relative bg-[#0d0d11] border border-[#17171f] rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:border-[#e94ec4]/20 hover:shadow-[0_0_40px_rgba(233,78,196,0.02)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-[#e94ec4] via-[#fb5d78] to-[#f0b84d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#e94ec4]/10 to-[#e94ec4]/5 border border-[#e94ec4]/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#e94ec4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base md:text-lg font-semibold mb-1.5 md:mb-2.5 text-white">One address</h3>
                    <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed">Stop bookmarking a dozen AI sites. Search once, land on the right one, every time.</p>
                    <div className="mt-3 md:mt-4 flex items-center gap-2 text-[#e94ec4] text-[9px] md:text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Your AI starting point</span>
                      <svg className="w-2 h-2 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8 md:mt-12">
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#2dd4ff]/30 to-transparent"></div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" className="py-12 md:py-28 px-0 border-t border-[#17171f] bg-[#0d0d11]">
            <div className="max-w-[1180px] mx-auto">
              <h2 className="font-['Space_Grotesk'] font-bold text-[clamp(20px,4vw,26px)] md:text-[clamp(24px,3.2vw,34px)] text-center mb-8 md:mb-[70px]">Three steps. No new tabs.</h2>
              <div className="timeline max-w-[640px] mx-auto relative pl-8 md:pl-10" ref={timelineRef}>
                <div className="timeline-fill absolute left-[9px] md:left-[11px] top-1.5 w-0.5 bg-gradient-to-b from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] h-0 transition-all duration-[1.2s] ease-in-out" ref={timelineFillRef}></div>
                <div className="t-step relative pb-10 md:pb-14 last:pb-0" data-step>
                  <div className="t-dot absolute -left-8 md:-left-10 top-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0d0d11] border-2 border-[#232330] flex items-center justify-center font-['JetBrains_Mono'] text-[9px] md:text-[11px] font-bold text-[#5c6070] transition-all duration-400">1</div>
                  <h3 className="font-['Space_Grotesk'] text-[14px] md:text-[16.5px] font-semibold mb-1 md:mb-2">Tell it the task</h3>
                  <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed max-w-[440px]">Type what you actually need — "landing page mockup," "invoice PDF," "30-second product demo."</p>
                </div>
                <div className="t-step relative pb-10 md:pb-14 last:pb-0" data-step>
                  <div className="t-dot absolute -left-8 md:-left-10 top-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0d0d11] border-2 border-[#232330] flex items-center justify-center font-['JetBrains_Mono'] text-[9px] md:text-[11px] font-bold text-[#5c6070] transition-all duration-400">2</div>
                  <h3 className="font-['Space_Grotesk'] text-[14px] md:text-[16.5px] font-semibold mb-1 md:mb-2">Get the shortlist</h3>
                  <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed max-w-[440px]">Septexa matches it to the right channel and shows every real option, with live pricing side by side.</p>
                </div>
                <div className="t-step relative pb-0" data-step>
                  <div className="t-dot absolute -left-8 md:-left-10 top-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0d0d11] border-2 border-[#232330] flex items-center justify-center font-['JetBrains_Mono'] text-[9px] md:text-[11px] font-bold text-[#5c6070] transition-all duration-400">3</div>
                  <h3 className="font-['Space_Grotesk'] text-[14px] md:text-[16.5px] font-semibold mb-1 md:mb-2">Open and work</h3>
                  <p className="text-[#9297a6] text-xs md:text-sm leading-relaxed max-w-[440px]">Click through to the actual tool. No wrapper, no lock-in — just the fastest path there.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CHANNELS SECTION - FIXED WITH EMOJIS */}
          <section id="channels" className="py-12 md:py-28 px-0 relative bg-[#0a0a12]">
            <div className="max-w-[1180px] mx-auto px-4 md:px-0">
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-14">
                <div className="inline-block px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-[#2dd4ff]/4 border border-[#2dd4ff]/4 font-['JetBrains_Mono'] text-[9px] md:text-[10.5px] text-[#2dd4ff] tracking-[1px] md:tracking-[1.5px] uppercase mb-2 md:mb-3">
                  ✦ 12 channels
                </div>
                <h2 className="font-['Space_Grotesk'] font-bold text-[clamp(24px,5vw,30px)] md:text-[clamp(28px,3.6vw,40px)] text-[#eef0f5] tracking-[-0.3px] md:tracking-[-0.5px] leading-[1.1]">
                  Everything, <span className="brand-gradient-text">sorted.</span>
                </h2>
                <p className="text-[#5c6070] text-[11px] md:text-sm max-w-[460px] mx-auto mt-1 md:mt-2 leading-relaxed">
                  From daily chat to full video production — every task has a home.
                </p>
                <div className="w-[40px] md:w-[60px] h-0.5 bg-gradient-to-r from-[#2dd4ff] to-[#8b5cf6] rounded mx-auto mt-3 md:mt-4 opacity-30"></div>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 md:grid-cols-3 md:gap-[18px] lg:gap-5">
                {[
                  { name: 'Chat', desc: 'General & reasoning', icon: '💬', channel: 'C1' },
                  { name: 'Coding', desc: 'Agents & IDEs', icon: '⚙️', channel: 'C2' },
                  { name: 'App Builders', desc: 'Prompt to product', icon: '⚡', channel: 'C3' },
                  { name: 'UI / Design', desc: 'Mockups & sitemaps', icon: '🎨', channel: 'C4' },
                  { name: 'Image', desc: 'Generation & editing', icon: '🖼️', channel: 'C5' },
                  { name: 'Video', desc: 'Cinematic & social', icon: '🎬', channel: 'C6' },
                  { name: 'Voice / Audio', desc: 'TTS, STT & music', icon: '🎙️', channel: 'C7' },
                  { name: 'Documents', desc: 'Research & drafting', icon: '📄', channel: 'C8' },
                  { name: 'Data', desc: 'Analysis & decks', icon: '📊', channel: 'C9' },
                  { name: 'Translation', desc: 'Every language pair', icon: '🌐', channel: 'C10' },
                  { name: 'Automation', desc: 'Agents & workflows', icon: '🤖', channel: 'C11' },
                  { name: 'Aggregators', desc: 'API & infra layer', icon: '🔗', channel: 'C12' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="opacity-0 translate-y-[20px] md:translate-y-[30px] animate-cardReveal"
                    style={{ animationDelay: `${0.05 + index * 0.05}s` }}
                  >
                    <div className="relative bg-[#0d0d11] border border-[#1b1b23] rounded-[14px] md:rounded-[20px] p-4 md:p-6 lg:p-7 transition-all duration-[0.4s] ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-default overflow-hidden backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.01] hover:border-[#2dd4ff]/20 hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.4)]">
                      <div className="absolute inset-[-2px] rounded-[16px] md:rounded-[22px] bg-gradient-to-br from-[#2dd4ff]/2 via-[#8b5cf6]/2 to-[#e94ec4]/2 opacity-0 transition-opacity duration-500 pointer-events-none hover:opacity-100"></div>
                      <span className="absolute top-2 md:top-3 right-2 md:right-4 font-['JetBrains_Mono'] text-[8px] md:text-[10px] text-white/10 font-semibold tracking-[0.3px] md:tracking-[0.5px] transition-colors duration-300 hover:text-[#2dd4ff]/30">
                        {item.channel}
                      </span>
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 bg-[#2dd4ff]/5 border border-[#2dd4ff]/10 transition-all duration-[0.4s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#2dd4ff]/10 hover:border-[#2dd4ff]/20 hover:scale-105 hover:-rotate-3 hover:shadow-[0_8px_24px_rgba(45,212,255,0.06)]">
                        {item.icon}
                      </div>
                      <div className="font-['Space_Grotesk'] font-semibold text-[14px] md:text-[17px] text-[#eef0f5] mb-0.5 md:mb-1 transition-colors duration-300 hover:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] md:text-[14px] text-[#5c6070] leading-relaxed transition-colors duration-300 hover:text-[#9297a6]">
                        {item.desc}
                      </div>
                      <div className="absolute inset-[-1px] rounded-[14px] md:rounded-[20px] bg-gradient-to-br from-[#2dd4ff]/2 via-[#8b5cf6]/2 to-[#e94ec4]/2 opacity-0 transition-opacity duration-400 pointer-events-none hover:opacity-100"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 md:py-28 px-0 text-center border-t border-[#17171f] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(400px_200px_at_50%_100%,rgba(139,92,246,0.10),transparent_70%)] md:bg-[radial-gradient(600px_300px_at_50%_100%,rgba(139,92,246,0.14),transparent_70%)]"></div>
            <div className="max-w-[1180px] mx-auto relative">
              <h2 className="font-['Space_Grotesk'] font-bold text-[clamp(20px,4vw,28px)] md:text-[clamp(26px,4vw,42px)] mb-3 md:mb-4 tracking-[-0.3px] md:tracking-[-0.5px]">
                Ready to stop <span className="brand-gradient-text">switching tabs</span>?
              </h2>
              <p className="text-[#9297a6] text-[11px] md:text-sm mb-6 md:mb-8">Free to browse the directory. No account needed to start.</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary magnetic px-6 md:px-8 py-2.5 md:py-3.5 text-[11px] md:text-sm font-['Inter'] font-bold rounded-lg bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] hover:brightness-110 transition-all"
                data-magnetic
              >
                Get started free
              </button>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#17171f] py-5 md:py-7 px-0 flex-shrink-0">
          <div className="max-w-[1180px] mx-auto">

            {/* Top Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">

              {/* Logo */}
              <div className="flex items-center gap-2">
                <img
                  src="/septexa-logo.png"
                  alt="Septexa"
                  className="h-5 md:h-7 w-auto"
                />
                <span className="text-xs md:text-sm font-semibold text-[#eef0f5]">
                  Septexa
                </span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <button
                  onClick={(e) => handleSmoothScroll(e, '#how')}
                  className="text-[10px] md:text-[11px] text-[#5c6070] hover:text-[#2dd4ff] transition-colors duration-300 cursor-pointer bg-transparent border-none font-['Inter']"
                >
                  How it works
                </button>
                <span className="w-px h-2 md:h-3 bg-[#232330]"></span>
                <button
                  onClick={(e) => handleSmoothScroll(e, '#channels')}
                  className="text-[10px] md:text-[11px] text-[#5c6070] hover:text-[#2dd4ff] transition-colors duration-300 cursor-pointer bg-transparent border-none font-['Inter']"
                >
                  Channels
                </button>
                <span className="w-px h-2 md:h-3 bg-[#232330]"></span>
                <Link
                  to="/privacy"
                  className="text-[10px] md:text-[11px] text-[#5c6070] hover:text-[#2dd4ff] transition-colors duration-300"
                >
                  Privacy
                </Link>
                <span className="w-px h-2 md:h-3 bg-[#232330]"></span>
                <Link
                  to="/terms"
                  className="text-[10px] md:text-[11px] text-[#5c6070] hover:text-[#2dd4ff] transition-colors duration-300"
                >
                  Terms
                </Link>
              </div>

              {/* Powered By */}
              <div className="text-center">
                <span className="text-[8px] md:text-[9px] text-[#5c6070] font-mono tracking-wider">
                  Powered by{' '}
                  <span className="text-[#9297a6] font-semibold hover:text-[#2dd4ff] transition-colors duration-300 cursor-pointer">
                    YunRah Technologies
                  </span>
                </span>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="mt-3 md:mt-5 pt-3 md:pt-4 border-t border-[#17171f] flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-3">

              {/* System Status */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2dd4ff]"></span>
                </span>
                <span className="text-[8px] md:text-[9px] text-[#5c6070] font-mono">
                  All systems operational
                </span>
              </div>

              {/* Copyright */}
              <div className="flex items-center gap-2">
                <span className="text-[8px] md:text-[9px] text-[#5c6070] font-mono">
                  © {new Date().getFullYear()} Septexa
                </span>
                <span className="text-[8px] md:text-[9px] text-[#232330]">|</span>
                <span className="text-[8px] md:text-[9px] text-[#5c6070] font-mono tracking-wider">
                  Built with <span className="text-[#fb5d78]">✦</span>
                </span>
              </div>

            </div>

          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0d11] border border-[#232330] rounded-2xl p-6 md:p-8 max-w-[400px] w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold">
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#5c6070] hover:text-[#eef0f5] text-2xl leading-none">
                ×
              </button>
            </div>
            <p className="text-[#9297a6] text-xs md:text-sm mb-4 md:mb-6">
              {isLogin ? 'Access your Septexa dashboard' : 'Set up your Septexa workspace'}
            </p>

            {error && (
              <div className="bg-[#fb5d78]/10 border border-[#fb5d78]/20 text-[#fb5d78] text-xs md:text-sm rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label className="text-xs md:text-sm font-semibold text-[#9297a6] block mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-[#232330] bg-[#141419] text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors mb-3 md:mb-4"
                  />
                </>
              )}
              <label className="text-xs md:text-sm font-semibold text-[#9297a6] block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-[#232330] bg-[#141419] text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors mb-3 md:mb-4"
              />
              <label className="text-xs md:text-sm font-semibold text-[#9297a6] block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-[#232330] bg-[#141419] text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors mb-4 md:mb-6"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 md:py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </form>

            <div className="relative my-3 md:my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#232330]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] md:text-xs">
                <span className="px-2 md:px-3 bg-[#0d0d11] text-[#5c6070]">or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 rounded-lg border border-[#232330] bg-[#141419] hover:bg-[#1e1e27] transition-colors text-xs md:text-sm font-medium"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <p className="text-center text-[#9297a6] text-xs md:text-sm mt-3 md:mt-4 cursor-pointer">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#2dd4ff] font-semibold hover:underline" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;