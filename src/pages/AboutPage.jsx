import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Users, TrendingUp, Globe, Rocket, Heart } from 'lucide-react';
import { LiquidCard } from '../components/common/LiquidCard';
import { LiquidButton } from '../components/common/LiquidButton';
import { TiltCard } from '../components/common/TiltCard';
import CurvedLoop from '../components/common/CurvedLoop';
import TeamCard from '../components/common/TeamCard';
import { useData } from '../context/DataContext';

export const AboutPage = () => {
  const { milestones: contextMilestones, team = [], settings } = useData();
  
  // Use milestones from context or fallback to static
  const milestones = contextMilestones.length > 0 
    ? contextMilestones.map(m => ({ year: m.year, title: m.title, desc: m.description }))
    : [
        { year: "Genesis", title: "Community Founded", desc: "Started with 5 developers in a coffee shop." },
        { year: "Growth", title: "Cyber Police MP Partnership", desc: "Official collaboration to train cadets in cybersecurity basics." },
        { year: "Expansion", title: "7+ College Partners", desc: "Established student chapters across the state." },
        { year: "Now", title: "3+ Strategic Sponsors", desc: "Fueling the next generation of hackathons." },
      ];

  const values = [
      {
          title: "Innovation First",
          desc: "We believe in pushing the boundaries of what's possible in technology and education, constantly evolving to meet the needs of tomorrow's developers.",
          icon: Rocket,
          color: "text-blue-400"
      },
      {
          title: "Community Driven",
          desc: "Our strength lies in our community. Every member contributes to making CRACKED a better place for learning, growing, and succeeding together.",
          icon: Heart,
          color: "text-pink-400"
      },
      {
          title: "Growth Focused",
          desc: "We're committed to accelerating your career growth through practical resources, expert mentorship, and real-world project experiences.",
          icon: TrendingUp,
          color: "text-green-400"
      },
      {
          title: "Global Impact",
          desc: "Building a worldwide network of skilled developers who are shaping the future of technology across industries and continents.",
          icon: Globe,
          color: "text-purple-400"
      }
  ];

  // Timeline Scroll Logic
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 pt-0 pb-16">
      
      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20 lg:mb-28">
          <div className="space-y-4 md:space-y-5 order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                  Our Story
              </h1>
              <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                  Founded with a vision to democratize technical education and create a supportive ecosystem for developers worldwide. We empower developers of all levels with the knowledge, tools, and community support they need to excel in their careers and contribute meaningfully to the tech industry.
              </p>
              <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                  We believe that great software is built by great developers, and great developers are nurtured in great communities. Our vision is to become the world's leading platform for technical education and developer community, where anyone can learn, grow, and achieve their full potential.
              </p>
              <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                   We envision a future where technology education is accessible, practical, and driven by real-world applications.
              </p>
          </div>
          <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden relative z-10 w-full max-w-md mx-auto lg:ml-auto">
                   <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                      alt="Our Team" 
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" 
                   />
                   {/* Dual Gradient for better text visibility */}
                   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
                   
                   {/* Interactive Curved Text Overlay */}
                   <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      {/* Top Border Loop */}
                      {/* <div className="absolute top-[0px] left-0 right-0 h-32 flex items-center justify-center -translate-y-4">
                        <CurvedLoop 
                            marqueeText="COMMUNITY • INNOVATION • GROWTH • " 
                            curveAmount={-30} 
                            speed={0.4} 
                            direction="left"
                            className="text-white/30 font-black tracking-widest scale-110"
                        />
                      </div> */}

                      {/* Bottom Border Loop */}
                      <div className="absolute bottom-[-67px] left-0 right-0 h-32 flex items-center justify-center">
                         <CurvedLoop 
                            marqueeText="BUILD • SHIP • SCALE • REPEAT • " 
                            curveAmount={30} 
                            speed={1} 
                            direction="right"
                            className="text-purple-300/30 font-black tracking-widest scale-110"
                        />
                      </div>
                   </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl opacity-60" />
          </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-20 lg:mb-28">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Core Values</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">The principles that guide every event we host and every line of code we write.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {values.map((val, idx) => (
                  <TiltCard key={idx} className="h-full p-4 md:p-6" rounded="rounded-2xl">
                      <div className="flex flex-col items-center text-center h-full">
                        <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center mb-3 md:mb-6`}>
                            <val.icon className={`w-3.5 h-3.5 md:w-6 md:h-6 ${val.color}`} />
                        </div>
                        <h3 className="text-sm md:text-xl font-bold text-white mb-2 md:mb-3">{val.title}</h3>
                        <p className="text-white/50 text-[10px] md:text-sm leading-relaxed">
                            {val.desc}
                        </p>
                      </div>
                  </TiltCard>
              ))}
          </div>
      </div>

      {/* The Journey Section - now wider container */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Journey</h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          We aren't just building a community; we are engineering an ecosystem.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto" ref={containerRef}>
        {/* Vibrant Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2">
          <motion.div 
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-purple-400 via-pink-500 to-purple-600 shadow-[0_0_20px_rgba(129,47,236,0.8),0_0_40px_rgba(168,85,247,0.5)] rounded-full"
          />
        </div>

        <div className="space-y-8 md:space-y-12 pl-8 md:pl-0">
          {milestones.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full relative group">
                <TiltCard className="p-6 md:p-10 ml-6 md:ml-0 h-full border border-white/5 group-hover:border-purple-500/30 transition-colors duration-500" rounded="rounded-2xl" scaleOnHover={1.02} rotateAmplitude={5}>
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/5 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-full border border-white/10 text-[9px] md:text-xs text-purple-300 font-mono tracking-widest uppercase max-w-[120px] text-center">
                    {item.year}
                  </div>
                  <h3 className="text-lg md:text-3xl font-bold text-white mb-2 md:mb-4 mt-1 pr-24 md:pr-32">{item.title}</h3>
                  <p className="text-white/60 text-xs md:text-base leading-relaxed">{item.desc}</p>
                </TiltCard>
                
                {/* Mobile Dot Connection */}
                <div className="absolute left-[-42px] top-1/2 -translate-y-1/2 md:hidden z-10 w-8 h-8 rounded-full border border-white/20 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                </div>
              </div>
              
              {/* Desktop Center Dot */}
              <div className="hidden md:flex relative z-10 flex-shrink-0 w-12 h-12 rounded-full border border-white/20 bg-black items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                 <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
              </div>
              
              <div className="flex-1 hidden md:block" /> 
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Team Section */}
      <div className="mt-20 lg:mt-28 mb-20 lg:mb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Team</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">Meet the passionate individuals driving innovation and excellence at CRACKED Digital.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
          {team && team.length > 0 ? (
            team.map((member) => (
              <TeamCard
                key={member.id}
                name={member.name}
                role={member.role}
                image={member.image}
                linkedin={member.linkedin}
                email={member.email}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/50">No team members added yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 md:mt-24 p-6 md:p-12 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden group max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">Join the Core Team</h3>
        <p className="text-white/50 mb-6 md:mb-8 max-w-lg mx-auto text-sm md:text-base">We are always looking for designers, developers, and visionaries. If you have the drive, we have the platform.</p>
        <LiquidButton 
          onClick={() => window.open(settings?.whatsappLink || 'https://chat.whatsapp.com', '_blank')}
          className="px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base text-white font-semibold mx-auto"
        >
          Apply Now
        </LiquidButton>
      </div>
    </div>
  );
};
