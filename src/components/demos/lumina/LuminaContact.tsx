import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Form Input Component with Holographic Focus
const VoidInput = ({ label, type = "text", placeholder }: { label: string, type?: string, placeholder: string }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative group mb-8">
            <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono text-xs uppercase tracking-widest ${focused ? '-top-6 text-[#ccff00]' : 'top-4 text-white/40'}`}>
                {label}
            </label>
            
            {type === 'textarea' ? (
                <textarea 
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-transparent transition-all min-h-[100px] resize-none"
                    onFocus={() => setFocused(true)}
                    onBlur={(e) => setFocused(e.target.value.length > 0)}
                    placeholder={focused ? placeholder : ''}
                />
            ) : (
                <input 
                    type={type}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-transparent transition-all"
                    onFocus={() => setFocused(true)}
                    onBlur={(e) => setFocused(e.target.value.length > 0)}
                    placeholder={focused ? placeholder : ''}
                />
            )}

            {/* Animated Bottom Border (Progress Bar Style) */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#1a1a1a]">
                <motion.div 
                    className="h-full bg-gradient-to-r from-[#ccff00] to-[#00ffff]"
                    initial={{ width: "0%" }}
                    animate={{ width: focused ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />
            </div>
            
            {/* Glitch décor on focus */}
            <AnimatePresence>
                {focused && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#ff00ff] font-mono text-[10px] animate-pulse"
                    >
                        INPUT_ACTIVE
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const LuminaContact = () => {
    return (
        <section className="py-20 md:py-32 relative bg-[#0a0a0a] overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row gap-12 md:gap-24 relative z-10">
                {/* Visual Side */}
                <div className="md:w-1/2">
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        START <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff]">SEQUENCE</span>
                    </h2>
                    <p className="text-white/60 font-mono text-sm leading-relaxed mb-12">
                        Initialize communication protocol. Our liquid network is listening. 
                        Transmission latency: 0.00ms.
                    </p>
                    
                    {/* Decorative Data Block */}
                    <div className="p-8 border border-white/10 bg-white/5 font-mono text-xs text-[#ccff00]/80 h-64 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="mb-2 opacity-50">
                                {`> SYNC_PACKET_${Math.floor(Math.random() * 9999)} [OK]`}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 bg-white/5 p-12 backdrop-blur-md border border-white/10 relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#ccff00]" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#ccff00]" />
                    
                    <form onSubmit={(e) => e.preventDefault()}>
                        <VoidInput label="Identity Code / Name" placeholder="John Doe" />
                        <VoidInput label="Signal Frequency / Email" type="email" placeholder="john@example.com" />
                        <VoidInput label="Transmission Data / Message" type="textarea" placeholder="Tell us about your project..." />
                        
                        <button className="w-full py-6 mt-8 bg-white/10 hover:bg-[#ccff00] hover:text-black border border-white/20 hover:border-transparent text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 group">
                            <span className="group-hover:hidden">Transmit Data</span>
                            <span className="hidden group-hover:inline-block animate-pulse">Sending...</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
