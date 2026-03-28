import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageTransitionLoader } from "@/components/common/PageTransitionLoader";
import { SkipToContent } from "@/components/common/SkipToContent";
import { cn } from "@/lib/utils";

export const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <PageTransitionLoader />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          // Only apply margin on desktop
          !isMobile && (isCollapsed ? "lg:ml-20" : "lg:ml-64"),
        )}>
        <Navbar isCollapsed={isCollapsed} isMobile={isMobile} />
        <main
          id="main-content"
          className="pt-16"
          role="main"
          aria-label="Main content">
          <div className="p-4 md:p-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
