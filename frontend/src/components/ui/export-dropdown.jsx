import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

export const ExportDropdown = ({
  onExportPDF,
  onExportExcel,
  onExportCSV,
  disabled = false,
  variant = "outline",
  size = "default",
  label = "Export",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExportCSV}>
          <File className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
