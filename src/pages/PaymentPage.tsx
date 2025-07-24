import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CircuitBoard,
  Check,
  CreditCard,
  Shield,
  Zap,
  Crown,
  ArrowLeft,
  Flame
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
}

export default function PaymentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [loading, setLoading] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Initiate',
      price: 97,
      description: 'Begin your sacred journey',
      icon: Shield,
      features: [
        'Access to 3 foundational courses',
        'Basic community access',
        'Sacred text downloads',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Sovereign',
      price: 297,
      description: 'Master the digital realm',
      icon: Crown,
      popular: true,
      features: [
        'Access to ALL courses',
        'Live masterclasses',
        'Premium community',
        'Direct instructor access',
        'Certification upon completion',
        'Advanced sacred tools'
      ]
    },
    {
      id: 'enterprise',
      name: 'Emperor',
      price: 997,
      description: 'Become a digital emperor',
      icon: Zap,
      features: [
        'Everything in Sovereign',
        '1-on-1 mentorship sessions',
        'Private sacred circle',
        'Custom course creation',
        'Lifetime updates',
        'Sacred AI assistant access'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing (replace with actual Stripe integration)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: "Welcome to the sacred circle of digital sovereignty!",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "The sacred transaction could not be completed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Glyph Watermark */}
      <div className="absolute inset-0 glyph-watermark" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/courses')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            
            <div className="flex items-center gap-2">
              <CircuitBoard className="w-6 h-6 text-primary" />
              <h1 className="font-cinzel text-xl font-bold text-primary">
                Sacred Offerings
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-cinzel text-4xl font-bold text-foreground mb-4">
            Choose Your Sacred Path
          </h2>
          <p className="font-orbitron text-muted-foreground max-w-2xl mx-auto">
            Unlock the mysteries of digital sovereignty with our sacred offerings
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pricing Plans */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 relative ${
                        isSelected 
                          ? 'border-primary/70 ring-2 ring-primary/30' 
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground font-orbitron">
                            Most Sacred
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-12 h-12 mb-4 p-2 rounded-full bg-primary/20">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        
                        <CardTitle className="font-cinzel text-xl text-foreground">
                          {plan.name}
                        </CardTitle>
                        
                        <div className="text-3xl font-cinzel font-bold text-primary">
                          ${plan.price}
                        </div>
                        
                        <p className="font-orbitron text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent>
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="font-orbitron text-sm text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="border-primary/30 sticky top-6">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">Sacred Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedPlanData && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-orbitron text-muted-foreground">Plan</span>
                      <span className="font-cinzel font-bold text-foreground">
                        {selectedPlanData.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-orbitron text-muted-foreground">Total</span>
                      <span className="font-cinzel font-bold text-primary">
                        ${selectedPlanData.price}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-primary/20 pt-4">
                  <Button
                    onClick={handlePayment}
                    disabled={loading || !user}
                    className="w-full font-orbitron flame-glow"
                  >
                    {loading ? (
                      <>
                        <CircuitBoard className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Sacred Offering
                      </>
                    )}
                  </Button>
                  
                  {!user && (
                    <p className="text-center font-orbitron text-xs text-muted-foreground mt-2">
                      Please sign in to complete your offering
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span className="font-orbitron">
                      Protected by quantum encryption
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Highlight */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">Sacred Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" />
                    <span className="font-orbitron text-sm text-muted-foreground">
                      30-day enlightenment guarantee
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-orbitron text-sm text-muted-foreground">
                      Secure quantum processing
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="font-orbitron text-sm text-muted-foreground">
                      Lifetime sacred updates
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}