import React from 'react';
import { Sparkles, Twitter, Linkedin, Instagram, Mail, MapPin, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { LiquidButton } from '../common/LiquidButton';

export const Footer = ({ setActivePage }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050505] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: CTA & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20 border-b border-white/5 pb-10">
          <div className="max-w-xl">
             <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Ready to crack the code?</h3>
             <p className="text-white/50 text-base leading-relaxed">Join 1500+ developers receiving the latest tech opportunities, event updates, and resources directly in their inbox.</p>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
             <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-sans"
             />
             <LiquidButton className="w-full sm:w-auto whitespace-nowrap px-8 py-4 text-white font-medium">
                Subscribe <ArrowRight className="ml-2 w-4 h-4" />
             </LiquidButton>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16 mb-20">
            
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2 space-y-6">
                 <div className="inline-flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">Cracked Digital</h3>
                  </div>
                  <p className="text-white/40 text-sm leading-7 max-w-sm">
                    Central India's premier tech ecosystem. We are bridging the gap between talent and opportunity through high-impact events, hackathons, and mentorship.
                  </p>
                  
                  <div className="flex gap-3">
                      <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all group">
                          <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all group">
                          <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all group">
                          <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all group">
                          <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                  </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-6">
                <h4 className="text-white font-semibold tracking-wide">Explore</h4>
                <ul className="space-y-4">
                    <li><button onClick={() => setActivePage('home')} className="text-white/50 hover:text-purple-400 text-sm transition-colors">Home</button></li>
                    <li><button onClick={() => setActivePage('events')} className="text-white/50 hover:text-purple-400 text-sm transition-colors">Events</button></li>
                    <li><button onClick={() => setActivePage('about')} className="text-white/50 hover:text-purple-400 text-sm transition-colors">Our Story</button></li>
                    <li><button onClick={() => setActivePage('hire')} className="text-white/50 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">Hire Talent <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">New</span></button></li>
                </ul>
            </div>

            <div className="space-y-6">
                <h4 className="text-white font-semibold tracking-wide">Community</h4>
                <ul className="space-y-4">
                    <li><a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Join WhatsApp</a></li>
                    <li><a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Discord Server</a></li>
                    <li><a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Code of Conduct</a></li>
                    <li><a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Feedback</a></li>
                </ul>
            </div>

            <div className="space-y-6">
                <h4 className="text-white font-semibold tracking-wide">Contact</h4>
                <ul className="space-y-4">
                    <li>
                        <a href="mailto:hello@cracked.digital" className="text-white/50 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">
                           <Mail className="w-3.5 h-3.5" /> hello@cracked.digital
                        </a>
                    </li>
                    <li>
                        <span className="text-white/50 text-sm flex items-start gap-2">
                           <MapPin className="w-3.5 h-3.5 mt-1 shrink-0" /> 
                           Indore, Madhya Pradesh<br/>India
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
            <p className="text-white/30 text-xs">
                &copy; {currentYear} Cracked Digital. All rights reserved.
            </p>
            <div className="flex gap-6">
                <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Terms of Service</a>
                <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Cookie Policy</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
