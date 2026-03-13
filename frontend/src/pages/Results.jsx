import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/common/Loader';
import { resultsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Trophy, TrendingUp, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export const Results = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();
  const location = useLocation();
  const newResult = location.state?.result;

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((result) => result.status === filterStatus);
    }

    setFilteredResults(filtered);
  }, [searchTerm, filterStatus, results]);

  const loadResults = async () => {
    try {
      let response;
      if (user?.role === 'student') {
        response = await resultsApi.getByStudent(user.id);
      } else {
        response = await resultsApi.getAll();
      }
      setResults(response.data);
      setFilteredResults(response.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (results.length === 0) return { avg: 0, highest: 0, lowest: 0, passRate: 0 };

    const scores = results.map((r) => r.percentage);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter((r) => r.status === 'passed').length;
    const passRate = Math.round((passed / results.length) * 100);

    return { avg, highest, lowest, passRate };
  };

  const stats = calculateStats();

  const exportToCSV = () => {
    const headers = ['Exam Name', 'Student', 'Score', 'Total Marks', 'Percentage', 'Status', 'Submitted At'];
    const rows = filteredResults.map((r) => [
      r.examName,
      r.studentName || 'N/A',
      r.score,
      r.totalMarks,
      r.percentage + '%',
      r.status,
      new Date(r.submittedAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-results.csv';
    a.click();
    toast.success('Results exported successfully');
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Exam Results</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' ? 'View your exam results' : 'View all student results'}
            </p>
          </div>
          {user?.role !== 'student' && (
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>

        {newResult && (
          <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">Exam Submitted Successfully!</h3>
                  <p className="text-muted-foreground">
                    You scored {newResult.score} out of {newResult.totalMarks} marks ({newResult.percentage}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Result</p>
                  <Badge
                    variant={newResult.status === 'passed' ? 'default' : 'destructive'}
                    className="mt-1 text-lg px-4 py-1"
                  >
                    {newResult.status === 'passed' ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role !== 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-semibold mt-2">{stats.avg}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Score</p>
                    <p className="text-3xl font-semibold mt-2">{stats.highest}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest Score</p>
                    <p className="text-3xl font-semibold mt-2">{stats.lowest}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                    <p className="text-3xl font-semibold mt-2">{stats.passRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams or students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    {user?.role !== 'student' && <TableHead>Student</TableHead>}
                    <TableHead>Score</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={user?.role === 'student' ? 6 : 7} className="text-center text-muted-foreground">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.examName}</TableCell>
                        {user?.role !== 'student' && <TableCell>{result.studentName}</TableCell>}
                        <TableCell>{result.score}</TableCell>
                        <TableCell>{result.totalMarks}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            result.percentage >= 70 ? 'text-green-600' :
                            result.percentage >= 40 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {result.percentage}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(result.submittedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
