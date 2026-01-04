import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, ShieldCheck, Briefcase, Star, Zap, Globe, ExternalLink, Sparkles, X, ChevronLeft, ChevronRight, Calendar, MapPin, Clock, ArrowUp, Quote, Twitter, Linkedin, Instagram, Mail, ChevronDown } from 'lucide-react';

/* --- 
   UTILITY COMPONENTS & HOOKS 
   --- */

// Hook to lock body scroll
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};

// --- REUSABLE LIQUID GLASS COMPONENTS ---

// The visual layers for the glass effect (Effect, Tint, Shine)
const LiquidLayers = ({ rounded = "rounded-2xl", opacity = "bg-white/[0.03]" }) => (
  <>
    {/* Effect Layer: Distortion and Blur */}
    <div 
      className={`absolute inset-0 z-0 backdrop-blur-[2px] ${rounded} pointer-events-none`}
      style={{ filter: 'url(#glass-distortion)' }}
    />
    
    {/* Tint Layer: Subtle White Wash */}
    <div 
      className={`absolute inset-0 z-10 ${opacity} group-hover:bg-white/[0.08] transition-colors duration-500 ${rounded} pointer-events-none`}
    />
    
    {/* Shine Layer: Highlight Insets */}
    <div 
      className={`absolute inset-0 z-20 ${rounded} pointer-events-none`}
      style={{
        boxShadow: 'inset 1px 1px 0 0 rgba(255, 255, 255, 0.4), inset -1px -1px 0 0 rgba(255, 255, 255, 0.1)'
      }}
    />
  </>
);

// Liquid Glass Card Component
const LiquidCard = ({ children, className = "", onClick, rounded = "rounded-3xl" }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden group ${rounded} ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        transform: "translateZ(0)", // Force GPU to fix anti-aliasing on edges
      }}
    >
      <LiquidLayers rounded={rounded} />
      <div className="relative z-30 h-full w-full flex flex-col">{children}</div>
    </div>
  );
};

// Unified Liquid Button
const LiquidButton = ({ children, className = "", onClick, type = "button", rounded = "rounded-full" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative flex items-center justify-center outline-none select-none group ${rounded} ${className} transform-gpu`}
      style={{
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.05)',
        transform: "translateZ(0)", 
      }}
    >
      {/* 1. Base Layer for structure */}
      <div className={`absolute inset-0 bg-white/5 overflow-hidden ${rounded}`} />

      {/* 2. Liquid Effect Layers */}
      <LiquidLayers rounded={rounded} opacity="bg-white/10" />

      {/* 3. Content Layer */}
      <div className="relative z-30 flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};

// Scroll To Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <LiquidButton onClick={scrollToTop} className="w-12 h-12 md:w-14 md:h-14">
             <ArrowUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-cyan-200 transition-colors" />
          </LiquidButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Image Slider Component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-80 bg-black/50 overflow-hidden group rounded-2xl border border-white/5">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, zIndex: 1 }}
          exit={{ opacity: 0, zIndex: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
        <div className="pointer-events-auto">
            <LiquidButton onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="w-10 h-10">
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-cyan-200" />
            </LiquidButton>
        </div>
        <div className="pointer-events-auto">
            <LiquidButton onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="w-10 h-10">
                <ChevronRight className="w-5 h-5 text-white group-hover:text-cyan-200" />
            </LiquidButton>
        </div>
      </div>

      {/* Modern Pagination Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-500 ease-out ${idx === currentIndex ? 'bg-cyan-400 w-8 opacity-100' : 'bg-white w-2 opacity-30'}`} 
          />
        ))}
      </div>
    </div>
  );
};

// Event Modal with Liquid Glass - Unified Single Card (SCROLL & LAYOUT FIXED)
const EventModal = ({ event, onClose }) => {
  useBodyScrollLock(!!event);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-all duration-500"
      />
      
      {/* Modal Content - Manually composed to ensure scrollable flex layout works */}
      <motion.div 
        layoutId={`event-${event.id}`}
        // 1. Fixed Height: Essential for overflow to trigger (85vh)
        // 2. Flex Col: To stack Image and Content
        className="relative w-full max-w-4xl z-50 flex flex-col h-[80vh] md:h-[85vh] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl"
        style={{ transform: "translateZ(0)" }} // GPU force
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
         {/* Visual Layers */}
         <div className="absolute inset-0 pointer-events-none z-0">
            <LiquidLayers rounded="rounded-3xl" />
         </div>

        {/* Close Button - Fixed Position relative to modal */}
        <div className="absolute top-4 right-4 z-50">
            <LiquidButton onClick={onClose} className="w-10 h-10">
                <X className="w-5 h-5 text-white" />
            </LiquidButton>
        </div>

        {/* Scrollable Container - Flex-1 takes remaining height, overflow-y-auto enables scroll */}
        <div 
            className="flex-1 w-full overflow-y-auto no-scrollbar relative z-30 min-h-0 flex flex-col"
            style={{ overscrollBehaviorY: 'contain' }}
        >
            {/* Image Slider - Top of the card */}
            <div className="w-full p-4 shrink-0">
                <ImageSlider images={event.images} />
            </div>

            {/* Content Section */}
            <div className="px-6 pb-10 md:px-10 shrink-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${event.type === 'Upcoming' ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50'}`}>
                            {event.type}
                            </span>
                            <span className="text-white/40 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {event.date}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white leading-none">{event.title}</h2>
                    </div>
                    
                    {event.type === 'Upcoming' && (
                        <div className="shrink-0 mt-4 md:mt-0">
                            <LiquidButton className="px-8 py-4 text-white font-semibold" rounded="rounded-2xl">
                                Register Now
                            </LiquidButton>
                        </div>
                    )}
                </div>
                
                {/* Details & Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <div className="md:col-span-2 prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed">
                        <p>{event.description}</p>
                        <p>This event is crafted to provide deep insights and practical knowledge. Join us to connect with industry leaders, learn cutting-edge technologies, and be part of a community that is shaping the future of digital innovation.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div className="space-y-6">
                        <LiquidCard className="p-6" rounded="rounded-2xl">
                            <h4 className="text-white font-medium mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400"/> Location</h4>
                            <p className="text-white/50 text-sm">Tech Park Auditorium,<br/>Indore, MP</p>
                        </LiquidCard>
                        <LiquidCard className="p-6" rounded="rounded-2xl">
                            <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-purple-400"/> Capacity</h4>
                            <p className="text-white/50 text-sm">250+ Attendees<br/>Limited Seats</p>
                        </LiquidCard>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// Liquid Glass Testimonial Slider
const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Senior Frontend Developer",
      company: "TechNova",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      text: "Cracked Digital transformed my career trajectory. The networking opportunities here are unmatched in Central India. I found my co-founder at the last summit."
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "CTO",
      company: "InnovateX",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      text: "The quality of talent we hired through Cracked is exceptional. They aren't just coders; they are problem solvers. The 4% flat fee is just the icing on the cake."
    },
    {
      id: 3,
      name: "Ananya Singh",
      role: "Product Designer",
      company: "Freelance",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      text: "Finally, a community that understands design as much as code. The events are curated perfectly, and the mentorship I received was invaluable."
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="mt-32 relative max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-12 text-center">Community Voices</h3>
        
        <LiquidCard className="p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
               <AnimatePresence mode="wait">
                 <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
                 >
                    {/* Image with Glow */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -inset-4 bg-cyan-500/30 blur-xl rounded-full -z-10" />
                    </div>

                    {/* Text Content */}
                    <div className="text-center md:text-left flex-1">
                        <Quote className="w-8 h-8 text-white/30 mb-4 mx-auto md:mx-0" />
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light italic mb-6">
                            "{testimonials[currentIndex].text}"
                        </p>
                        <div>
                            <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                            <p className="text-cyan-400 text-sm">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
                        </div>
                    </div>
                 </motion.div>
               </AnimatePresence>

               {/* Navigation Controls - Responsive Positioning */}
               {/* Mobile: Bottom Row, Desktop: Side Flanking */}
               <div className="mt-8 flex justify-center gap-4 md:mt-0 md:absolute md:inset-y-0 md:left-0 md:right-0 md:flex md:items-center md:justify-between md:pointer-events-none md:px-0 md:-mx-8">
                  <div className="pointer-events-auto">
                      <LiquidButton onClick={prevTestimonial} className="w-10 h-10">
                          <ChevronLeft className="w-6 h-6 text-white" />
                      </LiquidButton>
                  </div>
                  <div className="pointer-events-auto">
                      <LiquidButton onClick={nextTestimonial} className="w-10 h-10">
                          <ChevronRight className="w-6 h-6 text-white" />
                      </LiquidButton>
                  </div>
               </div>
        </LiquidCard>
    </div>
  );
};

/* --- 
   PAGE SECTIONS 
   --- */

// PAGE 1: HOME
const HomePage = ({ onEventSelect }) => {
  const stats = [
    { label: "Growth (100 days)", value: "700%", icon: TrendingUp },
    { label: "Active Members", value: "600+", icon: Users },
    { label: "Organic Reach", value: "20k+", icon: Globe },
    { label: "Core Members", value: "15+", icon: Star },
  ];

  const faqs = [
    { q: "What is Cracked Digital?", a: "We are Central India's premier tech community connecting talent with opportunity through high-impact events, hackathons, and mentorship." },
    { q: "How can I join the community?", a: "It's simple. Click the 'Join Now' button to enter our exclusive WhatsApp network where all the action happens." },
    { q: "Is membership free?", a: "Yes, joining Cracked Digital as a community member is completely free for students, developers, and designers." },
    { q: "Do you offer job placements?", a: "We bridge the gap between talent and recruiters. Our 'Hire' portal helps top performers get placed with leading tech companies." },
    { q: "Who organizes these events?", a: "Events are managed by our Core Team of industry experts, senior developers, and passionate community leaders." },
    { q: "Can I become a Core Team member?", a: "We open recruitment drives periodically. Keep an eye on our community announcements if you want to lead." },
    { q: "Are events beginner-friendly?", a: "Absolutely. From 'Hello World' workshops to advanced cybersecurity summits, we have something for every skill level." },
    { q: "How do I sponsor an event?", a: "We love partners! Reach out through our 'Hire' page or contact us directly to discuss sponsorship packages." },
    { q: "Is this community only for coders?", a: "While code is our core, we welcome UI/UX designers, product managers, and founders. Tech needs everyone." },
    { q: "Where are you located?", a: "Our roots are in Indore, Madhya Pradesh, but we operate as a global-first digital collective." }
  ];

  // Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-32 gap-12 relative">
        
        {/* Background Atmospheric Glows - VIBRANT UPDATE */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-500/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-400/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none -z-10" />

        {/* Hero Left: Text Content */}
        <div className="w-full lg:w-3/5 z-10 space-y-6 md:space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-semibold text-cyan-300 tracking-wider uppercase shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-1 ring-white/5"
          >
            <Sparkles className="w-3 h-3 mr-2 text-cyan-200" /> Central India's Premier Community
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white selection:bg-cyan-500/30 leading-[1.1]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-sm">Cracked</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-200 via-white to-purple-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Digital.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-md mx-auto lg:mx-0 leading-relaxed font-light tracking-wide"
          >
            Momentum is our currency. We are the fastest growing tech collective bridging the gap between talent and opportunity.
          </motion.p>
          
          <div className="flex gap-4 justify-center lg:justify-start">
            <LiquidButton className="px-8 py-4 text-white font-semibold">
                Join Now <ArrowRight className="ml-2 w-4 h-4" />
            </LiquidButton>
          </div>
        </div>

        {/* Hero Right: Individual Stats Cards - 2x2 Grid */}
        <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-end">
          <motion.div 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ duration: 0.8, delay: 0.4 }}
             className="w-full max-w-xl"
          >
             <div className="grid grid-cols-2 gap-4"> {/* Changed to 2 columns for 4 items */}
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-full"
                    >
                        <LiquidCard className="h-full group" rounded="rounded-2xl">
                             {/* Explicit centering wrapper for inner content */}
                             <div className="flex flex-col items-center justify-center p-6 h-full text-center">
                                <stat.icon className="w-8 h-8 text-cyan-400 mb-3 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300">{stat.value}</h3>
                                <p className="text-white/40 uppercase text-[9px] tracking-widest font-bold mt-2 group-hover:text-cyan-200 transition-colors">{stat.label}</p>
                             </div>
                        </LiquidCard>
                    </motion.div>
                ))}
             </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section (Replaces Events) */}
      <div className="space-y-12 mt-20">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">FAQ</h2>
          <span className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-widest hidden sm:block">Everything you need to know</span>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <LiquidCard className="overflow-hidden" rounded="rounded-2xl" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                <div className="p-5 flex items-center justify-between cursor-pointer group">
                  <h4 className={`text-base md:text-lg font-medium transition-colors ${activeFaq === idx ? 'text-cyan-300' : 'text-white/90 group-hover:text-white'}`}>
                    {faq.q}
                  </h4>
                  <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6">
                        <p className="text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
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

// PAGE 2: EVENTS (New Page)
const EventsPage = ({ onEventSelect }) => {
    const events = [
        { 
          id: 1,
          title: "CyberSec Summit", 
          date: "Oct 2023", 
          type: "Past", 
          description: "An intensive deep dive into modern cybersecurity threats and defense mechanisms. Over 200 attendees participated in live CTF challenges and workshops led by industry experts.",
          images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1563206767-5b1d97289374?auto=format&fit=crop&q=80&w=800"
          ]
        },
        { 
          id: 2,
          title: "AI & The Future", 
          date: "Dec 2023", 
          type: "Past", 
          description: "Exploring the frontiers of Generative AI. We hosted speakers from top tech firms to discuss the ethical implications and future capabilities of LLMs.",
          images: [
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1676299081847-5c46b54a4086?auto=format&fit=crop&q=80&w=800"
          ]
        },
        { 
          id: 3,
          title: "React Native Workshop", 
          date: "Jan 2024", 
          type: "Past", 
          description: "A hands-on coding bootcamp where students built a fully functional mobile app from scratch in under 6 hours. Code reviews and mentorship were provided live.",
          images: [
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
          ]
        },
        { 
          id: 4,
          title: "Cracked Hackathon v2", 
          date: "Coming Soon", 
          type: "Upcoming", 
          description: "Our biggest event yet. 48 hours of coding, caffeine, and creation. Join us to build the next unicorn and win prizes worth over $5000.",
          images: [
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
          ]
        },
      ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
            <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-12">
                <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Events</h2>
                <span className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-widest hidden sm:block">Bridging Online & Offline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((evt) => (
                    <motion.div 
                    key={evt.id}
                    layoutId={`event-${evt.id}`}
                    onClick={() => onEventSelect(evt)}
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="cursor-pointer"
                    >
                    <LiquidCard className="group aspect-[4/5]" rounded="rounded-3xl">
                        {/* Image - Increased opacity for visibility */}
                        <motion.div 
                            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" 
                        >
                            <img src={evt.images[0]} alt={evt.title} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="flex items-center gap-3 mb-3 opacity-80">
                                <span className={`text-[10px] font-mono uppercase tracking-widest border border-white/10 px-2 py-1 rounded-full backdrop-blur-md ${evt.type === 'Upcoming' ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30' : 'bg-black/50 text-white/60'}`}>
                                {evt.type}
                                </span>
                                <span className="text-white/50 text-[10px] font-mono uppercase tracking-wider">{evt.date}</span>
                            </div>
                            
                            <h4 className="text-2xl font-medium text-white mb-2 tracking-tight leading-none group-hover:text-cyan-200 transition-colors duration-300">{evt.title}</h4>
                            
                            <div className="flex items-center gap-2 text-white/50 text-xs font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                            Explore <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </LiquidCard>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// PAGE 3: ABOUT
const AboutPage = () => {
  const milestones = [
    { year: "Genesis", title: "Community Founded", desc: "Started with 5 developers in a coffee shop." },
    { year: "Growth", title: "Cyber Police MP Partnership", desc: "Official collaboration to train cadets in cybersecurity basics." },
    { year: "Expansion", title: "7+ College Partners", desc: "Established student chapters across the state." },
    { year: "Now", title: "3+ Strategic Sponsors", desc: "Fueling the next generation of hackathons." },
  ];

  // Timeline Scroll Logic
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
      <div className="text-center mb-16 md:mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">The Journey</h2>
        <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg">
          We aren't just building a community; we are engineering an ecosystem.
        </p>
      </div>

      <div className="relative" ref={containerRef}>
        {/* Light Streak (Timeline) - Now dynamic */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 transform md:-translate-x-1/2">
          <motion.div 
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
        </div>

        <div className="space-y-12 md:space-y-24">
          {milestones.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-50px" }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full pl-16 md:pl-0 md:p-0">
                <LiquidCard className="p-6 md:p-8" rounded="rounded-2xl">
                  <span className="text-cyan-400 text-xs md:text-sm font-mono mb-2 block">{item.year}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm md:text-base">{item.desc}</p>
                </LiquidCard>
              </div>
              
              <div className="absolute left-2 md:static md:relative z-10 flex-shrink-0 w-8 h-8 md:w-16 md:h-16 rounded-full border border-white/20 bg-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] mt-6 md:mt-0">
                 <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
              </div>
              
              <div className="flex-1 hidden md:block" /> 
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Testimonial Slider */}
      <TestimonialSlider />

      <div className="mt-24 md:mt-32 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 blur-3xl -z-10" />
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the Core Team</h3>
        <p className="text-white/50 mb-8 max-w-xl mx-auto text-sm md:text-base">We are always looking for designers, developers, and visionaries. If you have the drive, we have the platform.</p>
        <LiquidButton className="px-8 py-3 text-white font-semibold mt-6 mx-auto">
          Apply Now
        </LiquidButton>
      </div>
    </div>
  );
};

// PAGE 4: HIRE (B2B)
const HirePage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Proposition */}
        <div className="space-y-8 md:space-y-12">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 md:mb-6">
              Talent above your expectation, <span className="text-white/30">below your budget.</span>
            </h2>
            <p className="text-base md:text-lg text-white/60">
              Stop sifting through mediocre resumes. We provide pre-vetted, top 1% talent from Central India ready to deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
                { icon: ShieldCheck, color: "text-green-400", title: "Top 1% Talent", desc: "Rigorous technical screening." },
                { icon: Star, color: "text-yellow-400", title: "4% Flat Fee", desc: "Lowest market rate guaranteed." },
                { icon: Zap, color: "text-cyan-400", title: "Rapid Placement", desc: "Candidates ready in 48 hours." },
                { icon: Briefcase, color: "text-purple-400", title: "5 Placed", desc: "Via Cracked Exclusive." }
            ].map((item, i) => (
                <LiquidCard key={i} className="p-5 md:p-6" rounded="rounded-2xl">
                    <item.icon className={`w-6 h-6 md:w-8 md:h-8 ${item.color} mb-3 md:mb-4`} />
                    <h4 className="text-white font-bold text-base md:text-lg">{item.title}</h4>
                    <p className="text-white/40 text-xs md:text-sm mt-2">{item.desc}</p>
                </LiquidCard>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/30 blur-3xl -z-10" />
          
          <LiquidCard className="p-6 md:p-10" rounded="rounded-3xl">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Hire from Us</h3>
            <form className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold">Company Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold">Work Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm" placeholder="hr@acme.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/40 uppercase tracking-widest font-semibold">Requirements</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm resize-none" placeholder="We need a React Native developer..." />
              </div>
              
              <LiquidButton type="submit" rounded="rounded-2xl" className="w-full text-white font-semibold py-4">
                Send Request
              </LiquidButton>

              <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10 mt-6">
                <span className="text-white/40 text-xs md:text-sm">or chat on</span>
                <button type="button" className="text-green-400 font-medium hover:underline flex items-center gap-1 text-xs md:text-sm">
                  WhatsApp <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </form>
          </LiquidCard>
        </div>
      </div>
    </div>
  );
};

/* --- 
   MAIN APP SHELL 
   --- */

const CrackedDigitalApp = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Smooth mouse tracking for background effect
  const handleGlobalMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  const backgroundGradient = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 60%)`;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'hire', label: 'Hire' },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-[#030303] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative"
      onMouseMove={handleGlobalMouseMove}
    >
      {/* Global Style for hiding scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 1. Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Layer 1: Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a]" />

        {/* Layer 2: High-Res Cinematic Grain */}
        <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        
        {/* Layer 3: Starfield (Procedural Dots) */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 50px 50px, #ffffff 50%, transparent 100%), radial-gradient(1px 1px at 100px 150px, #ffffff 40%, transparent 100%), radial-gradient(1px 1px at 200px 50px, #ffffff 60%, transparent 100%)', backgroundSize: '400px 400px', opacity: 0.3 }}></div>

        {/* Layer 4: Interactive Reveal Light */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ background: backgroundGradient }}
        />
      </div>

      {/* 2. Navigation - Fixed Liquid Glass (No Collapse) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-6 flex justify-center pointer-events-none">
        {/* Wrapper Layer: Shape, Transition, Outer Shadow */}
        <div 
          className="relative flex items-center justify-center gap-1 rounded-full overflow-hidden pointer-events-auto max-w-[90vw] overflow-x-auto no-scrollbar p-2 transform-gpu translate-z-0"
          style={{
            boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)'
          }}
        >
          {/* Effect Layer: Distortion and Blur */}
          <div 
            className="absolute inset-0 z-0 backdrop-blur-[1px]"
            style={{ filter: 'url(#glass-distortion)' }}
          />

          {/* Tint Layer: Subtle White Wash */}
          <div 
            className="absolute inset-0 z-10"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          {/* Shine Layer: Highlight Insets */}
          <div 
            className="absolute inset-0 z-20 rounded-full"
            style={{
              boxShadow: 'inset 1px 1px 0 0 rgba(255, 255, 255, 0.5), inset -1px -1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          />

          {/* Content Layer: Buttons */}
          <div className="relative z-30 flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => { e.stopPropagation(); setActivePage(item.id); }}
                className={`relative px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap pointer-events-auto cursor-pointer ${
                  activePage === item.id ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {activePage === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", stiffness: 220, damping: 12 }}
                  />
                )}
                <span className="relative z-10 tracking-wide font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="relative z-10 pt-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <HomePage onEventSelect={setSelectedEvent} />
            </motion.div>
          )}

          {activePage === 'events' && (
             <motion.div
             key="events"
             initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
             animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
             exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
             transition={{ duration: 0.4 }}
           >
             <EventsPage onEventSelect={setSelectedEvent} />
           </motion.div>
          )}

          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {activePage === 'hire' && (
            <motion.div
              key="hire"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <HirePage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Global Modal Layer */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>

      {/* 5. Scroll To Top Button */}
      <ScrollToTop />

      {/* 6. Detailed Footer - Compact Horizontal Layout */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050505] py-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                
                {/* Brand & Socials (Left Side) */}
                <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8">
                    <div className="inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Cracked Digital</h3>
                    </div>
                    
                    <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                    
                    <div className="flex gap-3">
                        <LiquidButton className="w-9 h-9 p-0 text-white/70 hover:text-white">
                            <Twitter className="w-4 h-4" />
                        </LiquidButton>
                        <LiquidButton className="w-9 h-9 p-0 text-white/70 hover:text-white">
                            <Linkedin className="w-4 h-4" />
                        </LiquidButton>
                        <LiquidButton className="w-9 h-9 p-0 text-white/70 hover:text-white">
                            <Instagram className="w-4 h-4" />
                        </LiquidButton>
                    </div>
                </div>

                {/* Compact Links (Right Side) */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium text-white/50">
                     <button onClick={() => setActivePage('home')} className="hover:text-cyan-400 transition-colors">Home</button>
                     <button onClick={() => setActivePage('events')} className="hover:text-cyan-400 transition-colors">Events</button>
                     <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition-colors">About</button>
                     <button onClick={() => setActivePage('hire')} className="hover:text-cyan-400 transition-colors">Hire</button>
                     <span className="hidden sm:inline text-white/10">|</span>
                     <a href="mailto:hello@cracked.digital" className="hover:text-white transition-colors">Contact</a>
                     <a href="#" className="hover:text-white transition-colors">Privacy</a>
                </div>
            </div>
            
            <div className="mt-6 text-center text-[10px] text-white/20 uppercase tracking-widest">
                &copy; 2024 Cracked Digital. Made with glass & code.
            </div>
        </div>
      </footer>

      {/* SVG Filter Definition for Glass Distortion */}
      <svg style={{ display: 'none' }}>
        <filter id="glass-distortion" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feDisplacementMap in="SourceGraphic" in2="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" result="displacementMap" />
          <feGaussianBlur stdDeviation="3 3" x="0%" y="0%" width="100%" height="100%" in="displacementMap" edgeMode="none" result="blur" />
        </filter>
      </svg>
    </div>
  );
};

export default CrackedDigitalApp;