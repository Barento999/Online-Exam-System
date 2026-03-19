import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Export data to PDF format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column definitions [{ header: 'Name', dataKey: 'name' }]
 * @param {string} filename - Output filename without extension
 * @param {string} title - Document title
 */
export const exportToPDF = (data, columns, filename, title = "") => {
  try {
    const doc = new jsPDF();

    // Add title if provided
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 15);
    }

    // Generate table
    autoTable(doc, {
      startY: title ? 25 : 15,
      head: [columns.map((col) => col.header)],
      body: data.map((row) => columns.map((col) => row[col.dataKey] || "")),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 10 },
    });

    // Add footer with date
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10,
      );
    }

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
    throw new Error("Failed to generate PDF: " + error.message);
  }
};

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column definitions [{ header: 'Name', dataKey: 'name' }]
 * @param {string} filename - Output filename without extension
 * @param {string} sheetName - Worksheet name
 */
export const exportToExcel = (
  data,
  columns,
  filename,
  sheetName = "Sheet1",
) => {
  // Transform data to match column structure
  const transformedData = data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.header] = row[col.dataKey] || "";
    });
    return newRow;
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(transformedData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.header.length, 15),
  }));
  ws["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column definitions [{ header: 'Name', dataKey: 'name' }]
 * @param {string} filename - Output filename without extension
 */
export const exportToCSV = (data, columns, filename) => {
  // Create CSV header
  const headers = columns.map((col) => col.header).join(",");

  // Create CSV rows
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.dataKey] || "";
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(",") ? `"${escaped}"` : escaped;
      })
      .join(","),
  );

  // Combine header and rows
  const csv = [headers, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for export
 */
export const formatDateForExport = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

/**
 * Format datetime for export
 */
export const formatDateTimeForExport = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};
