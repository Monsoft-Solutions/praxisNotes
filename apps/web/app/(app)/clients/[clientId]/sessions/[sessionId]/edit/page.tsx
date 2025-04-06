import { Metadata } from "next";
import { db } from "@/lib/db";
import { sessions, clients } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SessionForm } from "../../components/session-form";

export const metadata: Metadata = {
  title: "Edit Session",
  description: "Edit an existing therapy session",
};

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{
    clientId: string;
    sessionId: string;
  }>;
}) {
  const { clientId, sessionId } = await params;

  // Fetch session details
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) {
    notFound();
  }

  // Fetch client details
  const [client] = await db
    .select({
      id: clients.id,
      firstName: clients.firstName,
      lastName: clients.lastName,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) {
    notFound();
  }

  const clientName = `${client.firstName} ${client.lastName}`;

  return (
    <div className="container mx-auto py-6">
      <SessionForm
        clientId={clientId}
        clientName={clientName}
        sessionId={sessionId}
        initialData={session.formData as any}
        sessionStatus={session.status}
      />
    </div>
  );
}
