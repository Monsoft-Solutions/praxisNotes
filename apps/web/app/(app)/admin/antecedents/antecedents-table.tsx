"use client";

import { Antecedent } from "@praxisnotes/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { PlusIcon, Search, MoreHorizontal } from "lucide-react";
import { useAntecedents } from "@/hooks/use-antecedents";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "@workspace/ui/components/pagination-control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { AntecedentForm } from "./antecedent-form";

export function AntecedentsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAntecedent, setSelectedAntecedent] = useState<
    Antecedent | undefined
  >(undefined);

  // Initialize state from search params
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const searchParam = searchParams.get("search");

    if (pageParam) setPage(parseInt(pageParam));
    if (limitParam) setLimit(parseInt(limitParam));
    if (searchParam) {
      setSearchValue(searchParam);
      setDebouncedSearchValue(searchParam);
    }
  }, [searchParams]);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Fetch antecedents with the current parameters
  const { antecedents, isLoading, pagination, refresh } = useAntecedents({
    page,
    limit,
    search: debouncedSearchValue,
    sort: "name",
    order: "asc",
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateSearchParams({ page: newPage.toString() });
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    updateSearchParams({ limit: newLimit.toString(), page: "1" });
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value === "" && debouncedSearchValue !== "") {
      setDebouncedSearchValue("");
      updateSearchParams({ search: undefined, page: "1" });
      setPage(1);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchValue(searchValue);
    updateSearchParams({ search: searchValue, page: "1" });
    setPage(1);
  };

  // Update search params
  const updateSearchParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.replace(`?${newParams.toString()}`);
  };

  // Handle edit antecedent
  const handleEdit = (antecedent: Antecedent) => {
    setSelectedAntecedent(antecedent);
    setIsFormOpen(true);
  };

  // Handle new antecedent
  const handleNew = () => {
    setSelectedAntecedent(undefined);
    setIsFormOpen(true);
  };

  // Handle form close
  const handleFormClose = (success?: boolean) => {
    setIsFormOpen(false);
    setSelectedAntecedent(undefined);
    if (success) {
      refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full max-w-sm items-center space-x-2"
        >
          <Input
            type="search"
            placeholder="Search antecedents..."
            value={searchValue}
            onChange={handleSearchChange}
            className="max-w-[250px]"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Button onClick={handleNew}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Antecedent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Antecedents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {antecedents.map((antecedent: Antecedent) => (
                  <TableRow key={antecedent.id}>
                    <TableCell className="font-medium">
                      {antecedent.name}
                    </TableCell>
                    <TableCell>
                      {antecedent.description
                        ? antecedent.description.length > 50
                          ? `${antecedent.description.substring(0, 50)}...`
                          : antecedent.description
                        : "No description"}
                    </TableCell>
                    <TableCell>
                      {antecedent.category ? (
                        <Badge variant="outline">{antecedent.category}</Badge>
                      ) : (
                        "No category"
                      )}
                    </TableCell>
                    <TableCell>
                      {antecedent.organizationId ? "Organization" : "Global"}
                    </TableCell>
                    <TableCell>
                      {antecedent.organizationId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(antecedent)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {antecedents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {isLoading
                        ? "Loading antecedents..."
                        : "No antecedents found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 overflow-x-auto">
              <PaginationControl
                page={page}
                totalPages={pagination.totalPages}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AntecedentForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        antecedent={selectedAntecedent}
      />
    </div>
  );
}
