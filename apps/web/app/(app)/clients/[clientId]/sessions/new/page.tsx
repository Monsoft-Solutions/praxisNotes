import { Metadata } from "next";
import { SessionForm } from "../components/session-form";
import { db } from "@/lib/db";
import { clients } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "New Session",
  description: "Create a new therapy session",
};

export default async function NewSessionPage({
  params,
}: {
  params: Promise<{
    clientId: string;
    sessionId: string;
  }>;
}) {
  const { clientId } = await params;

  // Fetch client data to get the name
  const [clientData] = await db
    .select({
      id: clients.id,
      firstName: clients.firstName,
      lastName: clients.lastName,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!clientData) {
    redirect("/clients");
  }

  const clientName = `${clientData.firstName} ${clientData.lastName}`;

  return (
    <div className="container mx-auto py-6">
      <SessionForm clientId={clientId} clientName={clientName} />
    </div>
  );
}
