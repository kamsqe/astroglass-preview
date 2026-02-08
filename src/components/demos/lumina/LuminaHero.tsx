import React, { useRef, useState, useEffect } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';

// --- SVG Filters & Effects ---
const LiquidFilters = () => (
    <svg className="hidden">
        <defs>
            <filter id="meltFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed="0">
                    <animate attributeName="baseFrequency" dur="10s" values="0.02;0.05;0.02" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
            </filter>
            
            <filter id="liquidGoo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
        </defs>
    </svg>
);

// --- Particle System ---
const ParticleDust = () => {
    const particles = Array.from({ length: 20 });
    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                    initial={{ 
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        scale: 0
                    }}
                    animate={{ 
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// --- Magnetic Button ---
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        // Attract
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button 
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x, y }}
            className={className}
        >
            {children}
        </motion.button>
    )
};

// --- Interactive Background ---
const InteractiveBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
    const x1 = useSpring(mouseX, springConfig);
    const y1 = useSpring(mouseY, springConfig);
    
    // Delayed/Opposite movement
    const x2 = useSpring(useTransform(mouseX, value => value * -0.5 + (typeof window !== 'undefined' ? window.innerWidth/2 : 0)), { ...springConfig, damping: 20 });
    const y2 = useSpring(useTransform(mouseY, value => value * -0.5 + (typeof window !== 'undefined' ? window.innerHeight/2 : 0)), { ...springConfig, damping: 20 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none filter url(#liquidGoo)">
             <motion.div 
                style={{ x: x1, y: y1, translateX: '-50%', translateY: '-50%' }}
                className="absolute w-[800px] h-[800px] bg-[#ff00ff] rounded-full mix-blend-screen opacity-40 blur-[80px]"
             />
             <motion.div 
                style={{ x: x2, y: y2, translateX: '-50%', translateY: '-50%' }}
                className="absolute w-[600px] h-[600px] bg-[#00ffff] rounded-full mix-blend-screen opacity-40 blur-[60px]"
             />
        </div>
    );
};

const Cursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        
        const handleHover = () => setIsHovering(true);
        const handleLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleLeave);
        });

        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div ref={cursorRef} className={`lumina-cursor ${isHovering ? 'hovering' : ''}`} />
    );
};

const KineticText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
    return (
        <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
            className="text-[18vw] md:text-[12vw] font-black leading-none tracking-tighter mix-blend-difference z-20"
        >
            <span className="lumina-melt-text inline-block cursor-pointer select-none">
                {text}
            </span>
        </motion.h1>
    )
}

export const LuminaHero = ({ 
  title = "Lumina", 
  subtitle = "Experience the next generation of glassmorphism.",
  ctaPrimary = "Get Started",
  ctaSecondary = "Learn More"
}: {
  title?: string,
  subtitle?: string,
  ctaPrimary?: string,
  ctaSecondary?: string
}) => {
    // --- Scroll Skew Logic ---
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const skew = useSpring(useTransform(scrollVelocity, [-2000, 2000], [10, -10]), { 
        mass: 0.1, 
        stiffness: 800, 
        damping: 30 
    });

    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }, []);

  return (
    <ParallaxProvider>
      <div className="lumina-void-bg min-h-screen md:min-h-[200vh] text-white selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
        <LiquidFilters />
        <Cursor />
        <ParticleDust />
        <div className="lumina-noise"></div>
        
        {!isTouch && <InteractiveBackground />}

        {/* Global Content Skew Container */}
        <motion.div style={{ skewY: isTouch ? 0 : skew }} className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-4 origin-center">
            
            <KineticText text="LIQUID" />
            <KineticText text="NEON" delay={0.1} />
            <KineticText text="CHAOS" delay={0.2} />

            <div className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
                 <div className="p-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-none hover:bg-white/10 transition-colors group transform md:hover:rotate-y-[-5deg] transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2 text-[#00ffff] lumina-glitch">VIBRANT ENERGY</h3>
                    <p className="text-white/60 group-hover:text-white transition-colors">
                        High saturation, high contrast. A visual shock to the system designed to grab attention immediately.
                    </p>
                 </div>
                 
                 <div className="p-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-none hover:bg-white/10 transition-colors group text-left md:text-right transform md:hover:rotate-y-[5deg] transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2 text-[#ff00ff] lumina-glitch">MELTING FORMS</h3>
                    <p className="text-white/60 group-hover:text-white transition-colors">
                        Typography that dissolves and rebuilds. Structure is only a suggestion in this fluid reality.
                    </p>
                 </div>
            </div>
            
            <div className="mt-20 flex gap-8">
                <MagneticButton className="px-8 md:px-12 py-4 bg-[#ccff00] text-black font-black text-lg md:text-xl uppercase tracking-widest hover:scale-105 md:hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_#ccff00]">
                    {ctaPrimary}
                </MagneticButton>
            </div>
        </motion.div>
      </div>
    </ParallaxProvider>
  );
};

export default LuminaHero;
