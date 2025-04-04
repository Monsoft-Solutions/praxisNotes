"use client";

import { ReplacementProgram } from "@praxisnotes/database";
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
import { useReplacementPrograms } from "@/hooks/use-replacement-programs";
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
import { ReplacementProgramForm } from "./replacement-program-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { toast } from "sonner";

export function ReplacementProgramsTable() {
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<
    ReplacementProgram | undefined
  >();
  const [isDeleting, setIsDeleting] = useState(false);

  const { replacementPrograms, pagination, isLoading, isError, refresh } =
    useReplacementPrograms({
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

  const handleEdit = (program: ReplacementProgram) => {
    setCurrentProgram(program);
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    setCurrentProgram(undefined);
    setIsAddOpen(true);
  };

  const handleDeleteClick = (program: ReplacementProgram) => {
    setCurrentProgram(program);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!currentProgram) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/replacement-programs/${currentProgram.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete replacement program",
        );
      }

      toast.success("Replacement program deleted successfully");
      setIsDeleteOpen(false);
      refresh();
    } catch (error) {
      console.error("Error deleting replacement program:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete replacement program",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const onFormSuccess = () => {
    refresh();
  };

  // Helper to render steps in hover card
  const renderSteps = (steps: Record<string, string> | null | undefined) => {
    if (!steps || Object.keys(steps).length === 0) {
      return <p className="text-muted-foreground">No steps defined</p>;
    }

    return (
      <div className="space-y-2">
        <h4 className="font-semibold">Program Steps:</h4>
        <div className="rounded-md bg-muted p-3">
          <ul className="list-disc pl-5 space-y-2">
            {Object.entries(steps).map(([key, value]) => (
              <li key={key} className="text-sm">
                <span className="font-medium">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Button size="sm" onClick={handleAdd}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Replacement Program
          </Button>
        </div>
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-destructive">
              Error loading replacement programs. Please try again later.
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
          <CardTitle>Replacement Programs</CardTitle>

          <div className="flex justify-between">
            <Button size="sm" onClick={handleAdd}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Replacement Program
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
                placeholder="Search replacement programs..."
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
                {replacementPrograms.map((program: ReplacementProgram) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer hover:underline">
                            {program.name}
                            <div className="md:hidden mt-1">
                              <Badge variant="outline" className="mr-1 text-xs">
                                {program.category || "Uncategorized"}
                              </Badge>
                              <span className="sr-only">Scope:</span>
                              {program.organizationId ? (
                                <Badge className="text-xs">Org</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Global
                                </Badge>
                              )}
                            </div>
                            <div className="lg:hidden mt-1 text-xs text-muted-foreground truncate max-w-[200px]">
                              {program.description || "No description"}
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold">
                              {program.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {program.description ||
                                "No description available"}
                            </p>
                            {renderSteps(
                              program.steps as Record<string, string>,
                            )}
                            {program.organizationId && (
                              <div className="pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(program)}
                                  className="w-full"
                                >
                                  Edit Program
                                </Button>
                              </div>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">
                        {program.category || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {program.organizationId ? (
                        <Badge>Organization</Badge>
                      ) : (
                        <Badge variant="secondary">Global</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {program.description || "No description"}
                    </TableCell>
                    <TableCell>
                      {program.organizationId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(program)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(program)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {replacementPrograms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {isLoading
                        ? "Loading replacement programs..."
                        : "No replacement programs found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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

      {/* Add/Edit Program Modal */}
      <ReplacementProgramForm
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        replacementProgram={currentProgram}
        onSuccess={onFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Replacement Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {currentProgram?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
