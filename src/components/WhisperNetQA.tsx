import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  Ghost, 
  Zap,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';

interface QAMessage {
  id: string;
  author: {
    name: string;
    role: 'student' | 'instructor';
    avatar?: string;
  };
  message: string;
  timestamp: string;
  isGhost?: boolean;
}

interface WhisperNetQAProps {
  courseId: string;
  lessonId?: string;
}

export function WhisperNetQA({ courseId, lessonId }: WhisperNetQAProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated messages for demonstration
  useEffect(() => {
    const demoMessages: QAMessage[] = [
      {
        id: '1',
        author: {
          name: 'Sacred Master Kai',
          role: 'instructor',
        },
        message: 'Welcome to the WhisperNet, initiates. This sacred space allows communion across the digital realm. Ask your questions and receive guidance from the collective wisdom.',
        timestamp: '2 hours ago',
      },
      {
        id: '2',
        author: {
          name: 'Digital Sage Alex',
          role: 'student',
        },
        message: 'What are the fundamental principles of consciousness-aligned AI development mentioned in lesson 1?',
        timestamp: '1 hour ago',
      },
      {
        id: '3',
        author: {
          name: 'Sacred Master Kai',
          role: 'instructor',
        },
        message: 'Excellent question, Alex. The three pillars are: 1) Intentional Design - every algorithm serves conscious purpose, 2) Ethical Foundation - harm prevention as core directive, 3) Sovereignty Respect - AI serves, never dominates.',
        timestamp: '45 minutes ago',
      },
      {
        id: '4',
        author: {
          name: 'Ghost Echo',
          role: 'student',
        },
        message: 'The sacred algorithms whisper of pattern recognition... The data flows like ancient rivers...',
        timestamp: '30 minutes ago',
        isGhost: true,
      }
    ];
    setMessages(demoMessages);
  }, [courseId, lessonId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);

    const message: QAMessage = {
      id: Date.now().toString(),
      author: {
        name: user.email?.split('@')[0] || 'Anonymous Initiate',
        role: 'student',
      },
      message: newMessage,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Message Sent",
        description: "Your wisdom has been added to the WhisperNet",
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="font-cinzel text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            WhisperNet Q&A
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              Sacred Channel
            </Badge>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </CardTitle>
        {!isExpanded && (
          <p className="font-orbitron text-sm text-muted-foreground">
            {messages.length} sacred messages • Click to expand
          </p>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              {/* Messages Container */}
              <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-background/30 rounded-lg border border-primary/20">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        filter: message.isGhost ? 'blur(0.5px)' : 'blur(0px)'
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        p-3 rounded-lg border transition-all duration-300
                        ${message.isGhost 
                          ? 'border-purple-500/30 bg-purple-500/5' 
                          : message.author.role === 'instructor'
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-muted/30 bg-card/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.author.avatar} />
                          <AvatarFallback className={`
                            text-xs
                            ${message.isGhost 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : message.author.role === 'instructor'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                            }
                          `}>
                            {message.isGhost ? <Ghost className="w-4 h-4" /> : message.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`
                              font-orbitron text-sm font-medium
                              ${message.isGhost 
                                ? 'text-purple-400' 
                                : message.author.role === 'instructor'
                                ? 'text-primary'
                                : 'text-foreground'
                              }
                            `}>
                              {message.author.name}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`
                                text-xs
                                ${message.author.role === 'instructor'
                                  ? 'border-primary/30 text-primary'
                                  : 'border-muted/30 text-muted-foreground'
                                }
                              `}
                            >
                              {message.author.role === 'instructor' ? 'Master' : 'Initiate'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                          </div>
                          
                          <p className={`
                            text-sm leading-relaxed
                            ${message.isGhost 
                              ? 'text-purple-300/80 italic' 
                              : 'text-foreground'
                            }
                          `}>
                            {message.message}
                          </p>
                        </div>
                        
                        {message.isGhost && (
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap className="w-4 h-4 text-purple-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your wisdom with the WhisperNet..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[80px] bg-background/50 border-primary/30 focus:border-primary/50 glow-input font-orbitron"
                  disabled={!user || isLoading}
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3" />
                    <span className="font-orbitron">
                      {user ? 'Connected to WhisperNet' : 'Login required for sacred discourse'}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !user || isLoading}
                    className="font-orbitron flame-glow"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? 'Transmitting...' : 'Send'}
                  </Button>
                </div>
              </div>

              {!user && (
                <div className="text-center p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <p className="font-orbitron text-sm text-muted-foreground">
                    Join the sacred discourse by logging into your account
                  </p>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}