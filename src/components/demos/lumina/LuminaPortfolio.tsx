import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// --- Shard Component ---
// Represents a single project as a jagged shard that "heals" (expands/rectifies) on hover.
const Shard = ({ image, title, category, index }: { image: string, title: string, category: string, index: number }) => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;
    
    // Randomize initial shard shapeclip-path
    // We use a polygon that looks "broken" initially
    const polygons = [
        "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)", // Octagon-ish (Healed state)
        "polygon(10% 0%, 90% 10%, 100% 90%, 80% 100%, 0% 80%)", // Random broken 1 
        "polygon(0% 10%, 80% 0%, 100% 80%, 20% 100%)", // Random broken 2
        "polygon(20% 0%, 100% 20%, 80% 100%, 0% 80%)", // Random broken 3
    ];
    
    // Deterministic "random" based on index
    const initialCloudShape = polygons[(index % 3) + 1]; 
    const healedShape = polygons[0];

    return (
        <motion.div 
            className="relative h-[400px] w-full group cursor-pointer"
            initial="broken"
            whileHover={!isTouch ? "healed" : undefined}
            whileInView={isTouch ? "healed" : undefined}
            viewport={{ once: false, margin: "-100px" }}
        >
            {/* The Image Container with Clip Path */}
            <motion.div 
                className="w-full h-full relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500"
                variants={{
                    broken: { clipPath: initialCloudShape, filter: 'grayscale(100%) brightness(0.7)' },
                    healed: { clipPath: healedShape, filter: 'grayscale(0%) brightness(1)' }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <img src={image} alt={title} className="w-full h-full object-cover transform scale-125 group-hover:scale-100 transition-transform duration-700" />
                
                {/* Overlay Gradient/Scanline */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Floating Info (Only visible on heal) */}
            <motion.div 
                className="absolute bottom-8 left-8 z-20"
                variants={{
                    broken: { opacity: 0, y: 20 },
                    healed: { opacity: 1, y: 0 }
                }}
            >
                <span className="text-[#ccff00] font-mono text-xs tracking-widest uppercase mb-2 block">{category}</span>
                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">{title}</h3>
            </motion.div>
            
            {/* Decorative Glitch Border */}
             <motion.div 
                className="absolute inset-0 border-2 border-[#00ffff] opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                variants={{
                    broken: { clipPath: initialCloudShape },
                    healed: { clipPath: healedShape }
                }}
            />
        </motion.div>
    );
}

export const LuminaPortfolio = () => {
    // Parallax effect for columns
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'end start']
    });
    
    // Disable parallax Y offset on touch devices
    const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;
    const y1 = useTransform(scrollYProgress, [0, 1], [0, isTouch ? 0 : -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, isTouch ? 0 : 100]);

    const projects = [
        { title: "Neon City", category: "Cyber Architecture", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=600&q=80" },
        { title: "Void Walker", category: "Digital Fashion", image: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=600&q=80" },
        { title: "Chrome Heart", category: "3D Motion", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
        { title: "Liquid Soul", category: "Generative Art", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80" },
    ];

    return (
        <section ref={container} className="py-32 relative bg-[#050505] overflow-hidden">
             {/* Background noise/elements */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ccff00] rounded-full mix-blend-difference blur-[120px] opacity-20 pointer-events-none animate-pulse" />

             <div className="container mx-auto px-6 relative z-10">
                 <h2 className="text-6xl md:text-8xl font-black text-white mb-24 tracking-tighter text-right">
                     DIMENSIONAL <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#ccff00] to-[#00ffff]">SHARDS</span>
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                     {/* Odd Column - Moves Up */}
                     <motion.div style={{ y: y1 }} className="flex flex-col gap-12">
                         {projects.filter((_, i) => i % 2 === 0).map((p, i) => (
                             <Shard key={i} index={i * 2} {...p} />
                         ))}
                     </motion.div>

                     {/* Even Column - Moves Down */}
                     <motion.div style={{ y: y2 }} className="flex flex-col gap-12 mt-24 md:mt-0">
                         {projects.filter((_, i) => i % 2 !== 0).map((p, i) => (
                             <Shard key={i} index={i * 2 + 1} {...p} />
                         ))}
                     </motion.div>
                 </div>
             </div>
        </section>
    );
};
