import * as React from "react";
import { ChevronDown } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

export interface PaginationControlProps {
  /**
   * Current page number (1-based)
   */
  page: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Current limit of items per page
   */
  limit: number;

  /**
   * Available options for items per page
   */
  limitOptions?: number[];

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Callback when limit changes
   */
  onLimitChange?: (limit: number) => void;

  /**
   * Whether to show the items per page dropdown
   */
  showLimitDropdown?: boolean;

  /**
   * Additional CSS class for the component
   */
  className?: string;
}

export function PaginationControl({
  page,
  totalPages,
  limit,
  limitOptions = [5, 10, 25, 50],
  onPageChange,
  onLimitChange,
  showLimitDropdown = true,
  className,
}: PaginationControlProps) {
  if (totalPages <= 1 && !showLimitDropdown) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange(page - 1)} />
              </PaginationItem>
            )}

            {/* First page */}
            <PaginationItem>
              <PaginationLink
                isActive={page === 1}
                onClick={() => onPageChange(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {/* Show ellipsis if there are more pages before current page */}
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Page before current */}
            {page > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(page - 1)}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Current page (if not first or last) */}
            {page !== 1 && page !== totalPages && (
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
            )}

            {/* Page after current */}
            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Show ellipsis if there are more pages after current page */}
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page (if not first) */}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  isActive={page === totalPages}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {showLimitDropdown && onLimitChange && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[80px]">
                {limit} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {limitOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onLimitChange(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
