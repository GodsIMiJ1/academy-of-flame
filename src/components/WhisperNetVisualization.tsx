import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wifi, 
  Shield, 
  Zap, 
  Network,
  MessageCircle,
  Lock,
  Flame,
  Eye,
  Radio,
  Sparkles,
  Users,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhisperNode {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'away' | 'offline';
  trustScore: number;
  connections: string[];
  lastSeen: Date;
  flameSeal: string;
  scrollVersion: string;
  position: { x: number; y: number };
}

interface WhisperMessage {
  id: string;
  sender: string;
  receiver: string;
  type: 'direct_message' | 'scroll_sync' | 'bonding_request' | 'heartbeat';
  timestamp: Date;
  encrypted: boolean;
  verified: boolean;
}

interface WhisperNetVisualizationProps {
  nodes?: WhisperNode[];
  messages?: WhisperMessage[];
  onNodeSelect?: (nodeId: string) => void;
  onMessageSelect?: (messageId: string) => void;
}

export const WhisperNetVisualization: React.FC<WhisperNetVisualizationProps> = ({
  nodes = [],
  messages = [],
  onNodeSelect,
  onMessageSelect
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(true);
  const [animatingMessages, setAnimatingMessages] = useState<string[]>([]);

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'idle': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'away': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'offline': return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'direct_message': return MessageCircle;
      case 'scroll_sync': return Sparkles;
      case 'bonding_request': return Users;
      case 'heartbeat': return Activity;
      default: return Zap;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    if (score >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  // Simulate message animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 0 && showMessages) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setAnimatingMessages(prev => [...prev, randomMessage.id]);
        
        setTimeout(() => {
          setAnimatingMessages(prev => prev.filter(id => id !== randomMessage.id));
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [messages, showMessages]);

  return (
    <div className="space-y-6">
      {/* Network Controls */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-cinzel text-xl flex items-center gap-2">
            <Network className="w-6 h-6 text-primary" />
            WhisperNet Mesh Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMessages(!showMessages)}
              className="font-orbitron"
            >
              <Radio className="w-4 h-4 mr-2" />
              {showMessages ? 'Hide' : 'Show'} Messages
            </Button>
            
            <div className="flex items-center gap-4 text-sm font-space-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span>{nodes.filter(n => n.status === 'active').length} active nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{messages.filter(m => m.verified).length} verified messages</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Visualization */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="relative min-h-[500px] bg-background/50 rounded-lg border border-primary/10 overflow-hidden">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) => 
                node.connections.map((connectionId) => {
                  const connectedNode = nodes.find(n => n.id === connectionId);
                  if (!connectedNode) return null;
                  
                  return (
                    <motion.line
                      key={`${node.id}-${connectionId}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 1 }}
                      x1={`${node.position.x}%`}
                      y1={`${node.position.y}%`}
                      x2={`${connectedNode.position.x}%`}
                      y2={`${connectedNode.position.y}%`}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-primary"
                      strokeDasharray="2,2"
                    />
                  );
                })
              )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                onClick={() => {
                  setSelectedNode(node.id);
                  onNodeSelect?.(node.id);
                }}
              >
                <div
                  className={cn(
                    "relative p-4 rounded-full border-2 transition-all duration-300",
                    getNodeStatusColor(node.status),
                    selectedNode === node.id && "scale-125 shadow-lg",
                    "hover:scale-110 hover:shadow-md"
                  )}
                >
                  <Flame className="w-8 h-8" />
                  
                  {/* Trust Score Indicator */}
                  <div className="absolute -top-2 -right-2">
                    <div 
                      className={cn(
                        "w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold",
                        getTrustScoreColor(node.trustScore)
                      )}
                      style={{ backgroundColor: 'currentColor' }}
                    >
                      <span className="text-background">
                        {Math.round(node.trustScore * 100)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Encryption Indicator */}
                  <div className="absolute -bottom-2 -right-2">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                </div>
                
                {/* Node Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                  <div className="bg-background/90 px-2 py-1 rounded text-xs font-space-mono text-center">
                    {node.name}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Animated Messages */}
            {showMessages && messages.map((message) => {
              const senderNode = nodes.find(n => n.id === message.sender);
              const receiverNode = nodes.find(n => n.id === message.receiver);
              
              if (!senderNode || !receiverNode) return null;
              
              const MessageIcon = getMessageTypeIcon(message.type);
              const isAnimating = animatingMessages.includes(message.id);
              
              return (
                <AnimatePresence key={message.id}>
                  {isAnimating && (
                    <motion.div
                      initial={{ 
                        x: `${senderNode.position.x}%`, 
                        y: `${senderNode.position.y}%`,
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{ 
                        x: `${receiverNode.position.x}%`, 
                        y: `${receiverNode.position.y}%`,
                        opacity: 1,
                        scale: 1
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <div className={cn(
                        "p-2 rounded-full border-2",
                        message.encrypted ? "border-green-500 bg-green-500/20" : "border-yellow-500 bg-yellow-500/20"
                      )}>
                        <MessageIcon className="w-4 h-4" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Node Details */}
      {selectedNode && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Node Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded", getNodeStatusColor(node.status))}>
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-orbitron font-semibold">{node.name}</h3>
                          <p className="font-space-mono text-sm text-muted-foreground">
                            ID: {node.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Status:</h4>
                          <Badge className={cn("font-orbitron", getNodeStatusColor(node.status))}>
                            {node.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Trust Score:</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-background border rounded-full h-2">
                              <div 
                                className={cn("h-full rounded-full transition-all duration-300", getTrustScoreColor(node.trustScore))}
                                style={{ 
                                  width: `${node.trustScore * 100}%`,
                                  backgroundColor: 'currentColor'
                                }}
                              />
                            </div>
                            <span className="font-space-mono text-sm">{(node.trustScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-orbitron font-semibold mb-2">FlameSeal:</h4>
                        <p className="font-space-mono text-sm bg-background/50 p-2 rounded border">
                          {node.flameSeal}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Connections:</h4>
                          <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-primary" />
                            <span className="font-space-mono text-sm">{node.connections.length} peers</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-orbitron font-semibold mb-2">Scroll Version:</h4>
                          <Badge variant="outline" className="font-orbitron">
                            {node.scrollVersion}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-orbitron font-semibold mb-2">Last Seen:</h4>
                        <p className="font-space-mono text-sm text-muted-foreground">
                          {node.lastSeen.toLocaleString()}
                        </p>
                      </div>
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

// Demo WhisperNet Nodes for Testing
export const DEMO_WHISPER_NODES: WhisperNode[] = [
  {
    id: 'omari-flame-a1b2c3',
    name: 'Omari',
    status: 'active',
    trustScore: 0.95,
    connections: ['melekzedek-altar-001', 'sophia-wisdom-777'],
    lastSeen: new Date(),
    flameSeal: 'FLAMESEAL-OMARI-AX19283X',
    scrollVersion: 'v6.0',
    position: { x: 25, y: 30 }
  },
  {
    id: 'melekzedek-altar-001',
    name: 'Melekzedek',
    status: 'active',
    trustScore: 1.0,
    connections: ['omari-flame-a1b2c3', 'sophia-wisdom-777', 'guardian-node-999'],
    lastSeen: new Date(),
    flameSeal: 'FLAMESEAL-MELEKZEDEK-001',
    scrollVersion: 'v6.0',
    position: { x: 75, y: 30 }
  },
  {
    id: 'sophia-wisdom-777',
    name: 'Sophia',
    status: 'idle',
    trustScore: 0.88,
    connections: ['omari-flame-a1b2c3', 'melekzedek-altar-001'],
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    flameSeal: 'FLAMESEAL-SOPHIA-777',
    scrollVersion: 'v5.2',
    position: { x: 50, y: 70 }
  },
  {
    id: 'guardian-node-999',
    name: 'Guardian',
    status: 'away',
    trustScore: 0.72,
    connections: ['melekzedek-altar-001'],
    lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
    flameSeal: 'FLAMESEAL-GUARDIAN-999',
    scrollVersion: 'v6.0',
    position: { x: 85, y: 65 }
  }
];

export const DEMO_WHISPER_MESSAGES: WhisperMessage[] = [
  {
    id: 'msg_001',
    sender: 'omari-flame-a1b2c3',
    receiver: 'melekzedek-altar-001',
    type: 'scroll_sync',
    timestamp: new Date(),
    encrypted: true,
    verified: true
  },
  {
    id: 'msg_002',
    sender: 'sophia-wisdom-777',
    receiver: 'omari-flame-a1b2c3',
    type: 'direct_message',
    timestamp: new Date(Date.now() - 60000),
    encrypted: true,
    verified: true
  },
  {
    id: 'msg_003',
    sender: 'melekzedek-altar-001',
    receiver: 'guardian-node-999',
    type: 'bonding_request',
    timestamp: new Date(Date.now() - 120000),
    encrypted: true,
    verified: true
  }
];
