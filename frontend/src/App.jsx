import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Zap, Shield, Brain, ChevronRight, ArrowRight, Sparkles, Globe, BarChart3, Users, CheckCircle2, Star, Menu, X, Settings } from 'lucide-react';

/* ─── Animated Counter Hook ─── */
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return [count, ref];
}

/* ─── Navigation Bar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Join Us', href: '#join' },
  ];

  const AdminLink = () => (
    <Link
      to="/admin"
      className="flex items-center gap-1.5 text-[#71717a] hover:text-[#a78bfa] text-sm font-medium transition-colors no-underline"
      title="Admin Dashboard"
    >
      <Settings size={15} />
      Admin
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#06d6a0] flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white font-display tracking-tight">
            Nex<span className="gradient-text">Ω</span> Labs
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors no-underline">
              {l.label}
            </a>
          ))}
          <AdminLink />
          <a
            href="#join"
            className="btn-primary text-sm !py-2.5 !px-6 no-underline inline-block relative z-10"
          >
            Get Early Access
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white bg-transparent border-none cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="text-[#a1a1aa] hover:text-white text-base font-medium no-underline">
                  {l.label}
                </a>
              ))}
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-[#a78bfa] hover:text-white text-base font-medium no-underline flex items-center gap-2">
                <Settings size={16} /> Admin Dashboard
              </Link>
              <a href="#join" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm no-underline">
                Get Early Access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── Hero Section with Spline behind text ─── */
function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-end justify-center overflow-hidden" id="hero">
      {/* Spline 3D Robot — background layer — BRIGHT & VISIBLE */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/nexbotrobotcharacterconcept-RIsXT8RvFfUJIOb52nwFWcUO/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 pointer-events-auto"
          title="NexΩ AI Agent"
          style={{ filter: 'brightness(0.85) saturate(1.3) contrast(1.1)' }}
        ></iframe>

        {/* Subtle overlay — very light so robot stays visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1118]/50 via-transparent to-[#0e1118]/95 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1118]/30 via-transparent to-[#0e1118]/30 pointer-events-none"></div>
      </div>

      {/* ── Colorful ambient glow orbs around the robot ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Purple glow — left side */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] left-[8%] w-[340px] h-[340px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.45) 0%, rgba(124,92,252,0) 70%)' }}
        />
        {/* Teal glow — right side */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[15%] right-[6%] w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,214,160,0.35) 0%, rgba(6,214,160,0) 70%)' }}
        />
        {/* Deep violet glow — center top (backlight for robot head) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(139,109,252,0.4) 0%, rgba(99,69,222,0) 70%)' }}
        />
        {/* Warm accent — bottom left */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] left-[15%] w-[250px] h-[250px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(167,139,250,0) 70%)' }}
        />
        {/* Cyan accent — bottom right */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[35%] right-[12%] w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0) 70%)' }}
        />
      </div>

      {/* Hero Content — positioned at the bottom so robot is visible above */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pointer-events-none pb-16 pt-[55vh]">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tight"
          style={{ textShadow: '0 0 60px rgba(124,92,252,0.5), 0 0 120px rgba(124,92,252,0.25), 0 4px 20px rgba(0,0,0,0.8)' }}
        >
          Build the Future with
          <br />
          <span className="gradient-text">Autonomous AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-[#c4c4cc] max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
        >
          NexΩ Labs crafts intelligent AI agents that think, plan, and execute autonomously —
          transforming how enterprises operate at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
        >
          <a href="#join" className="btn-primary text-base no-underline inline-flex items-center gap-2 justify-center relative z-10">
            <span className="relative z-10">Apply for Early Access</span>
            <ArrowRight size={18} className="relative z-10" />
          </a>
          <a href="#about" className="btn-secondary text-base no-underline inline-flex items-center gap-2 justify-center">
            Learn More
            <ChevronRight size={18} />
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[#71717a] text-sm"
        >
          <span className="flex items-center gap-2"><Shield size={16} className="text-[#06d6a0]" /> SOC 2 Certified</span>
          <span className="flex items-center gap-2"><Globe size={16} className="text-[#7c5cfc]" /> 30+ Countries</span>
          <span className="flex items-center gap-2"><Users size={16} className="text-[#a78bfa]" /> 500+ Beta Users</span>
        </motion.div>
      </div>

      {/* Bottom gradient to next section */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0e1118] to-transparent pointer-events-none z-20"></div>
    </section>
  );
}

/* ─── Stats Bar ─── */
function StatsBar() {
  const [stat1, ref1] = useCounter(97, 1800);
  const [stat2, ref2] = useCounter(500, 2000);
  const [stat3, ref3] = useCounter(10, 1500);
  const [stat4, ref4] = useCounter(99, 1800);

  const stats = [
    { value: `${stat1}%`, label: 'Task Accuracy', ref: ref1 },
    { value: `${stat2}+`, label: 'Active Agents', ref: ref2 },
    { value: `${stat3}x`, label: 'Faster Workflows', ref: ref3 },
    { value: `${stat4}.9%`, label: 'Uptime SLA', ref: ref4 },
  ];

  return (
    <section className="relative z-10 -mt-20 max-w-6xl mx-auto px-6">
      <div className="glass-strong rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            ref={s.ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-1">{s.value}</div>
            <div className="text-sm text-[#71717a] font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-28 grid-bg">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#06d6a0] font-semibold text-sm tracking-widest uppercase mb-4 block">Who We Are</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            We engineer minds,
            <br />
            <span className="gradient-text-alt">not just machines.</span>
          </h2>
          <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
            NexΩ Labs is at the frontier of agentic AI — building autonomous systems that don't just follow instructions,
            they understand context, make decisions, and continuously learn. Our agents integrate seamlessly into your
            existing workflow, acting as tireless digital teammates.
          </p>
          <p className="text-[#a1a1aa] text-base leading-relaxed mb-8">
            Founded by researchers from top AI labs, we're on a mission to democratize access to intelligent automation.
            We believe the future belongs to companies that augment human potential with autonomous intelligence.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Multi-Agent Orchestration', 'Real-Time Learning', 'Enterprise Security', 'API-First'].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium text-[#a78bfa] glass">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden glass p-8">
            {/* Animated "code" block to look techy */}
            <div className="font-mono text-sm space-y-3">
              <div className="text-[#52525b]">// Initialize NexΩ Agent</div>
              <div>
                <span className="text-[#a78bfa]">const</span> <span className="text-[#06d6a0]">agent</span> <span className="text-[#71717a]">=</span> <span className="text-[#a78bfa]">await</span> <span className="text-white">NexOmega</span><span className="text-[#71717a]">.</span><span className="text-[#06d6a0]">create</span><span className="text-[#71717a]">(</span><span className="text-[#71717a]">{'{'}</span>
              </div>
              <div className="pl-6">
                <span className="text-[#a78bfa]">name</span><span className="text-[#71717a]">:</span> <span className="text-[#06d6a0]">'ResearchBot'</span><span className="text-[#71717a]">,</span>
              </div>
              <div className="pl-6">
                <span className="text-[#a78bfa]">model</span><span className="text-[#71717a]">:</span> <span className="text-[#06d6a0]">'nexo-ultra-v3'</span><span className="text-[#71717a]">,</span>
              </div>
              <div className="pl-6">
                <span className="text-[#a78bfa]">tools</span><span className="text-[#71717a]">:</span> <span className="text-[#71717a]">[</span><span className="text-[#06d6a0]">'web'</span><span className="text-[#71717a]">,</span> <span className="text-[#06d6a0]">'code'</span><span className="text-[#71717a]">,</span> <span className="text-[#06d6a0]">'db'</span><span className="text-[#71717a]">],</span>
              </div>
              <div className="pl-6">
                <span className="text-[#a78bfa]">autonomy</span><span className="text-[#71717a]">:</span> <span className="text-[#a78bfa]">0.95</span>
              </div>
              <div>
                <span className="text-[#71717a]">{'}'}</span><span className="text-[#71717a]">);</span>
              </div>
              <div className="mt-4 text-[#52525b]">// Agent is live and learning...</div>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#06d6a0]"
              >
                █ Ready
              </motion.div>
            </div>
            {/* Glow accent */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#7c5cfc]/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#06d6a0]/10 rounded-full blur-[80px] pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
function ServicesSection() {
  const services = [
    {
      icon: <Brain size={28} />,
      title: 'Cognitive Agents',
      desc: 'AI agents that reason, plan multi-step tasks, and adapt to changing conditions in real-time.',
      color: '#7c5cfc',
    },
    {
      icon: <Zap size={28} />,
      title: 'Workflow Automation',
      desc: 'Automate complex business processes end-to-end with agents that understand your domain.',
      color: '#06d6a0',
    },
    {
      icon: <Shield size={28} />,
      title: 'Secure Deployment',
      desc: 'Enterprise-grade security with SOC 2 compliance, data encryption, and audit trails.',
      color: '#a78bfa',
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Analytics & Insights',
      desc: 'Deep observability into agent behavior, performance metrics, and ROI tracking.',
      color: '#818cf8',
    },
    {
      icon: <Globe size={28} />,
      title: 'Multi-Platform Deploy',
      desc: 'Deploy agents across cloud, on-prem, or hybrid environments with one click.',
      color: '#06d6a0',
    },
    {
      icon: <Users size={28} />,
      title: 'Team Collaboration',
      desc: 'Human-in-the-loop workflows where agents and people work together seamlessly.',
      color: '#7c5cfc',
    },
  ];

  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-[#06d6a0] font-semibold text-sm tracking-widest uppercase mb-4 block">What We Offer</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Capabilities that <span className="gradient-text">redefine</span> work
        </h2>
        <p className="text-[#71717a] max-w-xl mx-auto text-base">
          From autonomous reasoning to enterprise-grade deployments, our platform covers the full spectrum of agentic AI.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass rounded-2xl p-7 cursor-default group relative overflow-hidden"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{ background: `${s.color}15`, color: s.color }}
            >
              {s.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">{s.desc}</p>
            {/* Hover glow */}
            <div
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
              style={{ background: s.color }}
            ></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Define Your Goal', desc: 'Tell our platform what you want to achieve — in plain English. No code required.', icon: <Sparkles size={24} /> },
    { step: '02', title: 'Agent Assembles', desc: 'NexΩ auto-selects the best tools, models, and strategies for your task.', icon: <Bot size={24} /> },
    { step: '03', title: 'Autonomous Execution', desc: 'Your agent works autonomously, handling edge cases and adapting in real-time.', icon: <Zap size={24} /> },
    { step: '04', title: 'Review & Iterate', desc: 'Get detailed reports, approve actions, and fine-tune your agent over time.', icon: <CheckCircle2 size={24} /> },
  ];

  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#7c5cfc] font-semibold text-sm tracking-widest uppercase mb-4 block">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            From idea to <span className="gradient-text">autonomous agent</span>
          </h2>
          <p className="text-[#71717a] max-w-xl mx-auto text-base">
            Four simple steps to deploy your first AI agent. No ML expertise needed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#06d6a0]/10 border border-[#7c5cfc]/20 flex items-center justify-center mx-auto mb-5 text-[#a78bfa]">
                {s.icon}
              </div>
              <div className="text-xs font-bold text-[#7c5cfc] tracking-widest mb-2">{s.step}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{s.desc}</p>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-gradient-to-r from-[#7c5cfc]/30 to-[#06d6a0]/10"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "NexΩ agents reduced our customer response time by 80%. It's like having a tireless team working 24/7.",
      name: 'Sarah Chen',
      role: 'VP Operations, TechFlow Inc.',
      rating: 5,
    },
    {
      quote: "The autonomy level is incredible. Our agents handle complex research tasks that used to take our team days.",
      name: 'Marcus Rivera',
      role: 'CTO, DataPulse',
      rating: 5,
    },
    {
      quote: "Enterprise-grade security was our top concern. NexΩ exceeded our compliance requirements from day one.",
      name: 'Priya Sharma',
      role: 'CISO, FinGuard',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-[#06d6a0] font-semibold text-sm tracking-widest uppercase mb-4 block">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Trusted by <span className="gradient-text">innovators</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-7 flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={16} className="text-[#7c5cfc]" fill="#7c5cfc" />
              ))}
            </div>
            <p className="text-[#d4d4d8] text-sm leading-relaxed flex-grow mb-6">"{t.quote}"</p>
            <div>
              <div className="text-white font-semibold text-sm">{t.name}</div>
              <div className="text-[#52525b] text-xs">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Marquee / Logos Bar ─── */
function LogoMarquee() {
  const brands = ['Google Cloud', 'AWS', 'Microsoft', 'OpenAI', 'Anthropic', 'NVIDIA', 'Stripe', 'Slack'];
  return (
    <section className="py-12 border-y border-white/5 overflow-hidden">
      <div className="flex gap-16 animate-marquee">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-[#3f3f46] text-lg font-bold tracking-wider whitespace-nowrap font-display select-none">
            {b}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; display: flex; width: max-content; }
      `}</style>
    </section>
  );
}

/* ─── CTA / Join Form ─── */
function JoinSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    useCase: '',
    teamSize: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: null,
          guests: 1,
          checkInDate: new Date().toISOString().split('T')[0],
          company: formData.company,
          role: formData.role,
          useCase: formData.useCase,
          teamSize: formData.teamSize,
        }),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', company: '', role: '', useCase: '', teamSize: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  return (
    <section id="join" className="py-28 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c5cfc]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06d6a0]/8 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#7c5cfc] font-semibold text-sm tracking-widest uppercase mb-4 block">Join Us</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Ready to <span className="gradient-text">supercharge</span> your team?
          </h2>
          <p className="text-[#71717a] max-w-lg mx-auto text-base">
            Apply for early access and be among the first to deploy autonomous AI agents in your organization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Form glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7c5cfc]/15 rounded-full blur-[100px] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-[#06d6a0]/15 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-[#06d6a0]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Application Submitted!</h3>
                <p className="text-[#a1a1aa] max-w-md mx-auto">
                  Thank you for your interest in NexΩ Labs. Our team will review your application and get back to you within 48 hours.
                </p>
                <button
                  className="btn-secondary mt-8"
                  onClick={() => setSubmitStatus(null)}
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Work Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Your Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="input-field"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="">Select your role</option>
                    <option value="engineer">Engineer / Developer</option>
                    <option value="pm">Product Manager</option>
                    <option value="exec">Executive / C-Suite</option>
                    <option value="ops">Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Team Size</label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="input-field"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="">Select team size</option>
                    <option value="1-10">1–10 people</option>
                    <option value="11-50">11–50 people</option>
                    <option value="51-200">51–200 people</option>
                    <option value="200+">200+ people</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#a1a1aa] font-medium ml-1">Primary Use Case</label>
                  <input
                    type="text"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Customer support automation"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="btn-primary w-full !text-base !py-4 relative z-10 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {submitStatus === 'loading' ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Apply for Early Access
                          <ArrowRight size={18} />
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 text-center text-red-400 text-sm bg-red-400/10 rounded-xl py-3"
                  >
                    Something went wrong. Please try again or email us at hello@nexomegalabs.ai
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: 'What makes NexΩ different from other AI tools?',
      a: 'Unlike traditional AI chatbots, NexΩ agents operate autonomously — they can plan multi-step workflows, use external tools, handle errors, and learn from experience without constant human oversight.',
    },
    {
      q: 'How long does it take to deploy an agent?',
      a: 'Most agents can be configured and deployed within minutes. Complex enterprise integrations typically take 1-2 weeks with our dedicated onboarding team.',
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We are SOC 2 Type II certified, support data encryption at rest and in transit, and offer on-premise deployment for sensitive workloads. Your data never trains our models.',
    },
    {
      q: 'Can I control what the agent can and cannot do?',
      a: 'Yes. Our fine-grained permission system lets you define exactly which tools an agent can access, what actions require human approval, and set spending/usage limits.',
    },
    {
      q: 'What does early access include?',
      a: 'Early access gives you full platform access, priority support, a dedicated solutions engineer, and the ability to influence our product roadmap with your feedback.',
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-[#a78bfa] font-semibold text-sm tracking-widest uppercase mb-4 block">FAQ</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Got <span className="gradient-text">questions?</span>
        </h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              className="w-full text-left px-6 py-5 flex items-center justify-between bg-transparent border-none text-white cursor-pointer font-semibold text-base"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.q}</span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#7c5cfc] text-xl font-bold ml-4 shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-[#a1a1aa] text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#06d6a0] flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white font-display">NexΩ Labs</span>
            </div>
            <p className="text-[#52525b] text-sm leading-relaxed">
              Building the future of autonomous intelligence, one agent at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#a1a1aa] mb-4">Product</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Platform', 'Agents', 'Integrations', 'Pricing', 'Changelog'].map(l => (
                <li key={l}><a href="#" className="text-[#52525b] hover:text-white text-sm transition-colors no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#a1a1aa] mb-4">Company</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-[#52525b] hover:text-white text-sm transition-colors no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#a1a1aa] mb-4">Legal</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Privacy', 'Terms', 'Security', 'GDPR', 'SOC 2'].map(l => (
                <li key={l}><a href="#" className="text-[#52525b] hover:text-white text-sm transition-colors no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#3f3f46] text-xs">© 2026 NexΩ Labs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-[#52525b] hover:text-[#a78bfa] text-xs transition-colors no-underline flex items-center gap-1">
              <Settings size={12} /> Admin Panel
            </Link>
            {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map(s => (
              <a key={s} href="#" className="text-[#3f3f46] hover:text-[#a78bfa] text-xs transition-colors no-underline">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ██  MAIN APP  ██
   ═══════════════════════════════════════════ */
function App() {
  return (
    <div className="min-h-screen bg-[#0e1118] text-[#e4e4e7] flex flex-col font-sans">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <JoinSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

export default App;
