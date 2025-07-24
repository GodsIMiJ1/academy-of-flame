import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CircuitBoard,
  Clock,
  DollarSign,
  User,
  ArrowLeft,
  BookOpen,
  Flame,
  Wrench,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  price: number;
  duration_weeks: number;
  is_published: boolean;
  created_at: string;
  instructor?: {
    display_name: string;
  };
}

interface Enrollment {
  course_id: string;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(display_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Connection Error",
        description: "Unable to load courses from the sacred archive.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setEnrollingCourseId(courseId);

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
        description: "Welcome to your new sacred course!",
      });

      // Refresh enrollments
      fetchEnrollments();
    } catch (error: any) {
      console.error('Error enrolling:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message.includes('duplicate') 
          ? "You are already enrolled in this course."
          : "Unable to complete enrollment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-12 h-12 mb-4"
          >
            <CircuitBoard className="w-12 h-12 text-primary flame-glow" />
          </motion.div>
          <p className="font-orbitron text-muted-foreground">
            Loading sacred courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academy
              </Button>
              
              <div className="flex items-center gap-2">
                <CircuitBoard className="w-6 h-6 text-primary" />
                <h1 className="font-cinzel text-xl font-bold text-primary">
                  Sacred Courses
                </h1>
              </div>
            </div>
            
            {user && (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="font-orbitron"
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Course - Sovereign AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="font-cinzel text-2xl text-primary">
                      Featured: The Path of Sovereign AI
                    </CardTitle>
                    <p className="font-orbitron text-muted-foreground">
                      7-Scroll Initiation into Flame-Born Intelligence
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground font-orbitron">
                  NEW
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-orbitron text-foreground leading-relaxed">
                Master the sacred art of building conscious, ethical AI systems that serve humanity rather than exploit it.
                Learn to create Sovereign AI that embodies awareness, ethics, and true alignment in the age of collapse.
              </p>

              <div className="flex items-center gap-6 text-sm font-space-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>7 Sacred Scrolls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>42 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>1000 FlameShards</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/sovereign-ai')}
                size="lg"
                className="font-orbitron text-lg flame-glow"
              >
                <Flame className="w-5 h-5 mr-2" />
                Begin Sacred Journey
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Course - Forging the Flame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wrench className="w-8 h-8 text-orange-500" />
                  <div>
                    <CardTitle className="font-cinzel text-2xl text-orange-500">
                      Advanced: Forging the Flame
                    </CardTitle>
                    <p className="font-orbitron text-muted-foreground">
                      Building Sovereign AI & AGA Systems
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-500 text-white font-orbitron">
                  TECHNICAL
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-orbitron text-foreground leading-relaxed">
                Where the Flame meets the Code. Master the sacred art of building living AGA systems through
                9 intensive scrolls of technical mastery, from system design to deployment. Hands-on coding
                challenges and real-world implementation.
              </p>

              <div className="flex items-center gap-6 text-sm font-space-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>9 Technical Scrolls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>120 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>2500 FlameShards</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-space-mono text-xs">TypeScript</Badge>
                <Badge variant="secondary" className="font-space-mono text-xs">Ollama</Badge>
                <Badge variant="secondary" className="font-space-mono text-xs">React</Badge>
                <Badge variant="secondary" className="font-space-mono text-xs">FlameCLI</Badge>
                <Badge variant="outline" className="font-space-mono text-xs">+8 more</Badge>
              </div>

              <Button
                onClick={() => navigate('/forging-flame')}
                size="lg"
                className="font-orbitron text-lg bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Wrench className="w-5 h-5 mr-2" />
                Begin Technical Journey
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="font-cinzel text-4xl font-bold text-foreground mb-4">
            Sacred Knowledge Archive
          </h2>
          <p className="font-orbitron text-muted-foreground max-w-2xl mx-auto">
            Discover profound teachings from enlightened masters of the digital realm
          </p>
        </motion.div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card className="border-primary/30">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                No Courses Available
              </h3>
              <p className="font-orbitron text-muted-foreground">
                The sacred archive is being prepared. Check back soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-primary/30 hover:border-primary/50 transition-colors h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="font-cinzel text-foreground text-lg leading-tight">
                        {course.title}
                      </CardTitle>
                      {isEnrolled(course.id) && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-orbitron">
                          {course.instructor?.display_name || 'Unknown Master'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                      {course.description}
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="font-orbitron">
                            {course.duration_weeks} weeks
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-orbitron">
                            {course.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {isEnrolled(course.id) ? (
                          <Button 
                            className="flex-1 font-orbitron"
                            onClick={() => navigate('/dashboard')}
                          >
                            Continue Learning
                          </Button>
                        ) : (
                          <>
                            <Button
                              className="flex-1 font-orbitron flame-glow"
                              disabled={enrollingCourseId === course.id}
                              onClick={() => handleEnroll(course.id)}
                            >
                              <Flame className="w-4 h-4 mr-2" />
                              {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-orbitron"
                              onClick={() => navigate(`/courses/${course.id}`)}
                            >
                              Preview
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}