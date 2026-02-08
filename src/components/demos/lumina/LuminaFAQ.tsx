import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, index }: { question: string, answer: string, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-white/10 last:border-0"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 flex justify-between items-center text-left group"
            >
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[#ff00ff] text-xs opacity-50">0{index + 1} //</span>
                    <span className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00ffff] transition-colors">{question}</span>
                </div>
                <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[#ccff00] text-2xl"
                >
                    +
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 pl-12 text-white/60 font-mono text-sm leading-relaxed max-w-3xl">
                            {/* In a real "decrypt" effect we'd scramble this text, but for MVP standard fade is cleaner */}
                            {'>'} {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const LuminaFAQ = () => {
    const faqs = [
        { q: "Is the WebGL engine mobile optimized?", a: "Affirmative. The liquid engine automatically downgrades physics calculations on mobile devices to ensure a smooth 60fps experience without draining battery life." },
        { q: "Can I customize the neon palette?", a: "Access granted. All colors are controlled via CSS variables in the root file. Changing three hex codes will ripple through the entire site instantly." },
        { q: "Does it support server-side rendering?", a: "Partially. The core layout is static (SSR) for SEO, while the fluid components hydrate on the client. It's the perfect hybrid." },
        { q: "What about accessibility?", a: "We strictly follow WCAG 2.1 guidelines. All interactive elements have focus states, and the motion can be disabled via the 'prefers-reduced-motion' media query." },
    ];

    return (
        <section className="py-32 relative bg-[#050505]">
             <div className="container mx-auto px-6 max-w-5xl">
                 <div className="mb-24 text-center">
                     <span className="text-[#ccff00] font-mono tracking-widest text-xs uppercase mb-4 block">System Protocol</span>
                     <h2 className="text-5xl md:text-7xl font-black text-white">
                         FAQ <span className="text-[#ff00ff] opacity-50">DATABASE</span>
                     </h2>
                 </div>

                 <div className="border-t border-white/10">
                     {faqs.map((faq, i) => (
                         <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
                     ))}
                 </div>
             </div>
        </section>
    );
};
