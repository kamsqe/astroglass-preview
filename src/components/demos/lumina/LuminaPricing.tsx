import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Crystal Card Component ---
const CrystalCard = ({ plan, price, features, color, popular }: { plan: string, price: string, features: string[], color: string, popular?: boolean }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div 
            className="relative h-auto min-h-[500px] md:h-[600px] flex-1 min-w-[300px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            {/* The Crystal Core (Background) */}
            <div className={`absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-md border border-white/10 ${popular ? 'border-t-4 border-t-white' : ''} clip-path-crystal transition-all duration-500 overflow-hidden`}>
                {/* Internal Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 transition-opacity duration-500 ${hovered ? 'opacity-20' : ''}`} />
                
                {/* Energy Pulse Animation */}
                {hovered && (
                    <motion.div 
                        className={`absolute bottom-0 left-0 w-full h-2 ${color} box-shadow-[0_0_20px_${color.split(' ')[1]}]`}
                        animate={{ y: [600, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-8 md:p-10 h-full flex flex-col items-center text-center">
                <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase mb-4">{plan}</h3>
                <div className="text-4xl md:text-5xl font-black mb-8 lumina-melt-text">{price}</div>
                
                <ul className="space-y-4 mb-8 md:mb-auto text-sm font-mono text-white/60">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 justify-center">
                            <span className={`w-1 h-1 ${color.replace('from-', 'bg-').split(' ')[0]} rounded-full`} />
                            {f}
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-4 px-6 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest font-bold text-xs ${popular ? 'bg-white text-black' : 'bg-transparent text-white'} mt-auto`}>
                    Initialize
                </button>
            </div>
            
            {/* Popular Badge */}
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white text-black text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Recommended
                </div>
            )}
        </motion.div>
    );
};

export const LuminaPricing = () => {
    return (
        <section className="py-20 md:py-32 relative bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                 <h2 className="text-5xl md:text-8xl font-black text-white mb-16 md:mb-24 tracking-tighter text-center">
                     CRYSTAL <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff00ff] to-[#ccff00]">ACCESS</span>
                 </h2>

                 <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch perspective-1000">
                     <CrystalCard 
                        plan="Shard" 
                        price="$29" 
                        features={['Basic distortion', '3 Projects', 'Community Support']} 
                        color="from-[#00ffff] to-transparent" 
                     />
                     <CrystalCard 
                        plan="Prism" 
                        price="$99" 
                        features={['Full Physics Engine', 'Unimited Projects', 'Priority Support', '4K Export']} 
                        color="from-[#ff00ff] to-transparent" 
                        popular
                     />
                     <CrystalCard 
                        plan="Void" 
                        price="$299" 
                        features={['Source Code Access', 'White Label', '24/7 Dedicated Support', 'Custom Shaders']} 
                        color="from-[#ccff00] to-transparent" 
                     />
                 </div>
            </div>
            
            <style>{`
                .clip-path-crystal {
                    clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 100%, 0 100%, 0 10%);
                }
            `}</style>
        </section>
    );
};
