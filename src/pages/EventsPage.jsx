import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';
import { LiquidCard } from '../components/common/LiquidCard';
import { LiquidButton } from '../components/common/LiquidButton';
import { useData } from '../context/DataContext';

export const EventsPage = ({ onEventSelect }) => {
    const { events, ongoingEvents, upcomingEvents, pastEvents } = useData();

    const EventCard = ({ evt, isOngoing = false }) => (
        <motion.div 
            layoutId={`event-${evt.id}`}
            onClick={() => onEventSelect(evt)}
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 35,
                mass: 1
            }}
            className="cursor-pointer h-full"
            style={{ willChange: "transform" }}
        >
            <LiquidCard className={`group aspect-[4/5] h-full`} rounded="rounded-3xl">
                {/* Image */}
                <motion.div 
                    className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ willChange: 'transform' }}
                >
                    <img 
                        src={evt.images[0]} 
                        alt={evt.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 opacity-80">
                        <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest border border-white/10 px-2 py-1 rounded-full backdrop-blur-md ${
                            evt.type === 'Upcoming' ? 'bg-purple-950/50 text-purple-300 border-purple-500/30' : 
                            evt.type === 'Ongoing' ? 'bg-green-950/50 text-green-400 border-green-500/30 animate-pulse' :
                            'bg-black/50 text-white/60'
                        }`}>
                            {evt.type}
                        </span>
                        <span className="text-white/50 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider">
                            {evt.date ? new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                        </span>
                    </div>
                    
                    <h4 className={`font-medium text-white mb-2 tracking-tight leading-none group-hover:text-purple-200 transition-colors duration-300 text-lg sm:text-2xl`}>
                        {evt.title}
                    </h4>

                    <div className="flex items-center gap-4 mt-2 sm:mt-4">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0">
                            Explore <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </LiquidCard>
        </motion.div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 pt-0 pb-20">
            <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-12">
                <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Events</h2>
                <span className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-widest hidden sm:block">Bridging Online & Offline</span>
            </div>

            <div className="space-y-20">
                {/* 1. Ongoing Events */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                        <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">Ongoing Events</h3>
                        {ongoingEvents.length > 0 && <span className="text-green-400/70 text-sm ml-2">(Registration open)</span>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                        {ongoingEvents.length > 0 ? (
                            ongoingEvents.map(evt => (
                                <EventCard key={evt.id} evt={evt} isOngoing={true} />
                            ))
                        ) : (
                            <div>
                                <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center p-8">
                                        <p className="text-white/50 text-lg md:text-xl font-light tracking-tight">No ongoing event.</p>
                                        <p className="text-white/30 text-sm mt-2">Stay tuned!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. Upcoming Events */}
                {upcomingEvents.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">Upcoming Events</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {upcomingEvents.map(evt => (
                                <EventCard key={evt.id} evt={evt} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. Past Events */}
                {pastEvents.length > 0 && (
                     <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl md:text-2xl font-medium text-white/60 tracking-tight">Past Events</h3>
                            <div className="h-px bg-white/10 flex-grow ml-4"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 opacity-80 hover:opacity-100 transition-opacity">
                            {pastEvents.map(evt => (
                                <EventCard key={evt.id} evt={evt} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
