import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut,
  Plus,
  Users,
  CircuitBoard,
  Flame,
  MessageCircle,
  Award,
  Download
} from 'lucide-react';
import { KnowledgePathway } from '@/components/KnowledgePathway';
import { CertificateGenerator } from '@/components/CertificateGenerator';
import { WhisperNetQA } from '@/components/WhisperNetQA';
import { InstructorAI } from '@/components/InstructorAI';
import { GhostScrollVault } from '@/components/GhostScrollVault';

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
  id: string;
  course_id: string;
  progress: number;
  status: string;
  enrolled_at: string;
  course: Course;
}

interface Profile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch enrollments with course details
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            *,
            instructor:profiles(display_name)
          )
        `)
        .eq('user_id', user?.id);
      
      setEnrollments(enrollmentData || []);

      // Fetch courses created by this user (instructor view)
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user?.id);
      
      setMyCourses(coursesData || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
            Loading sacred dashboard...
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
              <CircuitBoard className="w-8 h-8 text-primary" />
              <h1 className="font-cinzel text-2xl font-bold text-primary">
                REFLECT Academy
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-cinzel text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.display_name || 'Sacred Initiate'}
          </h2>
          <p className="font-orbitron text-muted-foreground">
            Continue your journey through the digital realm
          </p>
        </motion.div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="student" className="font-orbitron">
              <GraduationCap className="w-4 h-4 mr-2" />
              Student
            </TabsTrigger>
            <TabsTrigger value="instructor" className="font-orbitron">
              <BookOpen className="w-4 h-4 mr-2" />
              Instructor
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-orbitron">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Student Dashboard */}
          <TabsContent value="student" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="font-orbitron text-sm text-muted-foreground">
                    Active Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-cinzel font-bold text-primary">
                    {enrollments.filter(e => e.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="font-orbitron text-sm text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-cinzel font-bold text-green-400">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="font-orbitron text-sm text-muted-foreground">
                    Total Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-cinzel font-bold text-blue-400">
                    {enrollments.length > 0 
                      ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Knowledge Pathway Visualization */}
            {enrollments.length > 0 && (
              <KnowledgePathway 
                nodes={enrollments.map((e, index) => ({
                  id: e.id,
                  title: e.course.title.slice(0, 20) + '...',
                  isCompleted: e.status === 'completed',
                  isUnlocked: true,
                  isCurrent: e.status === 'active' && index === 0,
                  progress: e.progress || 0
                }))}
                totalProgress={enrollments.length > 0 
                  ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
                  : 0}
              />
            )}

            {/* Certificate Generation */}
            {enrollments.filter(e => e.progress === 100).length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {enrollments.filter(e => e.progress === 100).map((enrollment) => (
                  <CertificateGenerator
                    key={enrollment.id}
                    enrollment={enrollment}
                    studentName={profile?.display_name || 'Sacred Initiate'}
                  />
                ))}
              </div>
            )}

            {/* WhisperNet Q&A */}
            {enrollments.length > 0 && (
              <WhisperNetQA courseId={enrollments[0]?.course_id} />
            )}

            {/* GhostScroll Vault */}
            {enrollments.length > 0 && (
              <GhostScrollVault 
                courseProgress={enrollments.length > 0 
                  ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
                  : 0}
              />
            )}

            {/* Enrolled Courses */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Your Sacred Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-orbitron text-muted-foreground">
                      No courses enrolled yet. Begin your journey!
                    </p>
                    <Button 
                      className="mt-4 font-orbitron" 
                      onClick={() => window.location.href = '/courses'}
                    >
                      Explore Courses
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-cinzel font-bold text-foreground mb-2">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {enrollment.course.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                                {enrollment.status}
                              </Badge>
                              <span className="text-xs font-orbitron text-muted-foreground">
                                {enrollment.course.duration_weeks} weeks
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-orbitron text-muted-foreground">Progress</span>
                                <span className="font-orbitron text-primary">{enrollment.progress || 0}%</span>
                              </div>
                              <Progress 
                                value={enrollment.progress || 0} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" className="font-orbitron">
                              Continue
                            </Button>
                            <Button size="sm" variant="outline" className="font-orbitron">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Q&A
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructor Dashboard */}
          <TabsContent value="instructor" className="space-y-6">
            {/* Instructor AI Assistant */}
            <InstructorAI />

            <div className="flex justify-between items-center">
              <h3 className="font-cinzel text-2xl font-bold text-foreground">
                Your Sacred Teachings
              </h3>
              <Button className="font-orbitron flame-glow">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>

            {myCourses.length === 0 ? (
              <Card className="border-primary/30">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                    Begin Teaching
                  </h3>
                  <p className="font-orbitron text-muted-foreground mb-6">
                    Share your sacred knowledge with future initiates
                  </p>
                  <Button className="font-orbitron flame-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myCourses.map((course) => (
                  <Card key={course.id} className="border-primary/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="font-cinzel text-foreground">
                          {course.title}
                        </CardTitle>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="font-orbitron text-muted-foreground">
                          ${course.price}
                        </span>
                        <span className="font-orbitron text-muted-foreground">
                          {course.duration_weeks} weeks
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="font-orbitron">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="font-orbitron">
                          <Users className="w-4 h-4 mr-1" />
                          Students
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sacred Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl">
                      {profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-foreground">
                      {profile?.display_name || 'Sacred Initiate'}
                    </h3>
                    <p className="font-orbitron text-muted-foreground">
                      {user?.email}
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 font-orbitron">
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-orbitron text-sm text-muted-foreground">
                      Sacred Bio
                    </label>
                    <p className="mt-1 text-foreground">
                      {profile?.bio || 'No bio added yet'}
                    </p>
                  </div>
                  
                  <Button className="font-orbitron">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Future Features Placeholder */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">
                  Sacred Tools (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border border-primary/20 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-orbitron text-sm text-muted-foreground">
                      Sacred Messaging
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border border-primary/20 rounded-lg">
                    <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-orbitron text-sm text-muted-foreground">
                      Certificates
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border border-primary/20 rounded-lg">
                    <Download className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-orbitron text-sm text-muted-foreground">
                      Resources
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}