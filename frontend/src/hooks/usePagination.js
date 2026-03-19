import { useState, useMemo, useEffect } from "react";

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const totalItems = data.length;

  // Debug logging
  console.log("usePagination:", {
    dataLength: data.length,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
  });

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const sliced = data.slice(startIndex, endIndex);
    console.log("paginatedData slice:", {
      startIndex,
      endIndex,
      slicedLength: sliced.length,
    });
    return sliced;
  }, [data, currentPage, pageSize]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    console.log(
      `goToPage called: page=${page}, clamped to=${pageNumber}, totalPages=${totalPages}`,
    );
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    console.log(
      `nextPage called: currentPage=${currentPage}, totalPages=${totalPages}`,
    );
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    console.log(`previousPage called: currentPage=${currentPage}`);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (newSize) => {
    console.log(
      `changePageSize called: newSize=${newSize}, resetting to page 1`,
    );
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, totalPages, currentPage]);

  const startIndex = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex,
  };
};
