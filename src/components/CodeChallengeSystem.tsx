import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Terminal,
  Flame,
  Clock,
  Target
} from 'lucide-react';
import { CodeChallenge, CodeSubmission, TestResult } from '@/types/technical-course';
import { cn } from '@/lib/utils';

interface CodeChallengeInterfaceProps {
  challenge: CodeChallenge;
  onSubmit: (code: string) => void;
  existingSubmission?: CodeSubmission;
  isRunning?: boolean;
}

export const CodeChallengeInterface: React.FC<CodeChallengeInterfaceProps> = ({
  challenge,
  onSubmit,
  existingSubmission,
  isRunning = false
}) => {
  const [code, setCode] = useState(existingSubmission?.code || challenge.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const handleRunCode = () => {
    // Simulate code execution and testing
    const mockResults: TestResult[] = challenge.tests.map(test => ({
      testId: test.id,
      passed: Math.random() > 0.3, // Mock test results
      actualOutput: 'Mock output',
      expectedOutput: test.expectedOutput,
      executionTime: Math.random() * 100
    }));
    
    setTestResults(mockResults);
  };

  const handleSubmit = () => {
    onSubmit(code);
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

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);
  const hasFailedTests = testResults.some(result => !result.passed);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Code className="w-8 h-8 text-primary" />
          <h1 className="font-cinzel text-3xl font-bold text-primary">
            Sacred Code Challenge
          </h1>
        </div>
        <h2 className="font-orbitron text-xl text-foreground">
          {challenge.title}
        </h2>
        <p className="font-orbitron text-muted-foreground max-w-3xl mx-auto">
          {challenge.description}
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Badge className={cn("font-orbitron", getDifficultyColor(challenge.difficulty))}>
            {challenge.difficulty.toUpperCase()}
          </Badge>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Flame className="w-3 h-3 mr-1" />
            {challenge.flameShards} FlameShards
          </Badge>
          <Badge variant="outline" className="font-space-mono">
            {challenge.language.toUpperCase()}
          </Badge>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-orbitron text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Sacred Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-background border border-primary/20 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Write your sacred code here..."
              spellCheck={false}
            />
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="font-orbitron"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Test Code'}
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!allTestsPassed || isRunning}
                className="font-orbitron flame-glow"
              >
                <Flame className="w-4 h-4 mr-2" />
                Submit Solution
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowHints(!showHints)}
                className="font-orbitron"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results & Info */}
        <div className="space-y-6">
          {/* Test Results */}
          {testResults.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={result.testId}
                      className={cn(
                        "flex items-center justify-between p-3 rounded border",
                        result.passed 
                          ? "border-green-500/30 bg-green-500/10" 
                          : "border-red-500/30 bg-red-500/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-orbitron text-sm">
                          Test {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-space-mono text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {result.executionTime.toFixed(1)}ms
                      </div>
                    </div>
                  ))}
                </div>
                
                {allTestsPassed && (
                  <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <AlertDescription className="font-orbitron text-green-700">
                      All tests passed! Your code is ready for submission.
                    </AlertDescription>
                  </Alert>
                )}
                
                {hasFailedTests && (
                  <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="font-orbitron text-red-700">
                      Some tests failed. Review your code and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Hints */}
          {showHints && challenge.hints.length > 0 && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg flex items-center gap-2 text-yellow-600">
                  <Lightbulb className="w-5 h-5" />
                  Sacred Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {challenge.hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2 font-orbitron text-sm">
                      <Flame className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {hint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Challenge Info */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg">Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-orbitron font-semibold text-sm mb-2">Language:</h4>
                <Badge variant="outline" className="font-space-mono">
                  {challenge.language.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-orbitron font-semibold text-sm mb-2">Difficulty:</h4>
                <Badge className={cn("font-orbitron", getDifficultyColor(challenge.difficulty))}>
                  {challenge.difficulty.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-orbitron font-semibold text-sm mb-2">Reward:</h4>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Flame className="w-3 h-3 mr-1" />
                  {challenge.flameShards} FlameShards
                </Badge>
              </div>
              
              {challenge.tests.length > 0 && (
                <div>
                  <h4 className="font-orbitron font-semibold text-sm mb-2">Tests:</h4>
                  <p className="font-space-mono text-xs text-muted-foreground">
                    {challenge.tests.length} test{challenge.tests.length !== 1 ? 's' : ''} to pass
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
