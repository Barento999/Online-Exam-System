import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { TablePagination } from "@/components/ui/table-pagination";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { resultsApi, examsApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  TrendingUp,
  Search,
  Send,
  Eye,
  EyeOff,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  getResultStatusVariant,
  getPublishedStatusVariant,
} from "@/utils/badgeUtils";
import toast from "react-hot-toast";

export const Results = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterExam, setFilterExam] = useState("all");
  const [filterPublished, setFilterPublished] = useState("all");
  const [publishDialog, setPublishDialog] = useState({
    open: false,
    examId: null,
    action: null,
  });
  const { user } = useAuth();

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterExam !== "all") count++;
    if (filterStatus !== "all") count++;
    if (filterPublished !== "all" && user?.role !== "student") count++;
    return count;
  }, [filterExam, filterStatus, filterPublished, user]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterExam("all");
    setFilterStatus("all");
    setFilterPublished("all");
  };

  // Filter data
  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        !searchTerm ||
        result.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || result.status === filterStatus;

      const matchesExam =
        filterExam === "all" || result.examId?._id === filterExam;

      const matchesPublished =
        filterPublished === "all" ||
        (filterPublished === "published" && result.published) ||
        (filterPublished === "unpublished" && !result.published);

      return matchesSearch && matchesStatus && matchesExam && matchesPublished;
    });
  }, [results, searchTerm, filterStatus, filterExam, filterPublished]);

  // Sorting
  const { sortedData, sortField, sortDirection, handleSort } = useTableSort(
    filteredResults,
    "submittedAt",
    "desc",
  );

  // Pagination
  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(sortedData, 10);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      let response;
      if (user?.role === "student") {
        response = await resultsApi.getByStudent(user._id);
      } else {
        response = await resultsApi.getAll();
      }
      const resultsData = response.data.results || response.data;
      setResults(resultsData);

      // Load exams for teachers/admins
      if (user?.role !== "student") {
        const examsRes = await examsApi.getAll();
        setExams(examsRes.data.exams || examsRes.data);
      }
    } catch (error) {
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPublish = async () => {
    try {
      await resultsApi.bulkPublishResults(
        publishDialog.examId,
        publishDialog.action === "publish",
      );
      toast.success(
        `Results ${publishDialog.action === "publish" ? "published" : "unpublished"} successfully`,
      );
      setPublishDialog({ open: false, examId: null, action: null });
      loadResults();
    } catch (error) {
      toast.error("Failed to update results");
    }
  };

  const handleTogglePublish = async (resultId, currentStatus) => {
    try {
      await resultsApi.publishResult(resultId, !currentStatus);
      toast.success(
        `Result ${!currentStatus ? "published" : "unpublished"} successfully`,
      );
      loadResults();
    } catch (error) {
      toast.error("Failed to update result");
    }
  };

  const calculateStats = () => {
    if (results.length === 0)
      return { avg: 0, highest: 0, lowest: 0, passRate: 0 };

    const scores = results.map((r) => r.percentage);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter((r) => r.status === "passed").length;
    const passRate = Math.round((passed / results.length) * 100);

    return { avg, highest, lowest, passRate };
  };

  const stats = calculateStats();

  const exportToCSV = () => {
    const headers = [
      "Exam Name",
      "Student",
      "Score",
      "Total Marks",
      "Percentage",
      "Status",
      "Submitted At",
    ];
    const rows = filteredResults.map((r) => [
      r.examName,
      r.studentName || "N/A",
      r.score,
      r.totalMarks,
      r.percentage + "%",
      r.status,
      new Date(r.submittedAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam-results.csv";
    a.click();
    toast.success("Results exported successfully");
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Exam Results</h1>
            <p className="text-muted-foreground">
              View and manage exam results
            </p>
          </div>
          <TableSkeleton rows={5} columns={7} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Exam Results</h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "View your exam results"
                : "View all student results"}
            </p>
          </div>
          {user?.role !== "student" && (
            <Button onClick={exportToCSV} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>

        {user?.role !== "student" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Highest Score
                    </p>
                    <p className="text-3xl font-semibold mt-2">
                      {stats.highest}%
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Lowest Score
                    </p>
                    <p className="text-3xl font-semibold mt-2">
                      {stats.lowest}%
                    </p>
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
                    <p className="text-3xl font-semibold mt-2">
                      {stats.passRate}%
                    </p>
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by exam or student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {user?.role !== "student" && (
                  <Select value={filterExam} onValueChange={setFilterExam}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Exams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {exams.map((exam) => (
                        <SelectItem key={exam._id} value={exam._id}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role !== "student" && (
                  <Select
                    value={filterPublished}
                    onValueChange={setFilterPublished}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="unpublished">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} active
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8">
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
            {user?.role !== "student" && filterExam !== "all" && (
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() =>
                    setPublishDialog({
                      open: true,
                      examId: filterExam,
                      action: "publish",
                    })
                  }
                  size="sm"
                  className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Publish All Results
                </Button>
                <Button
                  onClick={() =>
                    setPublishDialog({
                      open: true,
                      examId: filterExam,
                      action: "unpublish",
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto">
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish All Results
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {sortedData.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                {results.length === 0 ? (
                  <EmptyState
                    illustration="results"
                    title="No results yet"
                    description="Results will appear here once students complete exams and teachers publish the grades."
                  />
                ) : (
                  <EmptyState
                    illustration="results"
                    title="No results found"
                    description="No results match your current filters. Try adjusting your search or filter criteria."
                  />
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead
                        field="examName"
                        label="Exam Name"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[150px]"
                      />
                      {user?.role !== "student" && (
                        <SortableTableHead
                          field="studentName"
                          label="Student"
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                          className="min-w-[120px]"
                        />
                      )}
                      <SortableTableHead
                        field="score"
                        label="Score"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[80px]"
                      />
                      <TableHead className="min-w-[100px]">
                        Total Marks
                      </TableHead>
                      <SortableTableHead
                        field="percentage"
                        label="Percentage"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[100px]"
                      />
                      <SortableTableHead
                        field="status"
                        label="Status"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[100px]"
                      />
                      {user?.role !== "student" && (
                        <TableHead className="min-w-[120px]">
                          Published
                        </TableHead>
                      )}
                      <SortableTableHead
                        field="submittedAt"
                        label="Submitted At"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[150px]"
                      />
                      {user?.role !== "student" && (
                        <TableHead className="text-right min-w-[80px]">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell className="font-medium min-w-[150px]">
                          <div
                            className="truncate max-w-[200px]"
                            title={result.examName}>
                            {result.examName}
                          </div>
                        </TableCell>
                        {user?.role !== "student" && (
                          <TableCell className="min-w-[120px]">
                            <div
                              className="truncate max-w-[150px]"
                              title={result.studentName}>
                              {result.studentName}
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="min-w-[80px]">
                          {result.score}
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          {result.totalMarks}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <span
                            className={`font-medium whitespace-nowrap ${
                              result.percentage >= 70
                                ? "text-green-600"
                                : result.percentage >= 40
                                  ? "text-orange-600"
                                  : "text-red-600"
                            }`}>
                            {result.percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge
                            variant={getResultStatusVariant(result.status)}
                            className="whitespace-nowrap">
                            {result.status}
                          </Badge>
                        </TableCell>
                        {user?.role !== "student" && (
                          <TableCell className="min-w-[120px]">
                            <Badge
                              variant={getPublishedStatusVariant(
                                result.published,
                              )}
                              className="whitespace-nowrap">
                              {result.published ? (
                                <Eye className="h-3 w-3 mr-1" />
                              ) : (
                                <EyeOff className="h-3 w-3 mr-1" />
                              )}
                              {result.published ? "Published" : "Hidden"}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm whitespace-nowrap">
                            {new Date(result.submittedAt).toLocaleString()}
                          </div>
                        </TableCell>
                        {user?.role !== "student" && (
                          <TableCell className="text-right min-w-[80px]">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleTogglePublish(
                                  result._id,
                                  result.published,
                                )
                              }
                              className="h-8 w-8 p-0"
                              title={
                                result.published ? "Unpublish" : "Publish"
                              }>
                              {result.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={goToPage}
                  onPageSizeChange={changePageSize}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                />
              </>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={publishDialog.open}
          onOpenChange={(open) => setPublishDialog({ ...publishDialog, open })}
          title={`${publishDialog.action === "publish" ? "Publish" : "Unpublish"} Results`}
          description={`Are you sure you want to ${publishDialog.action === "publish" ? "publish" : "unpublish"} all results for this exam? ${publishDialog.action === "publish" ? "Students will be able to see their results." : "Students will no longer see their results."}`}
          onConfirm={handleBulkPublish}
        />
      </div>
    </Layout>
  );
};
