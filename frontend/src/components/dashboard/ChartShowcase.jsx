import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircularProgress,
  LinearProgress,
  BarChart,
  DonutChart,
  LineChart,
} from "@/components/charts";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ChartShowcase = ({ className }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCharts = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Sample data
  const barData = [
    { label: "Math", value: 85 },
    { label: "Physics", value: 92 },
    { label: "Chemistry", value: 78 },
    { label: "Biology", value: 88 },
  ];

  const donutData = [
    { label: "Completed", value: 65, color: "stroke-green-600" },
    { label: "In Progress", value: 25, color: "stroke-blue-600" },
    { label: "Pending", value: 10, color: "stroke-orange-600" },
  ];

  const lineData = [
    { label: "Jan", value: 75 },
    { label: "Feb", value: 82 },
    { label: "Mar", value: 78 },
    { label: "Apr", value: 85 },
    { label: "May", value: 88 },
    { label: "Jun", value: 92 },
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Interactive Charts & Progress Bars
          </div>
          <Button size="sm" variant="outline" onClick={refreshCharts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="bar">Bar Charts</TabsTrigger>
            <TabsTrigger value="donut">Donut Charts</TabsTrigger>
            <TabsTrigger value="line">Line Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Circular Progress */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Circular Progress
                </h3>
                <div className="flex justify-center">
                  <CircularProgress
                    key={`circular-${refreshKey}`}
                    value={87}
                    max={100}
                    size={120}
                    color="text-primary"
                    label="Overall Score"
                    animated
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CircularProgress
                    key={`circular-small-1-${refreshKey}`}
                    value={75}
                    max={100}
                    size={80}
                    color="text-green-600"
                    showValue
                    animated
                  />
                  <CircularProgress
                    key={`circular-small-2-${refreshKey}`}
                    value={92}
                    max={100}
                    size={80}
                    color="text-blue-600"
                    showValue
                    animated
                  />
                </div>
              </div>

              {/* Linear Progress */}
              <div className="space-y-4">
                <h3 className="font-semibold">Linear Progress Bars</h3>
                <div className="space-y-3">
                  <LinearProgress
                    key={`linear-1-${refreshKey}`}
                    value={85}
                    max={100}
                    label="Mathematics"
                    showValue
                    color="bg-blue-600"
                    animated
                  />
                  <LinearProgress
                    key={`linear-2-${refreshKey}`}
                    value={92}
                    max={100}
                    label="Physics"
                    showValue
                    color="bg-green-600"
                    animated
                    striped
                  />
                  <LinearProgress
                    key={`linear-3-${refreshKey}`}
                    value={78}
                    max={100}
                    label="Chemistry"
                    showValue
                    color="bg-orange-600"
                    animated
                  />
                  <LinearProgress
                    key={`linear-4-${refreshKey}`}
                    value={88}
                    max={100}
                    label="Biology"
                    showValue
                    color="bg-purple-600"
                    animated
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Subject Performance
              </h3>
              <BarChart
                key={`bar-${refreshKey}`}
                data={barData}
                height={200}
                color="bg-primary"
                animated
                showValues
                showGrid
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BarChart
                key={`bar-small-1-${refreshKey}`}
                data={barData.slice(0, 3)}
                height={150}
                color="bg-green-600"
                animated
                showValues
              />
              <BarChart
                key={`bar-small-2-${refreshKey}`}
                data={barData.slice(1, 4)}
                height={150}
                color="bg-blue-600"
                animated
                showValues
              />
            </div>
          </TabsContent>

          <TabsContent value="donut" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Study Progress
                </h3>
                <DonutChart
                  key={`donut-1-${refreshKey}`}
                  data={donutData}
                  size={200}
                  strokeWidth={20}
                  animated
                  showLegend={false}
                  centerContent={
                    <div className="text-center">
                      <div className="text-2xl font-bold">100</div>
                      <div className="text-xs text-muted-foreground">
                        Total Tasks
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">With Legend</h3>
                <DonutChart
                  key={`donut-2-${refreshKey}`}
                  data={donutData}
                  size={160}
                  strokeWidth={16}
                  animated
                  showLegend
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="line" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Trends
              </h3>
              <LineChart
                key={`line-1-${refreshKey}`}
                data={lineData}
                width={500}
                height={200}
                color="stroke-primary"
                animated
                showDots
                showGrid
                smooth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LineChart
                key={`line-2-${refreshKey}`}
                data={lineData.slice(0, 4)}
                width={250}
                height={150}
                color="stroke-green-600"
                animated
                showDots
                smooth={false}
              />
              <LineChart
                key={`line-3-${refreshKey}`}
                data={lineData.slice(2, 6)}
                width={250}
                height={150}
                color="stroke-blue-600"
                animated
                showDots
                smooth
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
