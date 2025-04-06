import { Metadata } from "next";
import { db } from "@/lib/db";
import { sessions, clients } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  FileText,
  Clock,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Pencil,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Session Details",
  description: "View session details",
};

interface PageProps {
  params: {
    clientId: string;
    sessionId: string;
  };
}

export default async function SessionDetailsPage({ params }: PageProps) {
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
  const formData = session.formData as any;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/clients/${clientId}/sessions`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Session Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/clients/${clientId}/sessions/${sessionId}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Session
            </Button>
          </Link>
          <Link href={`/clients/${clientId}/sessions/${sessionId}/notes`}>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Notes
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(session.sessionDate), "MMMM d, yyyy")}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-muted-foreground">
                  {session.startTime} - {session.endTime}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {session.location}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Participants</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData?.presentParticipants?.length > 0 ? (
                    formData.presentParticipants.map(
                      (participant: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {participant}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No participants recorded
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="h-4 w-4 mt-1" />
              <div>
                <div className="font-medium">Status</div>
                <div className="mt-1">
                  <Badge
                    className={
                      session.status === "submitted"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    }
                  >
                    {session.status === "submitted" ? "Completed" : "Draft"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Changes</CardTitle>
          </CardHeader>
          <CardContent>
            {formData?.environmentalChanges?.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {formData.environmentalChanges.map(
                  (change: string, index: number) => (
                    <li key={index} className="text-sm">
                      {change}
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No environmental changes recorded
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ABC Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {formData?.abcEntries?.length > 0 ? (
            <div className="space-y-6">
              {formData.abcEntries.map((entry: any, index: number) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Entry {index + 1}</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        Antecedent/Activity
                      </h4>
                      <p className="mt-1 text-sm">
                        {entry.activityAntecedent || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Behaviors</h4>
                      {entry.behaviors?.length > 0 ? (
                        <ul className="list-disc pl-5 mt-1">
                          {entry.behaviors.map(
                            (behavior: string, i: number) => (
                              <li key={i} className="text-sm">
                                {behavior}
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          No behaviors recorded
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Interventions</h4>
                      {entry.interventions?.length > 0 ? (
                        <ul className="list-disc pl-5 mt-1">
                          {entry.interventions.map(
                            (intervention: string, i: number) => (
                              <li key={i} className="text-sm">
                                {intervention}
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          No interventions recorded
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">
                        Replacement Programs
                      </h4>
                      {entry.replacementPrograms?.length > 0 ? (
                        <ul className="list-disc pl-5 mt-1">
                          {entry.replacementPrograms.map(
                            (program: string, i: number) => (
                              <li key={i} className="text-sm">
                                {program}
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          No replacement programs recorded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No ABC entries recorded
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reinforcers</CardTitle>
        </CardHeader>
        <CardContent>
          {formData?.reinforcers?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {formData.reinforcers.map((reinforcer: string, index: number) => (
                <li key={index} className="text-sm">
                  {reinforcer}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reinforcers recorded
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            className={
              formData?.valuation === "good"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : formData?.valuation === "fair"
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {formData?.valuation === "good"
              ? "Good"
              : formData?.valuation === "fair"
                ? "Fair"
                : "Poor"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
