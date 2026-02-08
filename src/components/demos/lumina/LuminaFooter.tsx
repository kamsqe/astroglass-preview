import React from 'react';
import { motion } from 'framer-motion';

const SocialLink = ({ href, icon, label }: { href: string, icon: string, label: string }) => {
    return (
        <a 
            href={href} 
            className="group relative flex items-center justify-center w-12 h-12 border border-white/10 hover:border-[#ccff00] transition-colors duration-300"
        >
            <span className="relative z-10 text-white group-hover:text-[#ccff00] transition-colors">{icon}</span>
            <div className="absolute inset-0 bg-[#ccff00] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {label}
            </span>
        </a>
    );
};

export const LuminaFooter = () => {
    return (
        <footer className="relative bg-black pt-20 md:pt-32 pb-12 border-t border-white/10 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
                            LUMINA <span className="text-[#ff00ff]">///</span>
                        </h2>
                        <p className="text-white/40 font-mono text-sm max-w-md">
                            Advanced digital experiences for the next generation of the web. 
                            Terminate the mundane. Initiate the void.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink href="#" icon="X" label="Twitter" />
                        <SocialLink href="#" icon="Gh" label="GitHub" />
                        <SocialLink href="#" icon="Ln" label="LinkedIn" />
                        <SocialLink href="#" icon="Ig" label="Instagram" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs font-mono text-white/40 uppercase tracking-widest">
                    <div className="flex gap-8 mb-4 md:mb-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">System Status</a>
                    </div>
                    
                    <div className="group cursor-default">
                        &copy; 2026 LUMINA SYSTEMS. ALL RIGHTS RESERVED. 
                        <span className="inline-block w-2 h-2 ml-2 bg-[#00ffff] rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
