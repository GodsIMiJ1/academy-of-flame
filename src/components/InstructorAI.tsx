import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  BookOpen,
  HelpCircle,
  FileText,
  Zap,
  Lightbulb
} from 'lucide-react';

interface AIResponse {
  id: string;
  type: 'quiz' | 'summary' | 'assignment';
  content: string;
  timestamp: string;
}

const aiTools = [
  {
    id: 'quiz',
    name: 'Quiz Generator',
    description: 'Generate sacred knowledge assessments',
    icon: HelpCircle,
    prompt: 'Create assessment questions for this lesson content'
  },
  {
    id: 'summary',
    name: 'Sacred Summary',
    description: 'Distill lesson essence into key points',
    icon: BookOpen,
    prompt: 'Summarize the core wisdom of this lesson'
  },
  {
    id: 'assignment',
    name: 'Assignment Ideas',
    description: 'Generate practical applications and exercises',
    icon: FileText,
    prompt: 'Suggest hands-on assignments for this topic'
  }
];

export function InstructorAI() {
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedTool) return;

    setIsGenerating(true);
    
    // Simulate AI generation with demo content
    const demoResponses = {
      quiz: `📚 **Sacred Knowledge Assessment**

**Question 1: Multiple Choice**
What are the three pillars of consciousness-aligned AI development?
A) Speed, Efficiency, Cost
B) Intentional Design, Ethical Foundation, Sovereignty Respect
C) Data, Algorithms, Servers
D) All of the above

**Question 2: Short Answer**
Explain how "sovereignty respect" manifests in AI system design.

**Question 3: Practical Application**
Design a simple AI feature that demonstrates consciousness-aligned principles.

**Answer Key:**
1. B - These represent the core sacred principles
2. AI serves human agency, never replaces human decision-making
3. Examples: Suggestion systems, transparency features, user control options`,

      summary: `🔮 **Sacred Lesson Essence**

**Core Wisdom Points:**

✨ **Consciousness-Aligned AI Foundations**
- Technology serves consciousness, not vice versa
- Every algorithm must have intentional purpose
- Harm prevention is a core directive, not an afterthought

🏛️ **The Three Sacred Pillars**
1. **Intentional Design**: Every feature serves conscious purpose
2. **Ethical Foundation**: Harm prevention at the core
3. **Sovereignty Respect**: Humans remain sovereign decision-makers

🌟 **Practical Applications**
- Transparent recommendation systems
- User-controlled data processing
- Consent-first feature implementation

💫 **Key Insight**: True AI advancement comes through alignment with human flourishing, not replacement of human agency.`,

      assignment: `⚡ **Sacred Practice Assignments**

**Assignment 1: Digital Audit (Beginner)**
Examine 3 AI tools you use daily. Identify:
- How they respect/violate sovereignty principles
- Where harm prevention could be improved
- Suggestions for consciousness-aligned features

**Assignment 2: Sacred Algorithm Design (Intermediate)**
Design a simple recommendation algorithm that:
- Explains its reasoning to users
- Allows users to adjust its parameters
- Has built-in bias detection

**Assignment 3: Consciousness Council (Advanced)**
Create a framework for evaluating AI systems through the lens of consciousness alignment. Include:
- Assessment criteria for each sacred pillar
- Real-world testing methodology
- Community feedback integration

**Bonus Challenge: Flame Keeper Protocol**
Design an AI system that teaches these principles to other developers.`
    };

    setTimeout(() => {
      const response: AIResponse = {
        id: Date.now().toString(),
        type: selectedTool as 'quiz' | 'summary' | 'assignment',
        content: demoResponses[selectedTool as keyof typeof demoResponses],
        timestamp: new Date().toLocaleTimeString()
      };

      setResponses(prev => [response, ...prev]);
      setPrompt('');
      setSelectedTool(null);
      setIsGenerating(false);

      toast({
        title: "Sacred Wisdom Generated",
        description: "Your AI assistant has crafted new teaching materials",
      });
    }, 2000);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="font-cinzel text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Sacred AI Assistant
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              Instructor Tool
            </Badge>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </CardTitle>
        {!isExpanded && (
          <p className="font-orbitron text-sm text-muted-foreground">
            Generate teaching materials with sacred AI wisdom
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
            <CardContent className="space-y-6">
              {/* AI Tools Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`
                        cursor-pointer transition-all duration-300
                        ${selectedTool === tool.id
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                          : 'border-primary/20 hover:border-primary/40'
                        }
                      `}
                      onClick={() => {
                        setSelectedTool(tool.id);
                        setPrompt(tool.prompt);
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <tool.icon className={`
                          w-8 h-8 mx-auto mb-2
                          ${selectedTool === tool.id ? 'text-primary' : 'text-muted-foreground'}
                        `} />
                        <h3 className="font-orbitron text-sm font-medium mb-1">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <div className="relative">
                  <Textarea
                    placeholder="Describe your lesson content or teaching goals..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] bg-background/50 border-primary/30 focus:border-primary/50 glow-input font-orbitron pr-12"
                    disabled={isGenerating}
                  />
                  <motion.div
                    className="absolute top-3 right-3"
                    animate={{ rotate: isGenerating ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isGenerating ? Infinity : 0 }}
                  >
                    <Wand2 className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lightbulb className="w-3 h-3" />
                    <span className="font-orbitron">
                      {selectedTool ? `${aiTools.find(t => t.id === selectedTool)?.name} Selected` : 'Select a tool above'}
                    </span>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || !selectedTool || isGenerating}
                    className="font-orbitron flame-glow"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Channeling Wisdom...' : 'Generate'}
                  </Button>
                </div>
              </div>

              {/* Generated Responses */}
              {responses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Generated Sacred Materials
                  </h3>
                  
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    <AnimatePresence mode="popLayout">
                      {responses.map((response) => (
                        <motion.div
                          key={response.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 bg-background/50 rounded-lg border border-primary/20"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge 
                              variant="outline" 
                              className="border-primary/30 text-primary"
                            >
                              {aiTools.find(t => t.id === response.type)?.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-orbitron">
                              {response.timestamp}
                            </span>
                          </div>
                          
                          <div className="prose prose-sm prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-orbitron text-sm text-foreground">
                              {response.content}
                            </pre>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 font-orbitron"
                            onClick={() => {
                              navigator.clipboard.writeText(response.content);
                              toast({
                                title: "Copied to Sacred Scroll",
                                description: "Content copied to clipboard",
                              });
                            }}
                          >
                            Copy to Sacred Scroll
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Placeholder for future features */}
              <div className="text-center p-6 border border-primary/20 rounded-lg bg-primary/5">
                <Brain className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">
                  Future Enhancements
                </h3>
                <p className="font-orbitron text-sm text-muted-foreground">
                  Coming soon: OpenRouter API integration for real AI assistance
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}