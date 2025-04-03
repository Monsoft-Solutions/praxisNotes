"use client";

import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>This is the dashboard.</p>
      <div className="bg-muted/50 p-4 rounded-xl min-h-[300px]"></div>
      <Button
        onClick={() =>
          toast("Hello", {
            description: "This is a description",
            action: {
              label: "Click me",
              onClick: () => toast("Hello"),
            },
          })
        }
      >
        Click me
      </Button>
      <Button
        onClick={() =>
          toast.error("Error", {
            description: "This is a description",
            action: {
              label: "Click me",
              onClick: () => toast("Hello"),
            },
          })
        }
      >
        Click me for error
      </Button>
    </div>
  );
}
