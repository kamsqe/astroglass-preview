import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform } from 'framer-motion';

const NavLink = ({ href, label, index }: { href: string, label: string, index: number }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <a 
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative px-4 py-2 group"
        >
            <span className="relative z-10 text-xs font-mono tracking-widest uppercase text-white/70 group-hover:text-[#ccff00] transition-colors duration-300">
                {label}
            </span>
            
            {/* Hover Glitch Effect */}
            <span className="absolute inset-0 text-xs font-mono tracking-widest uppercase text-[#ff00ff] opacity-0 group-hover:opacity-50 transition-opacity duration-100 translate-x-[1px] translate-y-[-1px]">
                {label}
            </span>
            
            {/* Active Indicator */}
            <motion.div 
                className="absolute bottom-0 left-0 h-[1px] bg-[#ccff00]"
                initial={{ width: 0 }}
                animate={{ width: hovered ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
            />
        </a>
    );
};

export const LuminaNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { label: 'System', href: '#' },
        { label: 'Modules', href: '#' },
        { label: 'Shards', href: '#' },
        { label: 'Access', href: '#' },
        { label: 'Signal', href: '#' },
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}
            >
                <div className="container mx-auto px-6">
                    <div className={`relative backdrop-blur-md border border-white/10 rounded-full flex items-center justify-between px-8 transition-all duration-500 ${scrolled ? 'bg-black/80 h-16' : 'bg-white/5 h-20'}`}>
                        
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ccff00] to-[#00ffff] animate-pulse-slow" />
                            <span className="font-bold tracking-tighter text-white text-xl">LUMINA</span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2">
                            {links.map((link, i) => (
                                <NavLink key={i} {...link} index={i} />
                            ))}
                        </div>

                        {/* CTA & Mobile Toggle */}
                        <div className="flex items-center gap-4">
                            <button className="hidden md:block px-6 py-2 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Initialize
                            </button>
                            
                            <button 
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
                            >
                                <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }} className="w-6 h-0.5 bg-white origin-center" />
                                <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="w-6 h-0.5 bg-white" />
                                <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }} className="w-6 h-0.5 bg-white origin-center" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-40 bg-black/90 flex items-center justify-center"
                    >
                         <div className="flex flex-col gap-8 text-center">
                            {links.map((link, i) => (
                                <motion.a 
                                    key={i}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-4xl font-black text-white hover:text-[#ccff00] tracking-tighter uppercase"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
