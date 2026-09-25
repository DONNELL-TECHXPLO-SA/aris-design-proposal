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
  22px side padding. Below lg the table stacks: the header row is dropped and each row
  becomes a block with one cell per line (first cell as the row title), so nothing
  scrolls sideways on a phone.
*/

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="relative custom-scrollbar overflow-x-auto rounded-tile border border-line-soft">
      <table
        className={cn(
          "min-w-full border-collapse text-start max-lg:block",
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn("bg-tile select-none max-lg:hidden", className)}>
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={cn("max-lg:block", className)}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={cn(
        "max-lg:flex max-lg:flex-col max-lg:gap-[4px] max-lg:border-b max-lg:border-line-soft max-lg:px-[16px] max-lg:py-[14px] max-lg:last:border-b-0 [tbody_&]:hover:bg-tile",
        className,
      )}
    >
      {children}
    </tr>
  );
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
        isHeader
          ? "h-[60px] font-normal whitespace-nowrap text-secondary"
          : "h-[63px] py-[10px] text-ink max-lg:h-auto max-lg:px-0 max-lg:py-0 max-lg:text-fx-15 max-lg:break-words max-lg:whitespace-normal max-lg:first:ps-0 max-lg:first:pb-[4px] max-lg:first:text-fx-17 max-lg:last:pe-0 max-lg:[&:not(:first-child)]:text-secondary",
        className,
      )}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
