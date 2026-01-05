import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, Globe, Star, ChevronDown, Trophy, Terminal, Map, Zap, Award, Target } from 'lucide-react';
import { LiquidCard } from '../components/common/LiquidCard';
import { LiquidButton } from '../components/common/LiquidButton';
import { TiltCard } from '../components/common/TiltCard';
import CountUp from '../components/common/CountUp';
import ShinyText from '../components/common/ShinyText';
import { useData } from '../context/DataContext';

// Icon mapping for dynamic stats
const ICON_MAP = {
  TrendingUp, Users, Globe, Star, Award, Target, Trophy, Zap
};

// Static Data - Extracted to prevent re-creation on render
const FALLBACK_STATS = [
  { label: "Growth (100 days)", value: 700, suffix: "%", icon: TrendingUp },
  { label: "Active Members", value: 600, suffix: "+", icon: Users },
  { label: "Organic Reach", value: 20, suffix: "k+", icon: Globe },
  { label: "Core Members", value: 15, suffix: "+", icon: Star },
];

const FEATURES_DATA = [
  { 
      title: "Flagship Events", 
      desc: "Experience Central India's premier tech showcases, from high-octane hackathons to exclusive networking summits.", 
      icon: Trophy,
      color: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.4)"
  },
  { 
      title: "Technical Resources", 
      desc: "Access comprehensive tutorials, code examples, and best practices from industry experts.", 
      icon: Terminal,
      color: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.4)"
  },
  { 
      title: "Expert Community", 
      desc: "Connect with experienced developers, get mentorship, and collaborate on projects.", 
      icon: Users,
      color: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.4)"
  },
  { 
      title: "Learning Paths", 
      desc: "Structured learning journeys designed to take you from beginner to advanced levels.", 
      icon: Map,
      color: "text-purple-400",
      glow: "rgba(168, 85, 247, 0.4)"
  }
];

const FALLBACK_FAQS = [
  { q: "What is Cracked Digital?", a: "We are Central India's premier tech community connecting talent with opportunity through high-impact events, hackathons, and mentorship." },
  { q: "How can I join the community?", a: "It's simple. Click the 'Join Now' button to enter our exclusive WhatsApp network where all the action happens." },
  { q: "Is membership free?", a: "Yes, joining Cracked Digital as a community member is completely free for students, developers, and designers." },
];

export const HomePage = ({ onEventSelect }) => {
  const { stats: contextStats, faqs: contextFaqs } = useData();
  
  // Map stats from context with proper icons
  const stats = contextStats.length > 0 
    ? contextStats.map(stat => ({
        ...stat,
        icon: ICON_MAP[stat.icon] || TrendingUp,
        value: stat.numericValue || parseInt(stat.value) || 0,
      }))
    : FALLBACK_STATS;

  // Use FAQs from context or fallback to static
  const faqs = contextFaqs.length > 0 
    ? contextFaqs.map(f => ({ q: f.question, a: f.answer }))
    : FALLBACK_FAQS;

  // Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 pt-2 sm:pt-4 pb-16 sm:pb-20">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-12 sm:mb-20 gap-6 lg:gap-10 relative">

        {/* Hero Left: Text Content */}
        <div className="w-full lg:w-3/5 z-10 space-y-3 sm:space-y-5 md:space-y-6 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] sm:text-[10px] md:text-xs font-semibold text-purple-300 tracking-wider uppercase shadow-[0_0_15px_rgba(129,47,236,0.2)] ring-1 ring-white/5"
          >
            <Sparkles className="w-3 h-3 mr-1.5 sm:mr-2 text-purple-200" /> Central India's Premier Community
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 text-7xl sm:text-8xl md:text-8xl lg:text-9xl xl:text-[8rem] font-bold tracking-tighter text-white selection:bg-purple-500/30 leading-[1.1] pb-4"
          >
            <ShinyText 
              text="Cracked" 
              color="#ffffff" 
              shineColor="#c4b5fd" 
              speed={3} 
              delay={1}
              className="drop-shadow-sm"
            /><br />
            <ShinyText 
              text="Digital." 
              color="#e9d5ff" 
              shineColor="#ffffff" 
              speed={3} 
              delay={1.5}
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] pb-2"
            />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 max-w-md mx-auto lg:mx-0 leading-relaxed font-light tracking-wide"
          >
            We are the fastest growing tech collective bridging the gap between talent and opportunity.
          </motion.p>
          
          <div className="flex gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
            <LiquidButton className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold">
                Join Now <ArrowRight className="ml-1.5 sm:ml-2 w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </LiquidButton>
          </div>
        </div>

        {/* Hero Right: Individual Stats Cards - Responsive Grid */}
        <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-end">
          <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="w-full max-w-xl"
          >
             {/* Responsive: 2 column on mobile/tablet+ */}
             <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, idx) => (
                    <TiltCard
                        key={idx}
                        rounded="rounded-2xl"
                        scaleOnHover={1.08}
                        rotateAmplitude={10}
                        className="h-full"
                    >
                         {/* Explicit centering wrapper for inner content */}
                         <div className="flex flex-col items-center justify-center p-5 sm:p-6 h-full text-center min-h-[120px] sm:min-h-[140px]">
                            <stat.icon className="w-7 sm:w-8 h-7 sm:h-8 text-purple-400 mb-2 sm:mb-3 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(129,47,236,0.5)]" />
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(129,47,236,0.6)] transition-all duration-300">
                              <CountUp to={stat.value} suffix={stat.suffix} duration={1.5} delay={idx * 0.1} />
                            </h3>
                            <p className="text-white/40 uppercase text-[8px] sm:text-[9px] tracking-widest font-bold mt-1.5 sm:mt-2 group-hover:text-purple-200 transition-colors">{stat.label}</p>
                         </div>
                    </TiltCard>
                ))}
             </div>
          </motion.div>
        </div>
      </div>

      {/* Why Choose CRACKED Section */}
      <div className="space-y-12 mb-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">Why Choose <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CRACKED</span>?</h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            We provide comprehensive resources, expert guidance, and a supportive community to accelerate your technical career and personal growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {FEATURES_DATA.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="h-full"
            >
            <TiltCard className="h-full p-4 md:p-6" containerHeight="100%" rounded="rounded-2xl" scaleOnHover={1.02}>
                <div className="flex flex-col items-center justify-start h-full w-full text-center">
                  <div 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-5"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: `0 0 20px -5px ${feature.glow}`
                    }}
                  >
                    <feature.icon className={`w-3.5 h-3.5 md:w-6 md:h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-white/50 text-[10px] md:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section (Replaces Events) */}
      <div className="space-y-12 mt-20">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">FAQ</h2>
          <span className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-widest hidden sm:block">Everything you need to know</span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <LiquidCard className="overflow-hidden" rounded="rounded-xl" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                <div className="p-3 sm:p-4 flex items-center justify-between cursor-pointer group">
                  <h4 className={`text-xs sm:text-sm md:text-lg font-medium transition-colors ${activeFaq === idx ? 'text-purple-300' : 'text-white/90 group-hover:text-white'}`}>
                    {faq.q}
                  </h4>
                  <ChevronDown className={`w-3.5 h-3.5 md:w-5 md:h-5 text-white/50 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-purple-400' : ''}`} />
                </div>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-3 pb-3 md:px-5 md:pb-6">
                        <p className="text-white/60 text-[10px] sm:text-xs md:text-sm leading-relaxed border-t border-white/5 pt-2 md:pt-4">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LiquidCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
