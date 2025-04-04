"use client";

import { Behavior } from "@praxisnotes/database";
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
import { useBehaviors } from "@/hooks/use-behaviors";
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
import { BehaviorForm } from "./behavior-form";

export function BehaviorsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchParam = searchParams.get("search");

  const [page, setPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);
  const [limit, setLimit] = useState<number>(
    limitParam ? parseInt(limitParam) : 10,
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || "");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentBehavior, setCurrentBehavior] = useState<
    Behavior | undefined
  >();

  const { behaviors, pagination, isLoading, isError, refresh } = useBehaviors({
    limit,
    page,
    search: searchQuery,
  });

  // Update URL when page, limit, or search changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (searchQuery) {
      current.set("search", searchQuery);
    } else {
      current.delete("search");
    }

    if (page > 1) {
      current.set("page", page.toString());
    } else {
      current.delete("page");
    }

    if (limit !== 10) {
      current.set("limit", limit.toString());
    } else {
      current.delete("limit");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${window.location.pathname}${query}`, { scroll: false });
  }, [page, limit, searchQuery, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    // Reset to page 1 when changing items per page
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Reset to page 1 when searching
    setPage(1);
  };

  const handleEdit = (behavior: Behavior) => {
    setCurrentBehavior(behavior);
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    setCurrentBehavior(undefined);
    setIsAddOpen(true);
  };

  const onFormSuccess = () => {
    refresh();
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Button size="sm" onClick={handleAdd}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Behavior
          </Button>
        </div>
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-destructive">
              Error loading behaviors. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Behaviors</CardTitle>

          <div className="flex justify-between">
            <Button size="sm" onClick={handleAdd}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Behavior
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search input */}
          <form className="flex items-center space-x-2 mb-4 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search behaviors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Scope</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {behaviors.map((behavior: Behavior) => (
                  <TableRow key={behavior.id}>
                    <TableCell className="font-medium">
                      <div>
                        {behavior.name}
                        <div className="md:hidden mt-1">
                          <Badge variant="outline" className="mr-1 text-xs">
                            {behavior.category || "Uncategorized"}
                          </Badge>
                          <span className="sr-only">Scope:</span>
                          {behavior.organizationId ? (
                            <Badge className="text-xs">Org</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Global
                            </Badge>
                          )}
                        </div>
                        <div className="lg:hidden mt-1 text-xs text-muted-foreground truncate max-w-[200px]">
                          {behavior.description || "No description"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">
                        {behavior.category || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {behavior.organizationId ? (
                        <Badge>Organization</Badge>
                      ) : (
                        <Badge variant="secondary">Global</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {behavior.description || "No description"}
                    </TableCell>
                    <TableCell>
                      {behavior.organizationId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(behavior)}
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

                {behaviors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {isLoading
                        ? "Loading behaviors..."
                        : "No behaviors found"}
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

      {/* Behavior Form Dialog */}
      <BehaviorForm
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        behavior={currentBehavior}
        onSuccess={onFormSuccess}
      />
    </div>
  );
}
