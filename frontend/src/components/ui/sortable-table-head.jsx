import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const SortableTableHead = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className = "",
  align = "left",
}) => {
  const isActive = sortField === field;
  const isSortable = field !== null && field !== undefined;

  if (!isSortable) {
    return (
      <TableHead className={cn(align === "right" && "text-right", className)}>
        {label}
      </TableHead>
    );
  }

  return (
    <TableHead className={cn(align === "right" && "text-right", className)}>
      <button
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-2 hover:text-foreground transition-colors font-medium",
          align === "right" && "ml-auto",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}>
        <span>{label}</span>
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </button>
    </TableHead>
  );
};
