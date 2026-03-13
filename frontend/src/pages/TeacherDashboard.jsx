import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/common/Loader';
import { dashboardApi } from '@/services/api';
import { BookOpen, FileText, Users, TrendingUp } from 'lucide-react';

export const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardApi.getTeacherStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'My Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Exams',
      value: stats?.totalExams || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Average Score',
      value: `${stats?.avgScore || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and track student performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-semibold mt-2">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/exams/create"
                  className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <h3 className="font-medium">Create New Exam</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up a new exam for your students
                  </p>
                </a>
                <a
                  href="/questions"
                  className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <h3 className="font-medium">Add Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Build your question bank
                  </p>
                </a>
                <a
                  href="/results"
                  className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <h3 className="font-medium">View Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Check student performance
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <h3 className="font-medium">Mathematics Midterm</h3>
                  <p className="text-sm text-muted-foreground">March 15, 2026 at 9:00 AM</p>
                  <p className="text-sm text-muted-foreground">45 students enrolled</p>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <h3 className="font-medium">CS Final Exam</h3>
                  <p className="text-sm text-muted-foreground">April 1, 2026 at 10:00 AM</p>
                  <p className="text-sm text-muted-foreground">58 students enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
