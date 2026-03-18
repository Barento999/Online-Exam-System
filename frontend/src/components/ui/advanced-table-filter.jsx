import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const AdvancedTableFilter = ({
  filters = [],
  onFilterChange,
  onClearFilters,
  activeFiltersCount = 0,
  searchPlaceholder = "Search...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterId, value) => {
    onFilterChange(filterId, value);
  };

  const handleClear = () => {
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Search Filter */}
      {filters.find((f) => f.type === "search") && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters.find((f) => f.type === "search")?.value || ""}
            onChange={(e) =>
              handleFilterChange(
                filters.find((f) => f.type === "search")?.id,
                e.target.value,
              )
            }
            className="pl-10"
          />
        </div>
      )}

      {/* Advanced Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Advanced Filters</h4>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-auto p-1 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {filters
                .filter((f) => f.type !== "search")
                .map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label htmlFor={filter.id}>{filter.label}</Label>

                    {filter.type === "select" && (
                      <Select
                        value={filter.value || "all"}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, value)
                        }>
                        <SelectTrigger id={filter.id}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === "date-range" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            type="date"
                            value={filter.value?.from || ""}
                            onChange={(e) =>
                              handleFilterChange(filter.id, {
                                ...filter.value,
                                from: e.target.value,
                              })
                            }
                            placeholder="From"
                          />
                        </div>
                        <div>
                          <Input
                            type="date"
                            value={filter.value?.to || ""}
                            onChange={(e) =>
                              handleFilterChange(filter.id, {
                                ...filter.value,
                                to: e.target.value,
                              })
                            }
                            placeholder="To"
                          />
                        </div>
                      </div>
                    )}

                    {filter.type === "number-range" && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={filter.value?.min || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.id, {
                              ...filter.value,
                              min: e.target.value,
                            })
                          }
                          placeholder="Min"
                        />
                        <Input
                          type="number"
                          value={filter.value?.max || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.id, {
                              ...filter.value,
                              max: e.target.value,
                            })
                          }
                          placeholder="Max"
                        />
                      </div>
                    )}

                    {filter.type === "text" && (
                      <Input
                        id={filter.id}
                        value={filter.value || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                        placeholder={filter.placeholder}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters
            .filter((f) => {
              if (f.type === "search") return false;
              if (f.type === "select") return f.value && f.value !== "all";
              if (f.type === "date-range") return f.value?.from || f.value?.to;
              if (f.type === "number-range")
                return f.value?.min || f.value?.max;
              if (f.type === "text") return f.value;
              return false;
            })
            .map((filter) => (
              <Badge key={filter.id} variant="secondary" className="gap-1 pr-1">
                <span className="text-xs">
                  {filter.label}:{" "}
                  {filter.type === "select"
                    ? filter.options?.find((o) => o.value === filter.value)
                        ?.label
                    : filter.type === "date-range"
                      ? `${filter.value?.from || "..."} - ${filter.value?.to || "..."}`
                      : filter.type === "number-range"
                        ? `${filter.value?.min || "..."} - ${filter.value?.max || "..."}`
                        : filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange(filter.id, null)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};
