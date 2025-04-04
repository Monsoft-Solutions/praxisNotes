import { and } from "drizzle-orm";

import { userRoles } from "@praxisnotes/database";

import { roles } from "@praxisnotes/database";

import { db } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "./auth";

/**
 * Check if user has admin role
 */
export async function isAdmin(userId: string) {
  // Find the admin role
  const adminRole = await db.query.roles.findFirst({
    where: eq(roles.name, "admin"),
  });

  if (!adminRole) {
    return false;
  }

  // Check if user has the admin role
  const userRole = await db.query.userRoles.findFirst({
    where: and(
      eq(userRoles.userId, userId),
      eq(userRoles.roleId, adminRole.id),
    ),
    with: {
      role: true,
    },
  });

  return !!userRole;
}

/**
 * Require admin role and redirect if not
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const adminCheck = await isAdmin(session.user.id);
  if (!adminCheck) {
    redirect("/dashboard");
  }

  return session;
}
