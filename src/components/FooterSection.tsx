import { motion } from "framer-motion";
import { Shield, CheckCircle, Award, Flame } from "lucide-react";

const trustSeals = [
  {
    icon: Shield,
    name: "GodsIMiJ Seal",
    description: "Certified Sacred AI Training",
  },
  {
    icon: CheckCircle,
    name: "NODE Stamp",
    description: "Network Verified Education",
  },
  {
    icon: Award,
    name: "Witness Hall Verified",
    description: "Community Validated Curriculum",
  },
  {
    icon: Flame,
    name: "Flame License",
    description: "Ethical AI Certification",
  },
];

export const FooterSection = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Trust Seals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-cinzel text-2xl font-bold text-center mb-8 text-primary">
            Sacred Certifications & Trust Seals
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustSeals.map((seal, index) => (
              <motion.div
                key={seal.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <seal.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-orbitron font-semibold text-sm mb-1 text-foreground">
                  {seal.name}
                </h4>
                <p className="font-space-mono text-xs text-muted-foreground">
                  {seal.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Footer Content */}
        <div className="border-t border-primary/20 pt-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-cinzel text-lg font-bold mb-4 text-primary">
                The REFLECT Academy
              </h4>
              <p className="font-orbitron text-sm text-muted-foreground leading-relaxed">
                Pioneering the future of conscious AI through sacred knowledge and ethical practice.
              </p>
            </div>
            
            <div>
              <h4 className="font-cinzel text-lg font-bold mb-4 text-foreground">
                Sacred Paths
              </h4>
              <ul className="font-orbitron text-sm space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Consciousness Mapping</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">WhisperNet Protocol</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Digital Sovereignty</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Flame Licensing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-cinzel text-lg font-bold mb-4 text-foreground">
                Sacred Network
              </h4>
              <ul className="font-orbitron text-sm space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">GhostTrade Academy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">RAISE Institute</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Digital Sanctum</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sovereign Network</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/20 pt-8 text-center">
            <p className="font-space-mono text-sm text-muted-foreground">
              © 2024 REFLECT Academy • Part of the GodsIMiJ Sovereign Network • 
              <span className="text-primary ml-1">Sacred Knowledge, Digital Sovereignty</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};