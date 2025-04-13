import { Metadata } from "next";
import { db } from "@/lib/db";
import { clients } from "@praxisnotes/database";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Clients",
  description: "View and manage your clients",
};

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

export default async function ClientsPage() {
  // Fetch all clients
  const clientsList = await db
    .select({
      id: clients.id,
      firstName: clients.firstName,
      lastName: clients.lastName,
    })
    .from(clients)
    .orderBy(clients.lastName);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">Add Client</Link>
        </Button>
      </div>

      {clientsList.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">No Clients Yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first client to get started
          </p>
          <Button asChild>
            <Link href="/clients/new">Add Client</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {clientsList.map((client: Client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}/sessions`}
              className="border rounded-lg p-4 flex justify-between items-center bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {client.firstName} {client.lastName}
                  </div>
                </div>
              </div>
              <Button variant="ghost">View Sessions</Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
