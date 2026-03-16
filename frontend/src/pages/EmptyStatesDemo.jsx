import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { Calendar, Award, BookOpen, BarChart3 } from "lucide-react";

export const EmptyStatesDemo = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Empty States Showcase</h1>
          <p className="text-muted-foreground">
            Beautiful empty state illustrations for various scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exams Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>No Exams Available</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                illustration="exams"
                title="No Exams Available"
                description="There are no exams scheduled at the moment. Check back later or contact your instructor."
                actionLabel="View All Exams"
                action={() => console.log("Navigate to exams")}
              />
            </CardContent>
          </Card>

          {/* Results Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>No Results Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                illustration="results"
                title="No Results Yet"
                description="You haven't completed any exams yet. Start taking exams to see your results here."
                actionLabel="Take an Exam"
                action={() => console.log("Navigate to take exam")}
              />
            </CardContent>
          </Card>

          {/* Courses Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>No Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                illustration="courses"
                title="No Courses Yet"
                description="You're not enrolled in any courses. Browse available courses and start learning today!"
                actionLabel="Browse Courses"
                action={() => console.log("Navigate to courses")}
              />
            </CardContent>
          </Card>

          {/* Data Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                illustration="data"
                title="No Analytics Data"
                description="There's no data to display yet. Complete some activities to see your analytics."
                actionLabel="Get Started"
                action={() => console.log("Get started")}
              />
            </CardContent>
          </Card>

          {/* With Icon */}
          <Card>
            <CardHeader>
              <CardTitle>Empty State with Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Calendar}
                title="No Events Scheduled"
                description="You don't have any upcoming events. Create your first event to get started."
                actionLabel="Create Event"
                action={() => console.log("Create event")}
              />
            </CardContent>
          </Card>

          {/* Simple Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Empty State</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Award}
                title="No Achievements"
                description="Complete challenges and earn achievements to showcase your progress."
              />
            </CardContent>
          </Card>
        </div>

        {/* Chart Empty States */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Empty States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Line Chart Empty */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Line Chart</h3>
                <div className="flex flex-col items-center justify-center p-8">
                  <svg
                    className="w-24 h-24 mb-4 text-muted-foreground/20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 80 L35 60 L50 70 L65 40 L80 50"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.3"
                    />
                    <circle
                      cx="20"
                      cy="80"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="35"
                      cy="60"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="70"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="65"
                      cy="40"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle
                      cx="80"
                      cy="50"
                      r="4"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">No trend data</p>
                </div>
              </div>

              {/* Bar Chart Empty */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Bar Chart</h3>
                <div className="flex flex-col items-center justify-center p-8">
                  <svg
                    className="w-24 h-24 mb-4 text-muted-foreground/20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="15"
                      y="60"
                      width="15"
                      height="30"
                      rx="2"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <rect
                      x="35"
                      y="40"
                      width="15"
                      height="50"
                      rx="2"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <rect
                      x="55"
                      y="50"
                      width="15"
                      height="40"
                      rx="2"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <rect
                      x="75"
                      y="30"
                      width="15"
                      height="60"
                      rx="2"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    No comparison data
                  </p>
                </div>
              </div>

              {/* Donut Chart Empty */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Donut Chart</h3>
                <div className="flex flex-col items-center justify-center p-8">
                  <svg
                    className="w-24 h-24 mb-4 text-muted-foreground/20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      fill="currentColor"
                      opacity="0.1"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    No distribution data
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
