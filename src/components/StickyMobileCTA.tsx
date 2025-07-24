import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, X } from "lucide-react";

export const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrolled = window.scrollY > heroHeight * 0.5;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const scrollToForm = () => {
    const formSection = document.querySelector('#lead-capture');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-cinzel font-bold text-primary text-sm mb-1">
                  Begin Your Journey
                </p>
                <p className="font-orbitron text-xs text-muted-foreground">
                  Join the digital sovereigns
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={scrollToForm}
                  size="sm"
                  className="font-orbitron text-xs px-4 flame-glow"
                >
                  <Flame className="w-3 h-3 mr-1" />
                  Apply Now
                </Button>
                
                <Button
                  onClick={() => setIsDismissed(true)}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};