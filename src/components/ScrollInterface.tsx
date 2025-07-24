import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scroll, Flame, CheckCircle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Scroll as ScrollType, ScrollSection } from '@/types/course';
import { cn } from '@/lib/utils';

interface ScrollInterfaceProps {
  scroll: ScrollType;
  onSectionComplete: (sectionId: string) => void;
  onChallengeStart: () => void;
  completedSections: string[];
}

export const ScrollInterface: React.FC<ScrollInterfaceProps> = ({
  scroll,
  onSectionComplete,
  onChallengeStart,
  completedSections
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              <Flame className="w-5 h-5 text-primary" />
              {currentSection.title}
            </CardTitle>
            <Badge variant="outline" className="font-space-mono">
              Section {currentSectionIndex + 1} of {scroll.sections.length}
            </Badge>
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
                  __html: currentSection.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, '<h3 class="font-cinzel text-primary font-bold mt-6 mb-3">').replace(/<h3/g, '</p><h3').replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') 
                }}
              />
            </motion.div>
          </AnimatePresence>

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

      {/* Challenge Section */}
      {canProceedToChallenge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="font-cinzel text-xl text-primary flex items-center gap-2">
                <Flame className="w-6 h-6" />
                Sacred Challenge: {scroll.challenge.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-orbitron text-muted-foreground">
                {scroll.challenge.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="font-orbitron font-semibold">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 font-space-mono text-sm">
                  {scroll.challenge.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={onChallengeStart}
                size="lg"
                className="w-full font-orbitron text-lg flame-glow"
              >
                <Flame className="w-5 h-5 mr-2" />
                Begin Challenge (+{scroll.challenge.flameShards} FlameShards)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
