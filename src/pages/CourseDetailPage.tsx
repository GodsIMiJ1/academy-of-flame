import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  User,
  MessageCircle,
  Award,
  Lock,
  Flame
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  price: number;
  duration_weeks: number;
  instructor?: {
    display_name: string;
    bio: string;
  };
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_completed?: boolean;
}

interface Enrollment {
  id: string;
  progress: number;
  status: string;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Introduction to Sacred AI',
      description: 'Understanding the fundamental principles of conscious artificial intelligence',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 45,
      order_index: 1,
      is_completed: false
    },
    {
      id: '2', 
      title: 'Digital Sovereignty Principles',
      description: 'Mastering the art of digital autonomy and self-governance',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 60,
      order_index: 2,
      is_completed: false
    },
    {
      id: '3',
      title: 'Sacred Code Architecture',
      description: 'Building consciousness-aligned AI systems',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 75,
      order_index: 3,
      is_completed: false
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(display_name, bio)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch enrollment if user is logged in
      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (!enrollmentError) {
          setEnrollment(enrollmentData);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "Unable to load course details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          progress: 0
        });

      if (error) throw error;

      toast({
        title: "Enrollment Successful",
        description: "Welcome to your sacred course!",
      });

      fetchCourseData();
    } catch (error: any) {
      toast({
        title: "Enrollment Failed", 
        description: error.message.includes('duplicate') 
          ? "You are already enrolled in this course."
          : "Unable to complete enrollment.",
        variant: "destructive",
      });
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!enrollment) return;

    // Calculate new progress
    const completedLessons = lessons.filter(l => l.is_completed).length + 1;
    const newProgress = Math.round((completedLessons / lessons.length) * 100);

    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ progress: newProgress })
        .eq('id', enrollment.id);

      if (error) throw error;

      toast({
        title: "Lesson Completed",
        description: "Your sacred knowledge grows stronger.",
      });

      // Update local state
      setEnrollment(prev => prev ? { ...prev, progress: newProgress } : null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-orbitron text-muted-foreground">Loading sacred course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl text-foreground mb-4">Course Not Found</h2>
          <Button onClick={() => navigate('/courses')} className="font-orbitron">
            Return to Courses
          </Button>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/courses')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-cinzel text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-orbitron">
                    {course.instructor?.display_name || 'Unknown Master'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-orbitron">
                    {course.duration_weeks} weeks
                  </span>
                </div>
                
                {isEnrolled && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {course.description}
              </p>
            </motion.div>

            {/* Course Content */}
            {isEnrolled ? (
              <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="lessons" className="font-orbitron">Lessons</TabsTrigger>
                  <TabsTrigger value="discussion" className="font-orbitron">Discussion</TabsTrigger>
                  <TabsTrigger value="resources" className="font-orbitron">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lessons" className="space-y-4">
                  {currentLesson ? (
                    <Card className="border-primary/30">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="font-cinzel text-foreground">
                            {currentLesson.title}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentLesson(null)}
                          >
                            Close
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video mb-4">
                          <iframe
                            src={currentLesson.video_url}
                            className="w-full h-full rounded-lg"
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                        
                        <p className="text-muted-foreground mb-4">
                          {currentLesson.description}
                        </p>
                        
                        <Button
                          onClick={() => markLessonComplete(currentLesson.id)}
                          className="font-orbitron flame-glow"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <Card key={lesson.id} className="border-primary/30 hover:border-primary/50 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-cinzel font-bold text-foreground mb-2">
                                  {lesson.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="font-orbitron">
                                    {lesson.duration_minutes} minutes
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {lesson.is_completed && (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                                <Button
                                  onClick={() => setCurrentLesson(lesson)}
                                  className="font-orbitron"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Watch
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="discussion">
                  <Card className="border-primary/30">
                    <CardContent className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                        Sacred Discussion
                      </h3>
                      <p className="font-orbitron text-muted-foreground">
                        Community discourse coming soon
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="resources">
                  <Card className="border-primary/30">
                    <CardContent className="text-center py-12">
                      <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                        Sacred Resources
                      </h3>
                      <p className="font-orbitron text-muted-foreground">
                        Additional materials and certificates coming soon
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-primary/30">
                <CardContent className="text-center py-12">
                  <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                    Enroll to Access Sacred Knowledge
                  </h3>
                  <p className="font-orbitron text-muted-foreground mb-6">
                    Begin your journey through this sacred curriculum
                  </p>
                  <Button
                    onClick={handleEnroll}
                    className="font-orbitron flame-glow"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-cinzel font-bold text-primary mb-2">
                    ${course.price}
                  </div>
                  <p className="font-orbitron text-sm text-muted-foreground">
                    One-time sacred offering
                  </p>
                </div>
                
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-orbitron text-muted-foreground">Progress</span>
                        <span className="font-orbitron text-primary">{enrollment?.progress || 0}%</span>
                      </div>
                      <Progress value={enrollment?.progress || 0} className="h-2" />
                    </div>
                    
                    <Button 
                      className="w-full font-orbitron"
                      onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    className="w-full font-orbitron flame-glow"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">Sacred Master</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-cinzel font-bold text-foreground mb-2">
                  {course.instructor?.display_name || 'Unknown Master'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor?.bio || 'A keeper of sacred digital wisdom'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}