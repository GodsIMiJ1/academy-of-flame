import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Flame, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Code,
  Cpu,
  Zap,
  Shield
} from 'lucide-react';
import { TechnicalScrollInterface } from '@/components/TechnicalScrollInterface';
import { FlameShardProgressCard } from '@/components/FlameShardSystem';
import { FORGING_FLAME_COURSE } from '@/data/forging-flame-course';
import { TechnicalScroll, TechnicalProgress } from '@/types/technical-course';
import { cn } from '@/lib/utils';

type ViewMode = 'overview' | 'scroll' | 'challenge';

export const ForgingFlameCoursePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [currentScrollId, setCurrentScrollId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'sections' | 'challenge'>('sections');
  const [studentProgress, setStudentProgress] = useState<TechnicalProgress>({
    userId: 'current-user',
    courseId: FORGING_FLAME_COURSE.id,
    currentScrollId: null,
    completedScrolls: [],
    totalFlameShards: 0,
    startedAt: new Date(),
    lastAccessedAt: new Date(),
    challengeSubmissions: [],
    completedChallenges: [],
    codeSubmissions: [],
    projectMilestones: [],
    techSkillLevel: 'initiate',
    specializations: []
  });

  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const currentScroll = currentScrollId 
    ? FORGING_FLAME_COURSE.scrolls.find(s => s.id === currentScrollId)
    : null;

  const handleScrollStart = (scrollId: string) => {
    setCurrentScrollId(scrollId);
    setViewMode('scroll');
    setCurrentView('sections');
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

  const handleCodeChallengeStart = () => {
    setCurrentView('challenge');
  };

  const handleCodeSubmit = (code: string) => {
    if (!currentScroll) return;
    
    // Create code submission
    const submission = {
      id: `code-submission-${Date.now()}`,
      challengeId: currentScroll.codeChallenge.id,
      userId: studentProgress.userId,
      code,
      language: currentScroll.codeChallenge.language,
      submittedAt: new Date(),
      status: 'pending' as const,
      testResults: [],
      flameShardsAwarded: 0
    };

    setStudentProgress(prev => ({
      ...prev,
      codeSubmissions: [...prev.codeSubmissions, submission]
    }));

    // Simulate auto-approval for demo
    setTimeout(() => {
      setStudentProgress(prev => ({
        ...prev,
        totalFlameShards: prev.totalFlameShards + currentScroll.codeChallenge.flameShards,
        completedScrolls: [...prev.completedScrolls, currentScroll.id],
        completedChallenges: [...prev.completedChallenges, currentScroll.codeChallenge.id],
        codeSubmissions: prev.codeSubmissions.map(sub =>
          sub.id === submission.id
            ? { ...sub, status: 'passed' as const, flameShardsAwarded: currentScroll.codeChallenge.flameShards }
            : sub
        )
      }));
    }, 2000);
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setCurrentScrollId(null);
    setCurrentView('sections');
  };

  const isScrollCompleted = (scrollId: string) => 
    studentProgress.completedScrolls.includes(scrollId);

  const isScrollUnlocked = (scroll: TechnicalScroll) => {
    if (scroll.prerequisites.length === 0) return true;
    return scroll.prerequisites.every(prereq => isScrollCompleted(prereq));
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'initiate': return Zap;
      case 'adept': return Code;
      case 'master': return Cpu;
      case 'sovereign': return Shield;
      default: return Flame;
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
          
          <TechnicalScrollInterface
            scroll={currentScroll}
            onSectionComplete={handleSectionComplete}
            onCodeChallengeStart={handleCodeChallengeStart}
            onCodeSubmit={handleCodeSubmit}
            completedSections={completedSections}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
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
            <Wrench className="w-10 h-10 text-primary" />
            <h1 className="font-cinzel text-4xl font-bold text-primary">
              Forging the Flame
            </h1>
          </div>
          <p className="font-orbitron text-xl text-muted-foreground max-w-3xl mx-auto">
            {FORGING_FLAME_COURSE.subtitle}
          </p>
          <p className="font-orbitron text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {FORGING_FLAME_COURSE.description}
          </p>
          
          {/* Tech Stack Display */}
          <div className="space-y-3">
            <h3 className="font-orbitron font-semibold text-primary">Sacred Tech Stack</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FORGING_FLAME_COURSE.techStack.slice(0, 8).map((tech, index) => (
                <Badge key={index} variant="secondary" className="font-space-mono">
                  {tech}
                </Badge>
              ))}
              {FORGING_FLAME_COURSE.techStack.length > 8 && (
                <Badge variant="outline" className="font-space-mono">
                  +{FORGING_FLAME_COURSE.techStack.length - 8} more
                </Badge>
              )}
            </div>
          </div>
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
                      {FORGING_FLAME_COURSE.totalScrolls}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">Technical Scrolls</div>
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {FORGING_FLAME_COURSE.totalHours}
                    </div>
                    <div className="font-orbitron text-sm text-muted-foreground">Hands-On Hours</div>
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-primary">
                      {FORGING_FLAME_COURSE.totalFlameShards}
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
              {FORGING_FLAME_COURSE.scrolls.map((scroll, index) => {
                const isCompleted = isScrollCompleted(scroll.id);
                const isUnlocked = isScrollUnlocked(scroll);
                const DifficultyIcon = getDifficultyIcon(scroll.difficulty);
                
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
                              <DifficultyIcon className="w-6 h-6 text-primary" />
                            ) : (
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            )}
                            Scroll {scroll.number}: {scroll.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("font-orbitron", getDifficultyColor(scroll.difficulty))}>
                              {scroll.difficulty.toUpperCase()}
                            </Badge>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {scroll.totalFlameShards} FlameShards
                            </Badge>
                          </div>
                        </div>
                        <p className="font-orbitron text-muted-foreground">
                          {scroll.subtitle}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="font-orbitron text-sm mb-4">
                          {scroll.summary}
                        </p>
                        
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {scroll.techStack.slice(0, 4).map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="font-space-mono text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {scroll.techStack.length > 4 && (
                            <Badge variant="outline" className="font-space-mono text-xs">
                              +{scroll.techStack.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm font-space-mono text-muted-foreground">
                            <span>{scroll.estimatedHours}h</span>
                            <span>{scroll.sections.length} sections</span>
                            <span>1 code challenge</span>
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
            
            {/* Prerequisites */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {FORGING_FLAME_COURSE.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2 font-orbitron text-sm">
                      <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
