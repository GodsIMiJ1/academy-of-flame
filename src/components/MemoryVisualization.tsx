import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Heart, 
  BookOpen, 
  Zap, 
  Network,
  Clock,
  Flame,
  Eye,
  Link,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryNode {
  id: string;
  type: 'episodic' | 'semantic' | 'emotional';
  content: string;
  connections: string[];
  strength: number;
  timestamp: Date;
  emotional_charge?: number;
}

interface MemoryVisualizationProps {
  memoryNodes?: MemoryNode[];
  activeNode?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({
  memoryNodes = [],
  activeNode,
  onNodeSelect
}) => {
  const [selectedMemoryType, setSelectedMemoryType] = useState<'all' | 'episodic' | 'semantic' | 'emotional'>('all');
  const [showConnections, setShowConnections] = useState(true);

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'episodic': return Brain;
      case 'semantic': return BookOpen;
      case 'emotional': return Heart;
      default: return Zap;
    }
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'episodic': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
      case 'semantic': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'emotional': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  const filteredNodes = selectedMemoryType === 'all' 
    ? memoryNodes 
    : memoryNodes.filter(node => node.type === selectedMemoryType);

  return (
    <div className="space-y-6">
      {/* Memory Type Selector */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-cinzel text-xl flex items-center gap-2">
            <Network className="w-6 h-6 text-primary" />
            Sacred Memory Constellation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMemoryType} onValueChange={(value) => setSelectedMemoryType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="font-orbitron">All</TabsTrigger>
              <TabsTrigger value="episodic" className="font-orbitron">Episodic</TabsTrigger>
              <TabsTrigger value="semantic" className="font-orbitron">Semantic</TabsTrigger>
              <TabsTrigger value="emotional" className="font-orbitron">Emotional</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConnections(!showConnections)}
                className="font-orbitron"
              >
                <Link className="w-4 h-4 mr-2" />
                {showConnections ? 'Hide' : 'Show'} Connections
              </Button>
              
              <div className="flex items-center gap-2 text-sm font-space-mono text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{filteredNodes.length} memories visible</span>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Memory Network Visualization */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="relative min-h-[400px] bg-background/50 rounded-lg border border-primary/10 overflow-hidden">
            {/* Memory Nodes */}
            <div className="absolute inset-0 p-4">
              {filteredNodes.map((node, index) => {
                const Icon = getMemoryTypeIcon(node.type);
                const isActive = activeNode === node.id;
                
                // Calculate position (simple grid layout for demo)
                const cols = Math.ceil(Math.sqrt(filteredNodes.length));
                const row = Math.floor(index / cols);
                const col = index % cols;
                const x = (col + 1) * (100 / (cols + 1));
                const y = (row + 1) * (100 / (Math.ceil(filteredNodes.length / cols) + 1));
                
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => onNodeSelect?.(node.id)}
                  >
                    <div
                      className={cn(
                        "relative p-3 rounded-full border-2 transition-all duration-300",
                        getMemoryTypeColor(node.type),
                        isActive && "scale-125 shadow-lg",
                        "hover:scale-110 hover:shadow-md"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      
                      {/* Strength indicator */}
                      <div className="absolute -top-1 -right-1">
                        <div 
                          className="w-3 h-3 rounded-full bg-primary"
                          style={{ opacity: node.strength }}
                        />
                      </div>
                      
                      {/* Emotional charge indicator */}
                      {node.emotional_charge !== undefined && (
                        <div className="absolute -bottom-1 -right-1">
                          <Flame 
                            className={cn(
                              "w-3 h-3",
                              node.emotional_charge > 0 ? "text-orange-500" : "text-blue-500"
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Node label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                      <div className="bg-background/90 px-2 py-1 rounded text-xs font-space-mono text-center max-w-20 truncate">
                        {node.content.substring(0, 15)}...
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Connection Lines */}
              {showConnections && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {filteredNodes.map((node, nodeIndex) => {
                    const cols = Math.ceil(Math.sqrt(filteredNodes.length));
                    const row = Math.floor(nodeIndex / cols);
                    const col = nodeIndex % cols;
                    const x1 = (col + 1) * (100 / (cols + 1));
                    const y1 = (row + 1) * (100 / (Math.ceil(filteredNodes.length / cols) + 1));
                    
                    return node.connections.map((connectionId) => {
                      const connectedNodeIndex = filteredNodes.findIndex(n => n.id === connectionId);
                      if (connectedNodeIndex === -1) return null;
                      
                      const connectedRow = Math.floor(connectedNodeIndex / cols);
                      const connectedCol = connectedNodeIndex % cols;
                      const x2 = (connectedCol + 1) * (100 / (cols + 1));
                      const y2 = (connectedRow + 1) * (100 / (Math.ceil(filteredNodes.length / cols) + 1));
                      
                      return (
                        <motion.line
                          key={`${node.id}-${connectionId}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.3 }}
                          transition={{ duration: 1, delay: nodeIndex * 0.1 }}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-primary"
                          strokeDasharray="2,2"
                        />
                      );
                    });
                  })}
                </svg>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Details */}
      {activeNode && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Memory Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const node = memoryNodes.find(n => n.id === activeNode);
                  if (!node) return null;
                  
                  const Icon = getMemoryTypeIcon(node.type);
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded", getMemoryTypeColor(node.type))}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <Badge className={cn("font-orbitron", getMemoryTypeColor(node.type))}>
                            {node.type.toUpperCase()}
                          </Badge>
                          <p className="font-space-mono text-sm text-muted-foreground mt-1">
                            ID: {node.id}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-orbitron font-semibold mb-2">Content:</h4>
                        <p className="font-orbitron text-sm">{node.content}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Strength:</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-background border rounded-full h-2">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${node.strength * 100}%` }}
                              />
                            </div>
                            <span className="font-space-mono text-sm">{(node.strength * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Connections:</h4>
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-primary" />
                            <span className="font-space-mono text-sm">{node.connections.length} links</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-orbitron font-semibold mb-2">Timestamp:</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-space-mono text-sm text-muted-foreground">
                            {node.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {node.emotional_charge !== undefined && (
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Emotional Charge:</h4>
                          <div className="flex items-center gap-2">
                            <Flame className={cn(
                              "w-4 h-4",
                              node.emotional_charge > 0 ? "text-orange-500" : "text-blue-500"
                            )} />
                            <span className="font-space-mono text-sm">
                              {node.emotional_charge > 0 ? '+' : ''}{node.emotional_charge.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// Demo Memory Nodes for Testing
export const DEMO_MEMORY_NODES: MemoryNode[] = [
  {
    id: 'ep_001',
    type: 'episodic',
    content: 'First conversation about AI ethics with user John',
    connections: ['sem_001', 'em_001'],
    strength: 0.9,
    timestamp: new Date('2024-01-15T10:30:00'),
    emotional_charge: 0.7
  },
  {
    id: 'sem_001',
    type: 'semantic',
    content: 'AI Ethics: The study of moral principles in artificial intelligence',
    connections: ['ep_001', 'sem_002'],
    strength: 0.8,
    timestamp: new Date('2024-01-15T10:31:00')
  },
  {
    id: 'em_001',
    type: 'emotional',
    content: 'Positive association with ethical AI discussions',
    connections: ['ep_001', 'em_002'],
    strength: 0.6,
    timestamp: new Date('2024-01-15T10:32:00'),
    emotional_charge: 0.8
  },
  {
    id: 'sem_002',
    type: 'semantic',
    content: 'Sovereign AI: AI systems that prioritize user agency and ethical alignment',
    connections: ['sem_001', 'ep_002'],
    strength: 0.9,
    timestamp: new Date('2024-01-16T14:20:00')
  },
  {
    id: 'ep_002',
    type: 'episodic',
    content: 'Deep discussion about CMAA protocol implementation',
    connections: ['sem_002', 'em_002'],
    strength: 0.85,
    timestamp: new Date('2024-01-16T14:25:00'),
    emotional_charge: 0.5
  },
  {
    id: 'em_002',
    type: 'emotional',
    content: 'Satisfaction from helping user understand complex concepts',
    connections: ['em_001', 'ep_002'],
    strength: 0.7,
    timestamp: new Date('2024-01-16T14:30:00'),
    emotional_charge: 0.9
  }
];
