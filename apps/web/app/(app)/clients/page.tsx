import { ClientList } from "./components/client-list";
import { Suspense } from "react";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading clients...</div>}>
        <ClientList />
      </Suspense>
    </div>
  );
}
