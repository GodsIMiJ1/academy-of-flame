import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scroll, Flame, Lock, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { ScrollInterface } from '@/components/ScrollInterface';
import { ChallengeInterface } from '@/components/ChallengeSystem';
import { FlameShardProgressCard } from '@/components/FlameShardSystem';
import { SOVEREIGN_AI_COURSE } from '@/data/sovereign-ai-course';
import { Scroll as ScrollType, StudentProgress } from '@/types/course';
import { cn } from '@/lib/utils';

type ViewMode = 'overview' | 'scroll' | 'challenge';

export const SovereignAICoursePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [currentScrollId, setCurrentScrollId] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress>({
    userId: 'current-user',
    courseId: SOVEREIGN_AI_COURSE.id,
    currentScrollId: null,
    completedScrolls: [],
    totalFlameShards: 0,
    startedAt: new Date(),
    lastAccessedAt: new Date(),
    challengeSubmissions: []
  });

  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const currentScroll = currentScrollId 
    ? SOVEREIGN_AI_COURSE.scrolls.find(s => s.id === currentScrollId)
    : null;

  const handleScrollStart = (scrollId: string) => {
    setCurrentScrollId(scrollId);
    setViewMode('scroll');
    setCompletedSections([]);
  };

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      
      // Award FlameShards
      const section = currentScroll?.sections.find(s => s.id === sectionId);
      if (section) {
        setStudentProgress(prev => ({
          ...prev,
          totalFlameShards: prev.totalFlameShards + (section.flameShards || 0)
        }));
      }
    }
  };

  const handleChallengeStart = () => {
    setViewMode('challenge');
  };

  const handleChallengeSubmit = (content: string) => {
    if (!currentScroll) return;
    
    // Create submission
    const submission = {
      id: `submission-${Date.now()}`,
      scrollId: currentScroll.id,
      challengeId: currentScroll.challenge.id,
      userId: studentProgress.userId,
      content,
      submittedAt: new Date(),
      status: 'pending' as const,
      flameShardsAwarded: 0
    };

    setStudentProgress(prev => ({
      ...prev,
      challengeSubmissions: [...prev.challengeSubmissions, submission]
    }));

    // Simulate auto-approval for demo
    setTimeout(() => {
      setStudentProgress(prev => ({
        ...prev,
        totalFlameShards: prev.totalFlameShards + currentScroll.challenge.flameShards,
        completedScrolls: [...prev.completedScrolls, currentScroll.id],
        challengeSubmissions: prev.challengeSubmissions.map(sub =>
          sub.id === submission.id
            ? { ...sub, status: 'approved' as const, flameShardsAwarded: currentScroll.challenge.flameShards }
            : sub
        )
      }));
    }, 2000);
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setCurrentScrollId(null);
  };

  const isScrollCompleted = (scrollId: string) => 
    studentProgress.completedScrolls.includes(scrollId);

  const isScrollUnlocked = (scroll: ScrollType) => {
    if (scroll.prerequisites.length === 0) return true;
    return scroll.prerequisites.every(prereq => isScrollCompleted(prereq));
  };

  if (viewMode === 'scroll' && currentScroll) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Button
            onClick={handleBackToOverview}
            variant="outline"
            className="mb-6 font-orbitron"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Course Overview
          </Button>
          
          <ScrollInterface
            scroll={currentScroll}
            onSectionComplete={handleSectionComplete}
            onChallengeStart={handleChallengeStart}
            completedSections={completedSections}
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'challenge' && currentScroll) {
    const existingSubmission = studentProgress.challengeSubmissions.find(
      sub => sub.scrollId === currentScroll.id && sub.challengeId === currentScroll.challenge.id
    );

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Button
            onClick={() => setViewMode('scroll')}
            variant="outline"
            className="mb-6 font-orbitron"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Scroll
          </Button>
          
          <ChallengeInterface
            challenge={currentScroll.challenge}
            onSubmit={handleChallengeSubmit}
            existingSubmission={existingSubmission}
          />
        </div>
      </div>
    );
  }

  // 🔥 FLAME GUARD: Ensure course data loads properly
  if (!SOVEREIGN_AI_COURSE || !SOVEREIGN_AI_COURSE.scrolls) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <h1 className="font-cinzel text-3xl font-bold text-primary">🜂 Academy of Flame 🜂</h1>
          <p className="font-orbitron text-lg text-muted-foreground">Preparing the Sacred Scrolls...</p>
          <p className="font-space-mono text-sm text-muted-foreground">The Flame is awakening. Please wait, Flamebearer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-6">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="font-cinzel text-4xl font-bold text-primary">
              The Path of Sovereign AI
            </h1>
          </div>
          <p className="font-orbitron text-xl text-muted-foreground max-w-3xl mx-auto">
            {SOVEREIGN_AI_COURSE.subtitle}
          </p>
          <p className="font-orbitron text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {SOVEREIGN_AI_COURSE.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Stats */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {SOVEREIGN_AI_COURSE.totalScrolls}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">Sacred Scrolls</div>
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {SOVEREIGN_AI_COURSE.totalHours}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">Hours</div>
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {SOVEREIGN_AI_COURSE.totalFlameShards}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">FlameShards</div>
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {studentProgress.completedScrolls.length}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scrolls List */}
            <div className="space-y-4">
              {SOVEREIGN_AI_COURSE.scrolls.map((scroll, index) => {
                const isCompleted = isScrollCompleted(scroll.id);
                const isUnlocked = isScrollUnlocked(scroll);
                
                return (
                  <motion.div
                    key={scroll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "border-2 transition-all hover:shadow-lg",
                      isCompleted && "border-green-500/50 bg-green-500/5",
                      !isUnlocked && "opacity-50",
                      isUnlocked && !isCompleted && "border-primary/30 hover:border-primary/50"
                    )}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-cinzel text-xl flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : isUnlocked ? (
                              <Scroll className="w-6 h-6 text-primary" />
                            ) : (
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            )}
                            Scroll {scroll.number}: {scroll.title}
                          </CardTitle>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {scroll.totalFlameShards} FlameShards
                          </Badge>
                        </div>
                        <p className="font-orbitron text-muted-foreground">
                          {scroll.subtitle}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="font-orbitron text-sm mb-4">
                          {scroll.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm font-space-mono text-muted-foreground">
                            <span>{scroll.estimatedHours}h</span>
                            <span>{scroll.sections.length} sections</span>
                          </div>
                          
                          <Button
                            onClick={() => handleScrollStart(scroll.id)}
                            disabled={!isUnlocked}
                            className="font-orbitron"
                          >
                            {isCompleted ? 'Review' : 'Begin'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FlameShardProgressCard currentShards={studentProgress.totalFlameShards} />
          </div>
        </div>
      </div>
    </div>
  );
};
