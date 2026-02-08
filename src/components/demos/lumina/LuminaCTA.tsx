import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

export const LuminaCTA = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    
    // Magnetic Button Logic
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section ref={containerRef} className="h-screen relative flex items-center justify-center overflow-hidden bg-black">
            {/* The Event Horizon (Swirling Portal) */}
            <motion.div 
                style={{ rotate, scale }}
                className="absolute inset-0 z-0 flex items-center justify-center"
            >
                {/* Core */}
                <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-black border-4 border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] relative">
                     {/* Accretion Disk Layers */}
                     <div className="absolute -inset-10 rounded-full border border-[#ff00ff]/30 blur-md animate-spin-slow" />
                     <div className="absolute -inset-20 rounded-full border border-[#00ffff]/20 blur-xl animate-reverse-spin" />
                     <div className="absolute -inset-32 rounded-full border-2 border-dashed border-[#ccff00]/20 animate-spin-slower" />
                     
                     {/* Particles drawn in */}
                     <div className="absolute inset-0 overflow-hidden rounded-full">
                         <div className="w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-10 relative"></div>
                     </div>
                </div>
            </motion.div>

            {/* Content Singularity */}
            <div className="relative z-10 text-center max-w-4xl px-6 mix-blend-difference">
                <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-none">
                    ENTER THE <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-white to-[#ff00ff]">VOID</span>
                </h2>
                <p className="text-lg md:text-2xl text-white/80 font-light mb-12 max-w-2xl mx-auto">
                    The next evolution of digital experience is waiting. 
                    Cross the horizon.
                </p>
                
                <motion.button
                    ref={ref}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ x, y }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00] to-[#00ffff] rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative px-8 md:px-12 py-4 md:py-6 bg-white rounded-full flex items-center gap-4 text-black font-black tracking-widest uppercase text-base md:text-lg overflow-hidden">
                        <span className="relative z-10">Initialize Project</span>
                        <motion.span 
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            className="text-2xl"
                        >→</motion.span>
                        
                        {/* Button Shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                </motion.button>
            </div>
            
            {/* Overlay Grain */}
            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />
        </section>
    );
};
