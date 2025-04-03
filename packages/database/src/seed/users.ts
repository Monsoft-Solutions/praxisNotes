import { db } from "../client";
import { users, organizations, userRoles } from "../schema";
import { hash } from "bcryptjs";
/**
 * Seeds the users table with sample users
 */
export async function seed() {
  console.log("👤 Seeding users...");
  const passwordHash = await hash("admin123", 12);

  const organizationsResults = await db.select().from(organizations).limit(1);

  if (!organizationsResults || organizationsResults.length === 0) {
    throw new Error("Default organization not found");
  }

  const defaultOrganization = organizationsResults[0]!;

  try {
    // Create admin user first with fixed email
    await db
      .insert(users)
      .values({
        email: "admin@praxisnotes.com",
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        isActive: true,
        isEmailVerified: true,
        authProvider: "email",
        passwordHash,
        organizationId: defaultOrganization.id,
      })
      .returning();

    // Get admin user for associations
    const adminUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, "admin@praxisnotes.com"),
    });

    if (!adminUser) {
      throw new Error("Failed to create admin user");
    }

    // For random users, we'll create them manually instead of using drizzle-seed refinement due to type issues
    const firstNames = [
      "John",
      "Jane",
      "Alice",
      "Bob",
      "Charlie",
      "Diana",
      "Edward",
      "Fiona",
      "George",
      "Hannah",
    ];
    const lastNames = [
      "Smith",
      "Jones",
      "Williams",
      "Brown",
      "Taylor",
      "Davies",
      "Wilson",
      "Evans",
      "Thomas",
      "Johnson",
    ];
    const avatars = [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
    ];
    const providers = ["email", "google", "supabase"];

    // Create 10 random users
    for (let i = 0; i < 10; i++) {
      const firstName = firstNames[i] || "User";
      const lastName = lastNames[i] || "Name";

      await db.insert(users).values({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
        authProvider: providers[Math.floor(Math.random() * providers.length)],
        authProviderId: crypto.randomUUID(),
        isActive: Math.random() > 0.1, // 90% are active
        isEmailVerified: Math.random() > 0.2, // 80% are verified
        organizationId: defaultOrganization.id,
      });
    }

    // Get all organizations
    const allOrganizations = await db.query.organizations.findMany();

    // Get all users except admin
    const allUsers = await db.query.users.findMany({
      where: (user, { ne }) => ne(user.email, "admin@example.com"),
    });

    // Get all roles
    const allRoles = await db.query.roles.findMany();

    if (allOrganizations.length === 0 || allRoles.length === 0) {
      throw new Error("Organizations or roles must be seeded first");
    }

    const adminRoleId = allRoles.find((role) => role.name === "admin")?.id;
    if (adminRoleId) {
      await db.insert(userRoles).values({
        userId: adminUser.id,
        roleId: adminRoleId,
      });
    }

    // Associate other users with random organizations and roles
    for (const user of allUsers) {
      // Assign to 1 random role (not admin for regular users)
      const nonAdminRoles = allRoles.filter((role) => role.name !== "admin");
      if (nonAdminRoles.length > 0) {
        const randomRoleIndex = Math.floor(
          Math.random() * nonAdminRoles.length,
        );
        const role = nonAdminRoles[randomRoleIndex];

        if (role) {
          await db.insert(userRoles).values({
            userId: user.id,
            roleId: role.id,
          });
        }
      }
    }

    console.log("✅ Users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}
