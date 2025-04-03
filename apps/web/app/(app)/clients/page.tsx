import { ClientList } from "./components/client-list";
import { Suspense } from "react";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clients</h1>
      <Suspense fallback={<div>Loading clients...</div>}>
        <ClientList />
      </Suspense>
    </div>
  );
}
