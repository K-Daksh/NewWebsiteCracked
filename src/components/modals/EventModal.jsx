import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Clock } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { LiquidCard } from '../common/LiquidCard';
import { LiquidButton } from '../common/LiquidButton';
import { ImageSlider } from '../common/ImageSlider';
import { LiquidLayers } from '../common/LiquidCard';

// Event Modal with Liquid Glass - Unified Single Card (SCROLL & LAYOUT FIXED)
export const EventModal = ({ event, onClose }) => {
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
      
      {/* Modal Content - Morph Animation from Card */}
      <motion.div 
        layoutId={`event-${event.id}`}
        className="relative w-full max-w-4xl z-50 flex flex-col h-[80vh] md:h-[85vh] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl"
        style={{ 
          transform: "translateZ(0)",
          willChange: "transform, width, height"
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 35,
          mass: 1
        }}
      >
         {/* Visual Layers */}
         <div className="absolute inset-0 pointer-events-none z-0">
            <LiquidLayers rounded="rounded-3xl" />
         </div>

        {/* Close Button - Fixed Position with proper margins */}
        <div className="absolute top-6 right-6 z-50">
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
                            <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${event.type === 'Upcoming' ? 'bg-cyan-950/30 border-cyan-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-white/50'}`}>
                            {event.type}
                            </span>
                            <span className="text-white/40 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white leading-none">{event.title}</h2>
                    </div>
                    
                    {/* Register button only for Ongoing events */}
                    {event.type === 'Ongoing' && (
                        <div className="shrink-0 mt-4 md:mt-0">
                            <LiquidButton 
                              onClick={() => event.registrationUrl ? window.open(event.registrationUrl, '_blank') : null}
                              className={`px-6 py-3 text-white font-semibold ${!event.registrationUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                              rounded="rounded-xl"
                            >
                                {event.registrationUrl ? 'Register Now' : 'Registration Link Not Set'}
                            </LiquidButton>
                        </div>
                    )}
                </div>
                
                {/* Details & Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="md:col-span-2 prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed">
                        <p>{event.description}</p>
                    </div>
                    <div className="space-y-3">
                        <LiquidCard className="p-4" rounded="rounded-xl">
                            <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-purple-400"/> Location</h4>
                            <p className="text-white/50 text-sm">{event.location || 'TBA'}</p>
                        </LiquidCard>
                        <LiquidCard className="p-4" rounded="rounded-xl">
                            <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2"><Users className="w-3.5 h-3.5 text-purple-400"/> Capacity</h4>
                            <p className="text-white/50 text-sm">{event.capacity || 'TBA'}</p>
                        </LiquidCard>
                        <LiquidCard className="p-4" rounded="rounded-xl">
                            <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-purple-400"/> Date</h4>
                            <p className="text-white/50 text-sm">{event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</p>
                        </LiquidCard>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
