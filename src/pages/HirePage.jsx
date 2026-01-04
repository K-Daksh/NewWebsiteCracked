import { motion } from 'framer-motion';
import { ShieldCheck, Star, Zap, Briefcase, ExternalLink, ClipboardList, Filter, Code2, UserCheck, Rocket } from 'lucide-react';
import { LiquidCard } from '../components/common/LiquidCard';
import { LiquidButton } from '../components/common/LiquidButton';
import { TiltCard } from '../components/common/TiltCard';

export const HirePage = () => {
  const steps = [
    { 
        icon: ClipboardList, 
        title: "Requirements", 
        desc: "We analyze your specific needs, tech stack, and cultural fit requirements." 
    },
    { 
        icon: Filter, 
        title: "Screening", 
        desc: " rigorous initial filtering to identify candidates with the right foundational skills." 
    },
    { 
        icon: Code2, 
        title: "Custom Assessments", 
        desc: "Tailored technical rounds and coding challenges designed for your specific role." 
    },
    { 
        icon: UserCheck, 
        title: "Shortlisting", 
        desc: "Curating a list of the top 5-10 potential candidates who are ready to interview." 
    },
    { 
        icon: Rocket, 
        title: "Final Submission", 
        desc: "You choose from the best of the best. Rapid onboarding follows immediately." 
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-12 lg:px-16 pt-0 pb-20">
      
      {/* Intro Section: Centered */}
      <div className="mb-24 lg:mb-32 text-center max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 md:mb-8">
              Talent above your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">expectations</span>, <span className="text-white">below your</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">budget</span>.
            </h2>
            <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto">
              Stop sifting through mediocre resumes. We provide pre-vetted, top 1% talent from Central India ready to deploy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
                { icon: ShieldCheck, color: "text-green-400", title: "Top 1% Talent", desc: "Rigorous technical screening." },
                { icon: Star, color: "text-yellow-400", title: "4% Flat Fee", desc: "Lowest market rate guaranteed." },
                { icon: Zap, color: "text-purple-400", title: "Rapid Placement", desc: "Candidates ready in 48 hours." },
                { icon: Briefcase, color: "text-purple-400", title: "5 Placed", desc: "Via Cracked Exclusive." }
            ].map((item, i) => (
                <LiquidCard key={i} className="p-4 md:p-6 text-center h-full" rounded="rounded-2xl">
                    <div className="flex flex-col items-center justify-center h-full">
                        <item.icon className={`w-5 h-5 md:w-8 md:h-8 ${item.color} mb-2 md:mb-4`} />
                        <h4 className="text-white font-bold text-sm md:text-lg">{item.title}</h4>
                        <p className="text-white/40 text-[10px] md:text-sm mt-1 leading-tight">{item.desc}</p>
                    </div>
                </LiquidCard>
            ))}
          </div>
      </div>

      {/* Process Section */}
      <div className="mb-32">
        <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Hiring Pipeline</h3>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
                From requirement to placement, we handle the complexity so you can focus on building.
            </p>
        </div>

        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-0 right-0 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-8 relative z-10">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative group h-full flex flex-col">
                         {/* Step Number/Icon Bubble */}
                        <div className="w-8 h-8 md:w-32 md:h-8 mx-auto mb-3 md:mb-10 relative flex items-center justify-center shrink-0">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a0a0a] border border-purple-500/30 flex items-center justify-center md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                <span className="font-mono text-purple-400 font-bold text-xs md:text-base">{idx + 1}</span>
                            </div>
                        </div>

                        {/* Card - Clean Style without Glow */}
                        <div className="flex-1 pt-1 md:pt-4">
                            <TiltCard 
                                className="h-full" 
                                containerHeight="100%"
                                rounded="rounded-2xl" 
                                scaleOnHover={1.05} 
                                rotateAmplitude={5}
                            >
                                 <div className="flex flex-col items-center justify-start py-4 px-2 md:pt-8 md:px-4 md:pb-8 h-full text-center">
                                     <step.icon className="w-5 h-5 md:w-8 md:h-8 text-purple-400 mb-3 md:mb-6 group-hover:text-purple-300 transition-colors duration-300" />
                                     <h4 className="text-sm md:text-lg font-bold text-white leading-tight mb-2 md:mb-4 transition-all duration-300 h-10 md:h-14 flex items-center justify-center">
                                        {step.title}
                                     </h4>
                                     <p className="text-white/40 text-[10px] md:text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                                        {step.desc}
                                     </p>
                                 </div>
                            </TiltCard>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Hire Form Section - Moved to Bottom & Centered */}
      <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-6">Ready to Scale?</h3>
            <p className="text-white/50 text-sm md:text-lg">
                Tell us your requirements and we'll find your next star developer within 48 hours.
            </p>
          </div>
          
          <LiquidCard className="p-6 md:p-12" rounded="rounded-2xl">
            <form className="space-y-4 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold ml-1">Company Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-xs md:text-sm" placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold ml-1">Work Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-xs md:text-sm" placeholder="hr@acme.com" />
                  </div>
              </div>
              
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold ml-1">Requirements</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-white/20 text-xs md:text-sm resize-none" placeholder="We need a React Native developer with 3+ years experience..." />
              </div>
              
              <LiquidButton type="submit" rounded="rounded-xl" className="w-full text-white font-semibold py-3 md:py-5 text-sm md:text-lg">
                Send Hiring Request
              </LiquidButton>

              <div className="flex items-center justify-center gap-2 md:gap-3 pt-4 md:pt-6 border-t border-white/10 mt-6 md:mt-8">
                <span className="text-white/40 text-xs md:text-sm">Prefer a quick chat?</span>
                <button type="button" className="text-green-400 font-medium hover:text-green-300 transition-colors flex items-center gap-2 text-xs md:text-sm">
                  WhatsApp Us <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </form>
          </LiquidCard>
      </div>

    </div>
  );
};
