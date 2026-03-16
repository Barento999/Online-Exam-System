import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const StudentProfile = ({ student, className }) => {
  // Mock student data - in real app this would come from auth context or API
  const studentData = student || {
    id: "STU001",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: null,
    enrollmentDate: "2024-09-01",
    year: "3rd Year",
    major: "Computer Science",
    gpa: 3.85,
    totalCredits: 95,
    status: "Active",
    achievements: [
      { name: "Dean's List", semester: "Fall 2025" },
      { name: "Outstanding Performance", subject: "Mathematics" },
      { name: "Perfect Attendance", semester: "Spring 2025" },
    ],
    currentSemester: {
      courses: 6,
      credits: 18,
      semester: "Spring 2026",
    },
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "probation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.7) return "text-green-600";
    if (gpa >= 3.0) return "text-blue-600";
    if (gpa >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-top-4 duration-600",
        className,
      )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentData.avatar} alt={studentData.name} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(studentData.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{studentData.name}</h3>
              <Badge className={getStatusColor(studentData.status)}>
                {studentData.status}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {studentData.email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Enrolled:{" "}
                {new Date(studentData.enrollmentDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {studentData.major} • {studentData.year}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg">
          <div className="text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                getGpaColor(studentData.gpa),
              )}>
              {studentData.gpa}
            </div>
            <div className="text-xs text-muted-foreground">GPA</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {studentData.totalCredits}
            </div>
            <div className="text-xs text-muted-foreground">Total Credits</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {studentData.currentSemester.courses}
            </div>
            <div className="text-xs text-muted-foreground">Current Courses</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {studentData.currentSemester.credits}
            </div>
            <div className="text-xs text-muted-foreground">This Semester</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </h4>

          <div className="space-y-2">
            {studentData.achievements.slice(0, 3).map((achievement, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg bg-accent/30",
                  "animate-in fade-in slide-in-from-left-2",
                )}
                style={{
                  animationDelay: `${600 + index * 100}ms`,
                  animationDuration: "400ms",
                  animationFillMode: "both",
                }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.semester || achievement.subject}
                    </div>
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Current Semester Info */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Current Semester</h4>
            <Badge variant="outline">
              {studentData.currentSemester.semester}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>{studentData.currentSemester.courses} Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span>{studentData.currentSemester.credits} Credits</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
