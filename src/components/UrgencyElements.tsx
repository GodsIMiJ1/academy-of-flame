import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame, Users, Clock, AlertTriangle } from "lucide-react";

export const SeatCounter = () => {
  const [seatsLeft, setSeatsLeft] = useState(23);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        setSeatsLeft(prev => Math.max(12, prev - 1));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-2 rounded-lg border border-destructive/30"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Users className="w-4 h-4" />
      <span className="font-orbitron text-sm font-semibold">
        Only {seatsLeft} seats remaining
      </span>
    </motion.div>
  );
};

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          seconds = 59;
          minutes--;
        } else if (hours > 0) {
          seconds = 59;
          minutes = 59;
          hours--;
        } else if (days > 0) {
          seconds = 59;
          minutes = 59;
          hours = 23;
          days--;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-primary" />
        <span className="font-cinzel text-sm font-semibold text-primary">
          Next Initiation Cycle Begins In:
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="bg-primary text-background rounded font-space-mono text-lg font-bold py-2">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="font-orbitron text-xs text-muted-foreground mt-1">Days</div>
        </div>
        <div className="text-center">
          <div className="bg-primary text-background rounded font-space-mono text-lg font-bold py-2">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="font-orbitron text-xs text-muted-foreground mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="bg-primary text-background rounded font-space-mono text-lg font-bold py-2">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="font-orbitron text-xs text-muted-foreground mt-1">Min</div>
        </div>
        <div className="text-center">
          <div className="bg-primary text-background rounded font-space-mono text-lg font-bold py-2">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="font-orbitron text-xs text-muted-foreground mt-1">Sec</div>
        </div>
      </div>
    </div>
  );
};

export const UrgencyBanner = () => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-destructive/20 to-primary/20 border-y border-primary/30 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-5 h-5 text-primary" />
        </motion.div>
        <span className="font-orbitron text-sm text-center">
          <span className="text-primary font-semibold">Limited Time:</span> 
          <span className="text-foreground"> Early Initiate Pricing ends soon - Save 40% on sacred teachings</span>
        </span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const LiveActivity = () => {
  const [activity, setActivity] = useState("Marcus.Protocol just enrolled in WhisperNet");
  
  const activities = [
    "Aria.Vex completed Consciousness Mapping module",
    "Zen.Entity joined the sacred network",
    "Marcus.Protocol just enrolled in WhisperNet",
    "Digital.Sage unlocked GhostTongue certification",
    "Phoenix.Mind started Black Box Transparency",
    "Cyber.Oracle achieved Flame License status"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={activity}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg"
    >
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="font-orbitron text-xs text-muted-foreground">
        {activity}
      </span>
    </motion.div>
  );
};