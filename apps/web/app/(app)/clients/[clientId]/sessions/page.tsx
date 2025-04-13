import { Metadata } from "next";
import { db } from "@/lib/db";
import { sessions } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { PlusCircle, FileText, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Client Sessions",
  description: "Manage and view client sessions",
};

interface Session {
  id: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  formData: any;
}

export default async function SessionsPage({
  params,
}: {
  params: Promise<{
    clientId: string;
    sessionId: string;
  }>;
}) {
  const { clientId } = await params;

  // Fetch client sessions
  const clientSessions = await db
    .select({
      id: sessions.id,
      sessionDate: sessions.sessionDate,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      location: sessions.location,
      status: sessions.status,
      formData: sessions.formData,
    })
    .from(sessions)
    .where(eq(sessions.clientId, clientId))
    .orderBy(sessions.sessionDate, "desc");

  // Get client name from first session or use placeholder
  const clientName = clientSessions[0]?.formData?.clientName || "Client";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sessions for {clientName}</h1>
        <Link href={`/clients/${clientId}/sessions/new`}>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </Link>
      </div>

      {clientSessions.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first session to get started
          </p>
          <Link href={`/clients/${clientId}/sessions/new`}>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {clientSessions.map((session: Session) => (
            <div
              key={session.id}
              className="border rounded-lg p-4 flex justify-between items-center bg-card"
            >
              <div className="space-y-1">
                <div className="font-medium">
                  <Calendar className="h-4 w-4 inline-block mr-2" />
                  {format(new Date(session.sessionDate), "MMMM d, yyyy")}
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 inline-block mr-2" />
                  {session.startTime} - {session.endTime}
                </div>
                <div className="text-sm text-muted-foreground">
                  Location: {session.location}
                </div>
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      session.status === "submitted"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {session.status === "submitted" ? "Completed" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/clients/${clientId}/sessions/${session.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Link
                  href={`/clients/${clientId}/sessions/${session.id}/notes`}
                >
                  <Button variant="secondary" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Notes
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
