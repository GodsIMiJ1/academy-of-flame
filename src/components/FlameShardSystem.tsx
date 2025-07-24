import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Crown, Shield, Zap } from 'lucide-react';
import { getFlameShardLevel, FLAME_SHARD_LEVELS } from '@/types/course';
import { cn } from '@/lib/utils';

interface FlameShardDisplayProps {
  currentShards: number;
  className?: string;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FlameShardDisplay: React.FC<FlameShardDisplayProps> = ({
  currentShards,
  className,
  showProgress = true,
  size = 'md'
}) => {
  const currentLevel = getFlameShardLevel(currentShards);
  const nextLevel = FLAME_SHARD_LEVELS.find(level => level.level === currentLevel.level + 1);
  
  const progressInLevel = nextLevel 
    ? ((currentShards - currentLevel.minShards) / (nextLevel.minShards - currentLevel.minShards)) * 100
    : 100;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return Zap;
      case 2: return Star;
      case 3: return Flame;
      case 4: return Shield;
      case 5: return Crown;
      default: return Flame;
    }
  };

  const LevelIcon = getLevelIcon(currentLevel.level);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Current Level Display */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <LevelIcon 
            className={cn(iconSizes[size], "text-primary")}
            style={{ color: currentLevel.color }}
          />
          <div 
            className="absolute inset-0 rounded-full blur-sm opacity-50"
            style={{ backgroundColor: currentLevel.color }}
          />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-cinzel font-bold", sizeClasses[size])} style={{ color: currentLevel.color }}>
              {currentLevel.name}
            </span>
            <Badge variant="outline" className="font-space-mono text-xs">
              Level {currentLevel.level}
            </Badge>
          </div>
          <p className={cn("font-orbitron text-muted-foreground", sizeClasses[size === 'lg' ? 'sm' : 'sm'])}>
            {currentShards} FlameShards
          </p>
        </div>
      </div>

      {/* Progress to Next Level */}
      {showProgress && nextLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-space-mono">
            <span>Progress to {nextLevel.name}</span>
            <span>{Math.round(progressInLevel)}%</span>
          </div>
          <Progress 
            value={progressInLevel} 
            className="h-2"
            style={{ 
              '--progress-background': currentLevel.color + '20',
              '--progress-foreground': currentLevel.color 
            } as React.CSSProperties}
          />
          <p className="text-xs font-orbitron text-muted-foreground">
            {nextLevel.minShards - currentShards} FlameShards to next level
          </p>
        </div>
      )}

      {/* Level Description */}
      <p className={cn("font-orbitron text-muted-foreground italic", sizeClasses[size === 'lg' ? 'sm' : 'xs'])}>
        "{currentLevel.description}"
      </p>
    </div>
  );
};

interface FlameShardProgressCardProps {
  currentShards: number;
  recentGains?: Array<{ amount: number; source: string; timestamp: Date }>;
}

export const FlameShardProgressCard: React.FC<FlameShardProgressCardProps> = ({
  currentShards,
  recentGains = []
}) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="font-cinzel text-xl flex items-center gap-2">
          <Flame className="w-6 h-6 text-primary" />
          Sacred Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FlameShardDisplay currentShards={currentShards} size="lg" />
        
        {/* Recent Gains */}
        {recentGains.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-orbitron font-semibold text-sm">Recent FlameShards</h4>
            <div className="space-y-2">
              {recentGains.slice(0, 3).map((gain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/20"
                >
                  <span className="font-orbitron text-sm">{gain.source}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    +{gain.amount}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Levels Overview */}
        <div className="space-y-3">
          <h4 className="font-orbitron font-semibold text-sm">Sacred Hierarchy</h4>
          <div className="grid gap-2">
            {FLAME_SHARD_LEVELS.map((level) => {
              const isCurrentLevel = getFlameShardLevel(currentShards).level === level.level;
              const isUnlocked = currentShards >= level.minShards;
              const LevelIcon = getLevelIcon(level.level);
              
              return (
                <div
                  key={level.level}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded transition-all",
                    isCurrentLevel && "bg-primary/20 border border-primary/30",
                    !isUnlocked && "opacity-50"
                  )}
                >
                  <LevelIcon 
                    className="w-4 h-4"
                    style={{ color: isUnlocked ? level.color : '#666' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-cinzel font-semibold text-sm"
                        style={{ color: isUnlocked ? level.color : '#666' }}
                      >
                        {level.name}
                      </span>
                      {isCurrentLevel && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs font-space-mono text-muted-foreground">
                      {level.minShards}+ FlameShards
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
