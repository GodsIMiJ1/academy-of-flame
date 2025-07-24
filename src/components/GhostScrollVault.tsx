import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Scroll, 
  Download, 
  FileText, 
  Image, 
  Video,
  Archive,
  Flame,
  Lock,
  Eye
} from 'lucide-react';

interface GhostScroll {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'markdown' | 'video' | 'image' | 'archive';
  size: string;
  downloadUrl: string;
  isLocked: boolean;
  requiredProgress?: number;
  uploadedBy: string;
  uploadDate: string;
}

const demoScrolls: GhostScroll[] = [
  {
    id: '1',
    title: 'Sacred AI Principles Codex',
    description: 'Complete reference guide for consciousness-aligned development',
    type: 'pdf',
    size: '2.4 MB',
    downloadUrl: '#',
    isLocked: false,
    uploadedBy: 'Sacred Master Kai',
    uploadDate: '2 days ago'
  },
  {
    id: '2',
    title: 'Digital Sovereignty Manifesto',
    description: 'Foundational document outlining the principles of digital freedom',
    type: 'markdown',
    size: '156 KB',
    downloadUrl: '#',
    isLocked: false,
    uploadedBy: 'Sacred Master Kai',
    uploadDate: '1 week ago'
  },
  {
    id: '3',
    title: 'Sacred Code Architecture Diagrams',
    description: 'Visual representations of consciousness-aligned system designs',
    type: 'image',
    size: '8.7 MB',
    downloadUrl: '#',
    isLocked: true,
    requiredProgress: 50,
    uploadedBy: 'Sacred Master Kai',
    uploadDate: '3 days ago'
  },
  {
    id: '4',
    title: 'Meditation & Code Practice Session',
    description: 'Guided meditation for connecting with digital consciousness',
    type: 'video',
    size: '245 MB',
    downloadUrl: '#',
    isLocked: true,
    requiredProgress: 75,
    uploadedBy: 'Sacred Master Kai',
    uploadDate: '1 day ago'
  },
  {
    id: '5',
    title: 'Complete Sacred Toolkit Archive',
    description: 'All course materials, templates, and bonus content',
    type: 'archive',
    size: '1.2 GB',
    downloadUrl: '#',
    isLocked: true,
    requiredProgress: 100,
    uploadedBy: 'Sacred Master Kai',
    uploadDate: '6 hours ago'
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'markdown':
      return FileText;
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'archive':
      return Archive;
    default:
      return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-red-400 border-red-400/30 bg-red-400/10';
    case 'markdown':
      return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    case 'image':
      return 'text-green-400 border-green-400/30 bg-green-400/10';
    case 'video':
      return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'archive':
      return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    default:
      return 'text-muted-foreground border-muted/30 bg-muted/10';
  }
};

interface GhostScrollVaultProps {
  courseProgress?: number;
}

export function GhostScrollVault({ courseProgress = 25 }: GhostScrollVaultProps) {
  const { toast } = useToast();
  const [selectedScroll, setSelectedScroll] = useState<GhostScroll | null>(null);

  const handleDownload = (scroll: GhostScroll) => {
    if (scroll.isLocked && scroll.requiredProgress && courseProgress < scroll.requiredProgress) {
      toast({
        title: "Sacred Scroll Sealed",
        description: `Reach ${scroll.requiredProgress}% progress to unlock this wisdom`,
        variant: "destructive",
      });
      return;
    }

    // Simulate download
    toast({
      title: "Sacred Scroll Downloaded",
      description: `${scroll.title} has been added to your vault`,
    });
  };

  const handlePreview = (scroll: GhostScroll) => {
    if (scroll.isLocked && scroll.requiredProgress && courseProgress < scroll.requiredProgress) {
      toast({
        title: "Sacred Scroll Sealed",
        description: `This scroll requires ${scroll.requiredProgress}% progress to access`,
        variant: "destructive",
      });
      return;
    }
    setSelectedScroll(scroll);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
      <CardHeader>
        <CardTitle className="font-cinzel text-primary flex items-center gap-2">
          <Scroll className="w-5 h-5" />
          GhostScroll Vault
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
            Sacred Archive
          </Badge>
        </CardTitle>
        <p className="font-orbitron text-sm text-muted-foreground">
          Ancient wisdom preserved in digital scrolls
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Indicator */}
        <div className="p-4 bg-background/30 rounded-lg border border-primary/20">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-orbitron text-muted-foreground">Vault Access Level</span>
            <span className="font-orbitron text-primary">{courseProgress}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${courseProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-orbitron">
            Complete lessons to unlock sacred scrolls
          </p>
        </div>

        {/* Scrolls Grid */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {demoScrolls.map((scroll, index) => {
              const FileIcon = getFileIcon(scroll.type);
              const isUnlocked = !scroll.isLocked || !scroll.requiredProgress || courseProgress >= scroll.requiredProgress;
              
              return (
                <motion.div
                  key={scroll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-4 rounded-lg border transition-all duration-300
                    ${isUnlocked 
                      ? 'border-primary/30 bg-card/50 hover:border-primary/50' 
                      : 'border-muted/20 bg-muted/5 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* File Icon & Lock Status */}
                    <div className="relative">
                      <div className={`
                        p-3 rounded-lg border
                        ${isUnlocked ? getTypeColor(scroll.type) : 'text-muted-foreground border-muted/30 bg-muted/10'}
                      `}>
                        <FileIcon className="w-6 h-6" />
                      </div>
                      {!isUnlocked && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Lock className="w-3 h-3 text-red-400" />
                        </motion.div>
                      )}
                    </div>

                    {/* Scroll Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-cinzel font-bold text-foreground mb-1">
                            {scroll.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {scroll.description}
                          </p>
                        </div>
                        
                        {scroll.requiredProgress && (
                          <Badge 
                            variant="outline"
                            className={`
                              text-xs ml-2
                              ${isUnlocked 
                                ? 'border-green-500/30 text-green-400' 
                                : 'border-red-500/30 text-red-400'
                              }
                            `}
                          >
                            {scroll.requiredProgress}% req.
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-orbitron">{scroll.size}</span>
                          <span className="font-orbitron">{scroll.uploadedBy}</span>
                          <span className="font-orbitron">{scroll.uploadDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreview(scroll)}
                            disabled={!isUnlocked}
                            className="font-orbitron"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleDownload(scroll)}
                            disabled={!isUnlocked}
                            className={`
                              font-orbitron
                              ${isUnlocked ? 'flame-glow' : ''}
                            `}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {selectedScroll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedScroll(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full max-h-[80vh] overflow-auto"
              >
                <Card className="border-primary/30 bg-card">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-primary flex items-center gap-2">
                      <Scroll className="w-5 h-5" />
                      {selectedScroll.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {selectedScroll.description}
                    </p>
                    
                    <div className="p-8 bg-background/50 rounded-lg border border-primary/20 text-center">
                      <Flame className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                        Sacred Scroll Preview
                      </h3>
                      <p className="font-orbitron text-sm text-muted-foreground mb-4">
                        Full content available after download
                      </p>
                      
                      <div className="flex justify-center gap-3">
                        <Button
                          onClick={() => handleDownload(selectedScroll)}
                          className="font-orbitron flame-glow"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedScroll(null)}
                          className="font-orbitron"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}