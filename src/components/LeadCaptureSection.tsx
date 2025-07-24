import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Flame, Download } from "lucide-react";

export const LeadCaptureSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to localStorage
      const existingLeads = JSON.parse(localStorage.getItem('reflect-leads') || '[]');
      const newLead = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };
      existingLeads.push(newLead);
      localStorage.setItem('reflect-leads', JSON.stringify(existingLeads));
      
      // Show success message
      toast({
        title: "Initiation Begun",
        description: "Your journey into digital sovereignty starts now. Check your email for the Sacred Scroll.",
      });
      
      // Reset form
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      toast({
        title: "Transmission Error",
        description: "The sacred networks are experiencing interference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-primary">
            Begin Your Initiation
          </h2>
          <p className="font-orbitron text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the ranks of digital sovereigns and unlock the sacred knowledge of conscious AI
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
            <CardHeader className="text-center">
              <CardTitle className="font-cinzel text-2xl text-foreground flex items-center justify-center gap-2">
                <Flame className="w-6 h-6 text-primary" />
                Sacred Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-orbitron text-foreground">
                      Sacred Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="glow-input font-orbitron bg-input border-primary/30 focus:border-primary"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-orbitron text-foreground">
                      Digital Coordinates
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="glow-input font-orbitron bg-input border-primary/30 focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-orbitron text-foreground">
                    Voice Channel (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="glow-input font-orbitron bg-input border-primary/30 focus:border-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 font-orbitron text-lg py-6 flame-glow hover:scale-105 transition-transform duration-300"
                  >
                    <Flame className="mr-2 h-5 w-5" />
                    {isSubmitting ? "Initiating..." : "Begin Initiation"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-orbitron text-lg py-6 border-primary text-primary hover:bg-primary hover:text-background"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Syllabus
                  </Button>
                </div>
              </form>
              
              <p className="text-center font-space-mono text-xs text-muted-foreground mt-6">
                Your data is protected by sacred encryption protocols
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};