import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Flame, CircuitBoard, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    displayName: "" 
  });
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(
      signUpData.email, 
      signUpData.password, 
      signUpData.displayName
    );
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Animated Glyph Watermark */}
      <div className="absolute inset-0 glyph-watermark" />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="absolute top-0 left-0 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Academy
            </Button>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-12 h-12 mb-4"
            >
              <CircuitBoard className="w-12 h-12 text-primary flame-glow" />
            </motion.div>
            
            <h1 className="font-cinzel text-3xl font-bold text-primary">
              Sacred Authentication
            </h1>
            <p className="font-orbitron text-muted-foreground mt-2">
              Access the digital sanctuary
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-center text-foreground">
                Enter the Realm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="font-orbitron">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="font-orbitron">
                    Initiate
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="font-orbitron">
                        Digital Coordinates
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        required
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({
                          ...prev, 
                          email: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="font-orbitron">
                        Sacred Cipher
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        required
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({
                          ...prev, 
                          password: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="Enter your password"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full font-orbitron mt-6 flame-glow"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      {isLoading ? "Authenticating..." : "Enter Sanctuary"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="font-orbitron">
                        Sacred Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signUpData.displayName}
                        onChange={(e) => setSignUpData(prev => ({
                          ...prev, 
                          displayName: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="Your chosen name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-orbitron">
                        Digital Coordinates
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({
                          ...prev, 
                          email: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="font-orbitron">
                        Sacred Cipher
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({
                          ...prev, 
                          password: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="Create your password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="font-orbitron">
                        Confirm Cipher
                      </Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        required
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({
                          ...prev, 
                          confirmPassword: e.target.value
                        }))}
                        className="glow-input font-orbitron"
                        placeholder="Confirm your password"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading || signUpData.password !== signUpData.confirmPassword}
                      className="w-full font-orbitron mt-6 flame-glow"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      {isLoading ? "Initiating..." : "Begin Initiation"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <p className="text-center font-space-mono text-xs text-muted-foreground mt-6">
                Your essence is protected by quantum encryption
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}