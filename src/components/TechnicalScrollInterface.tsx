import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scroll, 
  Flame, 
  CheckCircle, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Code,
  BookOpen,
  Wrench,
  Cpu,
  Zap
} from 'lucide-react';
import { TechnicalScroll, TechnicalSection } from '@/types/technical-course';
import { CodeChallengeInterface } from '@/components/CodeChallengeSystem';
import { cn } from '@/lib/utils';

interface TechnicalScrollInterfaceProps {
  scroll: TechnicalScroll;
  onSectionComplete: (sectionId: string) => void;
  onCodeChallengeStart: () => void;
  onCodeSubmit: (code: string) => void;
  completedSections: string[];
  currentView: 'sections' | 'challenge';
  onViewChange: (view: 'sections' | 'challenge') => void;
}

export const TechnicalScrollInterface: React.FC<TechnicalScrollInterfaceProps> = ({
  scroll,
  onSectionComplete,
  onCodeChallengeStart,
  onCodeSubmit,
  completedSections,
  currentView,
  onViewChange
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = scroll.sections[currentSectionIndex];
  const progress = (completedSections.length / scroll.sections.length) * 100;

  const handleNextSection = () => {
    if (currentSectionIndex < scroll.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSectionComplete = () => {
    onSectionComplete(currentSection.id);
    if (currentSectionIndex < scroll.sections.length - 1) {
      setTimeout(() => handleNextSection(), 500);
    }
  };

  const isSectionCompleted = (sectionId: string) => completedSections.includes(sectionId);
  const canProceedToChallenge = completedSections.length === scroll.sections.length;

  const getSectionIcon = (type: TechnicalSection['type']) => {
    switch (type) {
      case 'theory': return BookOpen;
      case 'code': return Code;
      case 'hands-on': return Wrench;
      case 'architecture': return Cpu;
      case 'ritual': return Zap;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'initiate': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'adept': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'master': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'sovereign': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  if (currentView === 'challenge') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Button
            onClick={() => onViewChange('sections')}
            variant="outline"
            className="mb-6 font-orbitron"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scroll
          </Button>
          
          <CodeChallengeInterface
            challenge={scroll.codeChallenge}
            onSubmit={onCodeSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Scroll Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Scroll className="w-8 h-8 text-primary" />
          <h1 className="font-cinzel text-3xl font-bold text-primary">
            Scroll {scroll.number}: {scroll.title}
          </h1>
        </div>
        <p className="font-orbitron text-lg text-muted-foreground max-w-2xl mx-auto">
          {scroll.subtitle}
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Badge className={cn("font-orbitron", getDifficultyColor(scroll.difficulty))}>
            {scroll.difficulty.toUpperCase()}
          </Badge>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Flame className="w-3 h-3 mr-1" />
            {scroll.totalFlameShards} FlameShards
          </Badge>
          <Badge variant="outline" className="font-space-mono">
            {scroll.estimatedHours}h
          </Badge>
        </div>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {scroll.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="font-space-mono text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-space-mono">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      {/* Section Navigation */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-xl flex items-center gap-2">
              {React.createElement(getSectionIcon(currentSection.type), {
                className: "w-5 h-5 text-primary"
              })}
              {currentSection.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-space-mono">
                Section {currentSectionIndex + 1} of {scroll.sections.length}
              </Badge>
              <Badge className={cn("font-orbitron text-xs", getDifficultyColor(currentSection.type))}>
                {currentSection.type.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert max-w-none"
            >
              <div 
                className="font-orbitron leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: currentSection.content
                    .replace(/\n/g, '<br/>')
                    .replace(/#{1,6}\s/g, '<h3 class="font-cinzel text-primary font-bold mt-6 mb-3">')
                    .replace(/<h3/g, '</p><h3')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
                    .replace(/`([^`]+)`/g, '<code class="bg-primary/20 text-primary px-1 rounded">$1</code>')
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Code Challenge Preview */}
          {currentSection.codeChallenge && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg flex items-center gap-2 text-yellow-600">
                  <Code className="w-5 h-5" />
                  Code Challenge: {currentSection.codeChallenge.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-orbitron text-sm text-muted-foreground mb-4">
                  {currentSection.codeChallenge.description}
                </p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                    <Flame className="w-3 h-3 mr-1" />
                    {currentSection.codeChallenge.flameShards} FlameShards
                  </Badge>
                  <Badge variant="outline" className="font-space-mono">
                    {currentSection.codeChallenge.language.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-primary/20">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSectionIndex === 0}
              className="font-orbitron"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {isSectionCompleted(currentSection.id) ? (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed (+{currentSection.flameShards} FlameShards)
                </Badge>
              ) : (
                <Button
                  onClick={handleSectionComplete}
                  className="font-orbitron flame-glow"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Complete Section (+{currentSection.flameShards})
                </Button>
              )}
            </div>

            <Button
              onClick={handleNextSection}
              disabled={currentSectionIndex === scroll.sections.length - 1}
              className="font-orbitron"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Final Code Challenge */}
      {canProceedToChallenge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="font-cinzel text-xl text-primary flex items-center gap-2">
                <Code className="w-6 h-6" />
                Sacred Code Challenge: {scroll.codeChallenge.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-orbitron text-muted-foreground">
                {scroll.codeChallenge.description}
              </p>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Flame className="w-3 h-3 mr-1" />
                  {scroll.codeChallenge.flameShards} FlameShards
                </Badge>
                <Badge variant="outline" className="font-space-mono">
                  {scroll.codeChallenge.language.toUpperCase()}
                </Badge>
                <Badge className={cn("font-orbitron", getDifficultyColor(scroll.codeChallenge.difficulty))}>
                  {scroll.codeChallenge.difficulty.toUpperCase()}
                </Badge>
              </div>

              <Button
                onClick={() => onViewChange('challenge')}
                size="lg"
                className="w-full font-orbitron text-lg flame-glow"
              >
                <Code className="w-5 h-5 mr-2" />
                Begin Code Challenge
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
