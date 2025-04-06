"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SessionHeaderProps {
  clientName: string;
}

export function SessionHeader({ clientName }: SessionHeaderProps) {
  const clientSlug = clientName.split(" ")[0]?.toLowerCase() || "";

  return (
    <div className="space-y-2">
      <nav className="flex items-center text-sm">
        <Link
          href="/clients"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Clients
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <Link
          href={`/clients/${clientSlug}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {clientName}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
        <span className="text-foreground font-medium">New Session</span>
      </nav>

      <h1 className="text-2xl font-bold">New Session for {clientName}</h1>
      <p className="text-muted-foreground">
        Fill out the form below to record session data and generate notes.
      </p>
    </div>
  );
}
