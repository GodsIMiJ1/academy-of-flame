import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock, Flame } from 'lucide-react';

interface PathwayNode {
  id: string;
  title: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  progress: number;
}

interface KnowledgePathwayProps {
  nodes: PathwayNode[];
  totalProgress: number;
}

export function KnowledgePathway({ nodes, totalProgress }: KnowledgePathwayProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="font-cinzel text-primary flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Sacred Knowledge Pathway
        </CardTitle>
        <div className="flex justify-between text-sm">
          <span className="font-orbitron text-muted-foreground">Journey Progress</span>
          <span className="font-orbitron text-primary">{totalProgress}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-primary to-accent rounded-full flame-glow"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Sacred Glyph Path */}
          <svg
            viewBox="0 0 400 200"
            className="w-full h-48 mb-4"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))' }}
          >
            {/* Connecting Path */}
            <motion.path
              d="M 40 100 Q 120 50 200 100 T 360 100"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: totalProgress / 100 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Sacred Nodes */}
            {nodes.map((node, index) => {
              const x = 40 + (index * 80);
              const y = 100 + (index % 2 === 0 ? 0 : Math.sin(index) * 20);
              
              return (
                <g key={node.id}>
                  {/* Node Glow */}
                  {node.isCurrent && (
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="hsl(var(--primary) / 0.2)"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Node Base */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill={
                      node.isCompleted
                        ? "hsl(var(--primary))"
                        : node.isCurrent
                        ? "hsl(var(--primary) / 0.8)"
                        : node.isUnlocked
                        ? "hsl(var(--muted))"
                        : "hsl(var(--muted) / 0.3)"
                    }
                    stroke={node.isCurrent ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.3)"}
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  />
                  
                  {/* Sacred Glyph */}
                  <motion.polygon
                    points={`${x-6},${y-6} ${x+6},${y-6} ${x+6},${y+6} ${x-6},${y+6}`}
                    fill={node.isCompleted ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))"}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: node.isCurrent ? 360 : 0 }}
                    transition={{ duration: 3, repeat: node.isCurrent ? Infinity : 0, ease: "linear" }}
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Node Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-3 rounded-lg border transition-all duration-300
                  ${node.isCurrent 
                    ? 'border-primary/50 bg-primary/10 pulse-border' 
                    : node.isCompleted
                    ? 'border-green-500/30 bg-green-500/5'
                    : node.isUnlocked
                    ? 'border-primary/20 bg-card/50'
                    : 'border-muted/20 bg-muted/5'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {node.isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : node.isUnlocked ? (
                      <Circle className="w-4 h-4 text-primary" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-orbitron text-sm font-medium">
                      {node.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {node.isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                    {node.isCompleted && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
                
                {node.isCurrent && node.progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-muted/30 rounded-full h-1">
                      <motion.div
                        className="h-1 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${node.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}