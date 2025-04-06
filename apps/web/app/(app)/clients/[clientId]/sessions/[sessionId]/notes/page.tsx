import { Metadata } from "next";
import { db } from "@/lib/db";
import { sessions, sessionNotes } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NotesEditor } from "./components/notes-editor";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Session Notes",
  description: "View and edit session notes",
};

export default async function NotesPage({
  params,
}: {
  params: Promise<{
    clientId: string;
    sessionId: string;
  }>;
}) {
  const { clientId, sessionId } = await params;

  // Fetch session data
  const [sessionData] = await db
    .select({
      id: sessions.id,
      clientId: sessions.clientId,
      sessionDate: sessions.sessionDate,
      formData: sessions.formData,
    })
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!sessionData) {
    redirect(`/clients/${clientId}/sessions`);
  }

  // Fetch session notes data
  const [notesData] = await db
    .select()
    .from(sessionNotes)
    .where(eq(sessionNotes.sessionId, sessionId))
    .limit(1);

  // Get client name from form data
  const clientName = (sessionData.formData as any)?.clientName || "Client";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <nav className="flex items-center text-sm">
        <Link
          href="/clients"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Clients
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <Link
          href={`/clients/${clientId}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {clientName}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <Link
          href={`/clients/${clientId}/sessions`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sessions
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <Link
          href={`/clients/${clientId}/sessions/${sessionId}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {new Date(sessionData.sessionDate).toLocaleDateString()}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span className="text-foreground font-medium">Notes</span>
      </nav>

      <div className="mt-8 space-y-4">
        <h1 className="text-2xl font-bold">Session Notes</h1>
        <p className="text-muted-foreground">
          View, edit, and generate session notes for your therapy session.
        </p>

        <NotesEditor
          clientId={clientId}
          sessionId={sessionId}
          initialData={notesData}
        />
      </div>
    </div>
  );
}
