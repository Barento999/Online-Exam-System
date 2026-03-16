import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

export const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}>
        <Navbar />
        <main className="pt-16">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
