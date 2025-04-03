"use client";

import { useState, useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Client } from "@praxisnotes/database";
import { PaginationControl } from "@workspace/ui/components/pagination-control";

/**
 * Custom fetcher for SWR to handle API requests
 */
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return response.json();
};

export function ClientList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const [page, setPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);
  const [limit, setLimit] = useState<number>(
    limitParam ? parseInt(limitParam) : 10,
  );

  // Build API URL with search and pagination params
  const apiUrl = `/api/client?${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ""}page=${page}&limit=${limit}`;

  const { data, error, isLoading } = useSWR<{
    data: Client[];
    pagination?: { total: number; totalPages: number };
  }>(apiUrl, fetcher);

  const clients = data?.data || [];
  const pagination = data?.pagination;

  // Update URL when page, limit or search changes
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

  const handleSearch = (e: string) => {
    setPage(1);

    setSearchQuery(e);
    // Reset to page 1 when searching
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    // Reset to page 1 when changing items per page
    setPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Manage your clients and their information
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="flex items-center space-x-2 mb-4 w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </form>

        {isLoading ? (
          <div className="py-8 text-center">Loading clients...</div>
        ) : error ? (
          <div className="py-8 text-center text-destructive">
            Error loading clients. Please try again.
          </div>
        ) : clients.length === 0 ? (
          <div className="py-8 text-center">
            No clients found. Add a new client to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client: Client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="font-medium">
                      {client.firstName} {client.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell>
                    {client.isActive ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/clients/${client.id}`)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/clients/${client.id}/edit`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4">
            <PaginationControl
              page={page}
              totalPages={pagination.totalPages}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              showLimitDropdown={false}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {clients.length} clients
          {pagination?.total && ` of ${pagination.total}`}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <PaginationControl
            page={page}
            totalPages={pagination?.totalPages || 1}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitDropdown={true}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
