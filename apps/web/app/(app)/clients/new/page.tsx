"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { ClientForm } from "../components/client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>New Client</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="text-3xl font-bold mt-2">Add New Client</h1>
        <p className="text-muted-foreground mt-1">
          Create a new client record with behaviors, replacement programs, and
          interventions.
        </p>
      </div>
      <Separator />
      <ClientForm />
    </div>
  );
}
