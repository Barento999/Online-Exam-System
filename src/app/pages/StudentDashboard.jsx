import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader } from '../components/Loader';
import { dashboardApi } from '../services/api';
import { BookOpen, FileText, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

export const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardApi.getStudentStats();
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
      title: 'Enrolled Courses',
      value: stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Completed Exams',
      value: stats?.completedExams || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Upcoming Exams',
      value: stats?.upcomingExams || 0,
      icon: Clock,
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
          <h1 className="text-3xl font-semibold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and upcoming exams
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
              <CardTitle>Available Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">Mathematics Midterm</h3>
                      <p className="text-sm text-muted-foreground">Mathematics 101</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs rounded">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Duration: 90 minutes</p>
                      <p>Total Marks: 100</p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/exams/1/take')}>
                      Start Exam
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">Physics Quiz 1</h3>
                      <p className="text-sm text-muted-foreground">Physics Advanced</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs rounded">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Duration: 45 minutes</p>
                      <p>Total Marks: 50</p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/exams/2/take')}>
                      Start Exam
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                  <div>
                    <h3 className="font-medium">Mathematics Midterm</h3>
                    <p className="text-sm text-muted-foreground">Submitted: Mar 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-green-600">85%</p>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                  <div>
                    <h3 className="font-medium">Physics Quiz 1</h3>
                    <p className="text-sm text-muted-foreground">Submitted: Mar 20, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-green-600">84%</p>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
