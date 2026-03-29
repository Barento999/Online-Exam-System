import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Date Range Picker Component
 * Provides preset ranges and custom date selection
 */
export const DateRangePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    {
      label: "Today",
      getValue: () => ({ start: new Date(), end: new Date() }),
    },
    {
      label: "Last 7 days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      },
    },
    {
      label: "Last 30 days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { start, end };
      },
    },
    {
      label: "Last 3 months",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        return { start, end };
      },
    },
    {
      label: "Last 6 months",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        return { start, end };
      },
    },
    {
      label: "Last year",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        return { start, end };
      },
    },
    {
      label: "All time",
      getValue: () => ({ start: null, end: null }),
    },
  ];

  const handlePresetClick = (preset) => {
    const range = preset.getValue();
    onChange(range);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!value?.start && !value?.end) return "All time";
    if (!value?.start || !value?.end) return "Select date range";

    const start = new Date(value.start);
    const end = new Date(value.end);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto justify-start text-left font-normal">
        <Calendar className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-64 rounded-md border bg-popover p-3 shadow-md">
            <div className="space-y-1">
              <p className="text-sm font-medium mb-2">Select date range</p>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handlePresetClick(preset)}>
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Simple hook for date range state management
 */
export const useDateRange = (initialRange = { start: null, end: null }) => {
  const [dateRange, setDateRange] = useState(initialRange);

  const filterByDateRange = (data, dateField = "createdAt") => {
    if (!dateRange.start || !dateRange.end) return data;

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999); // Include full end date

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  return {
    dateRange,
    setDateRange,
    filterByDateRange,
  };
};
