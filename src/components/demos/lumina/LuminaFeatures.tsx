import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

// --- Glitch Text Component ---
const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative group inline-block">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#ff00ff] opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] group-hover:translate-y-[-2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#00ffff] opacity-0 group-hover:opacity-70 group-hover:translate-x-[-2px] group-hover:translate-y-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </div>
  );
};

// --- Holographic Prism Card ---
const PrismCard = ({ title, description, icon, color }: { title: string, description: string, icon: string, color: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * 32.5;
    const mouseY = (e.clientY - rect.top) * 32.5;

    const rX = (mouseY / height - 32.5 / 2) * -1;
    const rY = (mouseX / width - 32.5 / 2);

    x.set(rX);
    y.set(rY);
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
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-96 w-full rounded-xl bg-white/5 border border-white/10 p-8 group overflow-hidden"
    >
      <div 
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center text-center"
      >
         <div className="mb-6 text-6xl">{icon}</div>
         <h3 className={`text-3xl font-bold mb-4 ${color} uppercase tracking-widest`}>
            <GlitchText text={title} />
         </h3>
         <p className="text-white/60 leading-relaxed font-light">
            {description}
         </p>
      </div>
      
      {/* Neon Glow Borders */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 ${color.replace('text', 'border')} box-border rounded-xl blur-sm mix-blend-screen pointer-events-none`} />
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${color.replace('text-[', '').replace(']', '')}/20 pointer-events-none`} />
    </motion.div>
  );
};

export const LuminaFeatures = () => {
  return (
    <section className="py-32 relative bg-[#050505] overflow-hidden">
        {/* Section Header */}
        <div className="container mx-auto px-6 mb-24 relative z-10">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff]">MODULES</span>
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>

        {/* Feature Grid */}
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 perspective-1000">
            <PrismCard 
                title="LIQUID CORE" 
                description="Advanced WebGL fluid simulation engine that reacts to user input in real-time."
                icon="💧"
                color="text-[#00ffff]"
            />
            <PrismCard 
                title="NEON SYNC" 
                description="Dynamic lighting system that synchronizes with audio and scroll velocity."
                icon="⚡"
                color="text-[#ccff00]" 
            />
            <PrismCard 
                title="VOID MESH" 
                description="3D distortion fields that warp content based on interaction intensity."
                icon="🕸️"
                color="text-[#ff00ff]"
            />
        </div>
        
        {/* Background Grid - Prismatic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
    </section>
  );
};
