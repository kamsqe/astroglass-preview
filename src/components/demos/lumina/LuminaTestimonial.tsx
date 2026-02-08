import React from 'react';
import { motion } from 'framer-motion';

const EchoCard = ({ quote, author, role, delay }: { quote: string, author: string, role: string, delay: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.8 }}
            className="group relative p-8 border-l-2 border-white/10 hover:border-[#ccff00] transition-colors duration-300 bg-white/5 backdrop-blur-sm"
        >
            {/* Audio Wave Visual (Decorative) */}
            <div className="absolute top-8 right-8 flex gap-1 items-end h-8">
                {[...Array(5)].map((_, i) => (
                    <motion.div 
                        key={i}
                        className="w-1 bg-[#ccff00]"
                        animate={{ height: [10, 30, 10] }}
                        transition={{ 
                            duration: 0.5 + Math.random() * 0.5, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <p className="text-xl md:text-2xl text-white/80 font-light italic mb-8 relative z-10 group-hover:text-white transition-colors">
                "{quote}"
            </p>
            
            <div>
                <h4 className="text-[#00ffff] font-bold tracking-widest uppercase text-sm group-hover:text-[#ff00ff] transition-colors">{author}</h4>
                <span className="text-white/40 text-xs font-mono">{role}</span>
            </div>

            {/* Signal Noise Overlay */}
            <div className="absolute inset-0 bg-noise opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300 mix-blend-overlay"></div>
        </motion.div>
    );
};

export const LuminaTestimonial = () => {
    return (
        <section className="py-20 md:py-32 relative bg-[#050505] overflow-hidden">
             {/* Background Gradient */}
             <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-[#ff00ff]/10 to-transparent pointer-events-none" />

             <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-16">
                 <div className="md:w-1/3">
                     <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
                         VOX <br/>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00ffff]">POPULI</span>
                     </h2>
                     <p className="text-white/60 font-mono text-sm leading-relaxed">
                         Incoming transmissions from the void. Decrypted user feedback from the liquid network.
                     </p>
                 </div>

                 <div className="md:w-2/3 grid grid-cols-1 gap-8">
                     <EchoCard 
                        quote="The fluid dynamics engine completely changed how we visualize data. It's not just a website, it's a living organism."
                        author="Sarah K."
                        role="Lead Designer, Cyberdyne"
                        delay={0}
                     />
                     <EchoCard 
                        quote="I've never seen performance like this with such heavy WebGL implementation. Optimization is on another level."
                        author="Marcus R."
                        role="CTO, Nexus Corp"
                        delay={0.2}
                     />
                     <EchoCard 
                        quote="Lumina isn't a theme. It's a statement. Our conversion rates doubled simply because people couldn't stop playing with the hero section."
                        author="Elena V."
                        role="Product Owner, Zenith"
                        delay={0.4}
                     />
                 </div>
             </div>
        </section>
    );
};
