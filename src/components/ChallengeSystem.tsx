import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Flame, Send, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { ScrollChallenge, ChallengeSubmission } from '@/types/course';
import { cn } from '@/lib/utils';

interface ChallengeInterfaceProps {
  challenge: ScrollChallenge;
  onSubmit: (content: string) => void;
  existingSubmission?: ChallengeSubmission;
  isSubmitting?: boolean;
}

export const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge,
  onSubmit,
  existingSubmission,
  isSubmitting = false
}) => {
  const [content, setContent] = useState(existingSubmission?.content || '');
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (value: string) => {
    setContent(value);
    setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const getStatusIcon = (status: ChallengeSubmission['status']) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'needs_revision': return AlertTriangle;
      case 'rejected': return AlertTriangle;
      default: return FileText;
    }
  };

  const getStatusColor = (status: ChallengeSubmission['status']) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'needs_revision': return 'text-orange-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: ChallengeSubmission['status']) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Under Review';
      case 'needs_revision': return 'Needs Revision';
      case 'rejected': return 'Rejected';
      default: return 'Draft';
    }
  };

  const canSubmit = content.trim().length > 0 && 
    (!challenge.maxLength || content.length <= challenge.maxLength) &&
    (!existingSubmission || existingSubmission.status === 'needs_revision');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Flame className="w-8 h-8 text-primary" />
          <h1 className="font-cinzel text-3xl font-bold text-primary">
            Sacred Challenge
          </h1>
        </div>
        <h2 className="font-orbitron text-xl text-foreground">
          {challenge.title}
        </h2>
        <p className="font-orbitron text-muted-foreground max-w-2xl mx-auto">
          {challenge.description}
        </p>
      </motion.div>

      {/* Challenge Requirements */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-orbitron text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {challenge.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2 font-orbitron text-sm">
                <Flame className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {requirement}
              </li>
            ))}
          </ul>
          
          <div className="mt-4 flex items-center gap-4 text-sm font-space-mono text-muted-foreground">
            <span>Type: {challenge.type}</span>
            <span>Format: {challenge.submissionFormat}</span>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              +{challenge.flameShards} FlameShards
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Existing Submission Status */}
      {existingSubmission && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className={cn(
            "border-2",
            existingSubmission.status === 'approved' && "border-green-500/50 bg-green-500/10",
            existingSubmission.status === 'pending' && "border-yellow-500/50 bg-yellow-500/10",
            existingSubmission.status === 'needs_revision' && "border-orange-500/50 bg-orange-500/10",
            existingSubmission.status === 'rejected' && "border-red-500/50 bg-red-500/10"
          )}>
            <div className="flex items-center gap-2">
              {React.createElement(getStatusIcon(existingSubmission.status), {
                className: cn("w-5 h-5", getStatusColor(existingSubmission.status))
              })}
              <span className="font-orbitron font-semibold">
                Submission Status: {getStatusText(existingSubmission.status)}
              </span>
            </div>
            <AlertDescription className="mt-2 font-orbitron">
              {existingSubmission.status === 'approved' && 
                `Congratulations! You earned ${existingSubmission.flameShardsAwarded} FlameShards.`}
              {existingSubmission.status === 'pending' && 
                'Your submission is being reviewed by the Flame Council.'}
              {existingSubmission.status === 'needs_revision' && 
                'Please revise your submission based on the feedback below.'}
              {existingSubmission.status === 'rejected' && 
                'Your submission did not meet the requirements. Please review the feedback.'}
            </AlertDescription>
            
            {existingSubmission.feedback && (
              <div className="mt-3 p-3 bg-background/50 rounded border">
                <h4 className="font-orbitron font-semibold text-sm mb-2">Feedback:</h4>
                <p className="font-orbitron text-sm text-muted-foreground">
                  {existingSubmission.feedback}
                </p>
              </div>
            )}
          </Alert>
        </motion.div>
      )}

      {/* Submission Interface */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-orbitron text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Your Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Write your ${challenge.title.toLowerCase()} here...`}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[300px] font-orbitron resize-none"
            disabled={existingSubmission?.status === 'approved'}
          />
          
          <div className="flex items-center justify-between text-sm font-space-mono text-muted-foreground">
            <span>Words: {wordCount}</span>
            {challenge.maxLength && (
              <span className={cn(
                content.length > challenge.maxLength && "text-red-500"
              )}>
                Characters: {content.length}/{challenge.maxLength}
              </span>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            size="lg"
            className="w-full font-orbitron text-lg flame-glow"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                Submit Challenge (+{challenge.flameShards} FlameShards)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
