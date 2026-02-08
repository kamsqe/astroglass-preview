import React, { useRef } from 'react';
import { useScroll, useTransform, motion, useSpring, useMotionValue } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';

// --- Shared Components ---
const MagneticImage = ({ src, alt }: { src: string, alt: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.1);
        y.set((e.clientY - centerY) * 0.1);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div 
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className="relative overflow-hidden group cursor-none"
        >
             <div className="absolute inset-0 bg-transparent z-10"></div> {/* Hit area */}
             <motion.img 
                src={src} 
                alt={alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 filter url(#meltFilter)"
                style={{
                     filter: 'url(#meltFilter) grayscale(100%)',
                }}
             />
             <div className="absolute inset-0 bg-[#00ffff] mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        </motion.div>
    );
};

const StatItem = ({ label, value, delay }: { label: string, value: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        className="text-center"
    >
        <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent lumina-melt-text tracking-tighter">
            {value}
        </div>
        <div className="text-[#ff00ff] font-mono uppercase tracking-widest mt-2 text-sm">{label}</div>
    </motion.div>
);

export const LuminaAbout = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    // Simple touch check
    const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;

    return (
        <section ref={containerRef} className="py-20 md:py-32 relative overflow-hidden bg-[#050505]">
             {/* Background Noise/Grid inherited from global CSS or hero if contiguous, but adding local for safety */}
             <div className="absolute inset-0 lumina-noise opacity-30"></div>
             
             <div className="container mx-auto px-6 relative z-10">
                 {/* Kinetic Header */}
                 <div className="mb-24 md:mb-32 overflow-hidden">
                     <motion.h2 style={{ x: isTouch ? 0 : x1 }} className="text-[18vw] md:text-[15vw] leading-[0.8] font-black text-white/5 whitespace-nowrap select-none">
                         WE ARE THE VOID
                     </motion.h2>
                     <motion.h2 style={{ x: isTouch ? 0 : x2 }} className="text-[18vw] md:text-[15vw] leading-[0.8] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-transparent whitespace-nowrap select-none -mt-8 md:-mt-24 mix-blend-overlay">
                         WE ARE LIQUID
                     </motion.h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
                     <div className="space-y-8 order-2 md:order-1">
                         <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                             Redefining Digital <br/>
                             <span className="text-[#ff00ff]">Existence.</span>
                         </h3>
                         <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                             We don't build websites. We construct digital hallucinations. 
                             Using advanced WebGL fluids and kinetic typography, we break the barrier between user and interface.
                         </p>
                         <ul className="space-y-4 font-mono text-sm text-[#00ffff]">
                             <li className="flex items-center gap-4">
                                 <span className="w-2 h-2 bg-[#ccff00] rounded-full"></span>
                                 WEBGL FLUID SIMULATION
                             </li>
                             <li className="flex items-center gap-4">
                                 <span className="w-2 h-2 bg-[#ff00ff] rounded-full"></span>
                                 INTERACTIVE PHYSICS
                             </li>
                             <li className="flex items-center gap-4">
                                 <span className="w-2 h-2 bg-[#00ffff] rounded-full"></span>
                                 GENERATIVE AUDIO
                             </li>
                         </ul>
                     </div>

                     <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
                         {/* Abstract "Team" placeholders */}
                         <MagneticImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="Team 1" />
                         <div className="mt-12">
                            <MagneticImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80" alt="Team 2" />
                         </div>
                     </div>
                 </div>

                 {/* Floating Stats */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-12 md:pt-20">
                     <StatItem value="100+" label="Projects" delay={0} />
                     <StatItem value="45" label="Awards" delay={0.2} />
                     <StatItem value="9.9" label="Rating" delay={0.4} />
                     <StatItem value="∞" label="Possibilities" delay={0.6} />
                 </div>
             </div>
        </section>
    );
};
