import { Layout } from "@/components/layout/Layout";
import { ChartShowcase } from "@/components/dashboard/ChartShowcase";
import { PerformanceWidget } from "@/components/dashboard/PerformanceWidget";
import { StudyProgressWidget } from "@/components/dashboard/StudyProgressWidget";
import { ExamTrendsWidget } from "@/components/dashboard/ExamTrendsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";

export const ChartsDemo = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-600">
          <h1 className="text-3xl font-semibold mb-2">
            Charts & Progress Bars Demo
          </h1>
          <p className="text-muted-foreground">
            Interactive data visualization components with animations
          </p>
        </div>

        {/* Chart Showcase */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
          <ChartShowcase />
        </div>

        {/* Widget Examples */}
        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-600 delay-400">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Dashboard Widgets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Real-world examples of how charts integrate into dashboard
                  widgets
                </p>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <PerformanceWidget />
                  <StudyProgressWidget />
                  <ExamTrendsWidget />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-600">
          <Card>
            <CardHeader>
              <CardTitle>Chart Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Bar Charts</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Animated bars with staggered delays</li>
                    <li>• Hover effects and value tooltips</li>
                    <li>• Customizable colors and heights</li>
                    <li>• Grid lines and labels</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Donut Charts</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Smooth arc animations</li>
                    <li>• Center content support</li>
                    <li>• Interactive legend</li>
                    <li>• Hover stroke width changes</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Line Charts</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Smooth curve animations</li>
                    <li>• Interactive data points</li>
                    <li>• Area fill gradients</li>
                    <li>• Responsive tooltips</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Progress Bars</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Circular and linear variants</li>
                    <li>• Animated fill effects</li>
                    <li>• Color-coded thresholds</li>
                    <li>• Glow and shadow effects</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
