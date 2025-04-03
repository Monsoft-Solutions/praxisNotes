import { Separator } from "@workspace/ui/components/separator";
import { requireAdmin } from "@/lib/auth/admin.utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect non-admin users
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          Manage system settings and configuration
        </p>
      </div>
      <Separator />
      <div>{children}</div>
    </div>
  );
}
