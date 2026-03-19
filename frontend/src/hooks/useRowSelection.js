import { useState, useCallback } from "react";

export const useRowSelection = (data = [], idField = "_id") => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const toggleRow = useCallback((id) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedRows.size === data.length && data.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item[idField])));
    }
  }, [data, selectedRows.size, idField]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isSelected = useCallback(
    (id) => {
      return selectedRows.has(id);
    },
    [selectedRows],
  );

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  const getSelectedItems = useCallback(() => {
    return data.filter((item) => selectedRows.has(item[idField]));
  }, [data, selectedRows, idField]);

  return {
    selectedRows,
    selectedCount: selectedRows.size,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
    getSelectedItems,
  };
};
