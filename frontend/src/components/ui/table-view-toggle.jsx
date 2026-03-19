import { Button } from "@/components/ui/button";
import { Table, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export const TableViewToggle = ({ view, onViewChange, className = "" }) => {
  return (
    <div className={cn("flex items-center gap-1 md:hidden", className)}>
      <Button
        variant={view === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8 px-2">
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "cards" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("cards")}
        className="h-8 px-2">
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};
