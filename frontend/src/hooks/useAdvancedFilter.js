import { useState, useEffect, useMemo } from "react";

export const useAdvancedFilter = (data = [], filterConfig = []) => {
  const [filters, setFilters] = useState(() => {
    return filterConfig.map((config) => ({
      ...config,
      value: config.defaultValue || (config.type === "select" ? "all" : ""),
    }));
  });

  const handleFilterChange = (filterId, value) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, value } : filter,
      ),
    );
  };

  const handleClearFilters = () => {
    setFilters((prev) =>
      prev.map((filter) => ({
        ...filter,
        value: filter.defaultValue || (filter.type === "select" ? "all" : ""),
      })),
    );
  };

  const activeFiltersCount = useMemo(() => {
    return filters.filter((filter) => {
      if (filter.type === "search") return false;
      if (filter.type === "select")
        return filter.value && filter.value !== "all";
      if (filter.type === "date-range")
        return filter.value?.from || filter.value?.to;
      if (filter.type === "number-range")
        return filter.value?.min || filter.value?.max;
      if (filter.type === "text") return filter.value;
      return false;
    }).length;
  }, [filters]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return filters.every((filter) => {
        // Search filter
        if (filter.type === "search") {
          if (!filter.value) return true;
          const searchLower = filter.value.toLowerCase();
          return filter.searchFields?.some((field) => {
            const value = getNestedValue(item, field);
            return value?.toString().toLowerCase().includes(searchLower);
          });
        }

        // Select filter
        if (filter.type === "select") {
          if (!filter.value || filter.value === "all") return true;
          const itemValue = getNestedValue(item, filter.field);
          return itemValue?.toString() === filter.value;
        }

        // Date range filter
        if (filter.type === "date-range") {
          const itemDate = new Date(getNestedValue(item, filter.field));
          if (filter.value?.from) {
            const fromDate = new Date(filter.value.from);
            if (itemDate < fromDate) return false;
          }
          if (filter.value?.to) {
            const toDate = new Date(filter.value.to);
            toDate.setHours(23, 59, 59, 999); // End of day
            if (itemDate > toDate) return false;
          }
          return true;
        }

        // Number range filter
        if (filter.type === "number-range") {
          const itemValue = parseFloat(getNestedValue(item, filter.field));
          if (filter.value?.min && itemValue < parseFloat(filter.value.min)) {
            return false;
          }
          if (filter.value?.max && itemValue > parseFloat(filter.value.max)) {
            return false;
          }
          return true;
        }

        // Text filter
        if (filter.type === "text") {
          if (!filter.value) return true;
          const itemValue = getNestedValue(item, filter.field);
          return itemValue
            ?.toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        }

        return true;
      });
    });
  }, [data, filters]);

  return {
    filters,
    filteredData,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  };
};

// Helper function to get nested object values (e.g., "courseId.name")
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};
