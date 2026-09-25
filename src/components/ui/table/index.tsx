import { cn } from "@/utils";
import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

/*
  Finexy table: a container with a 1px #EDEDED border and 20px radius, a #F5F5F5 60px
  header row with 17px grey labels, ~63px body rows with 17px text and no dividers,
  22px side padding.
*/

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="custom-scrollbar relative overflow-x-auto rounded-tile border border-line-soft">
      <table className={cn("min-w-full border-collapse text-start", className)}>{children}</table>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={cn("bg-tile select-none", className)}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={cn("[tbody_&]:hover:bg-tile", className)}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      className={cn(
        "px-[12px] text-start text-fx-17 first:ps-[22px] last:pe-[22px]",
        isHeader ? "h-[60px] font-normal whitespace-nowrap text-secondary" : "h-[63px] py-[10px] text-ink",
        className,
      )}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
