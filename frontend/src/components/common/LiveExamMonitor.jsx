import { useExamMonitoring } from "@/hooks/useExamMonitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle, XCircle, Clock, Users } from "lucide-react";

export const LiveExamMonitor = ({ examId, totalQuestions }) => {
  const { activeStudents, events, connected } = useExamMonitoring(examId);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Connection Status */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Monitoring</CardTitle>
            <Badge variant={connected ? "default" : "destructive"}>
              {connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Active Students */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Students ({activeStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {activeStudents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No students currently taking the exam
              </p>
            ) : (
              <div className="space-y-3">
                {activeStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{student.studentName}</h4>
                      {getStatusBadge(student.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Joined: {formatTime(student.joinedAt)}
                      </div>
                      <div>
                        Progress: {student.answeredCount}/{totalQuestions}
                      </div>
                    </div>

                    {student.status === "active" && (
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(student.answeredCount / totalQuestions) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No activity yet
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="p-3 border-l-2 border-primary bg-secondary/50 rounded">
                    <p className="text-sm">{event.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(event.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
