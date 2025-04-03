import { seed as seedRoles } from "./roles";
import { seed as seedOrganizations } from "./organizations";
import { seed as seedUsers } from "./users";
import { seed as seedClients } from "./clients";
import { seedBehaviors } from "./behaviors.seed";
import { seedReplacementPrograms } from "./replacement-programs.seed";
import { db } from "../client";
import { reset } from "drizzle-seed";
import * as schema from "../schema";
import { users, organizations } from "../schema";
import { eq, ilike } from "drizzle-orm";

// Export individual seed functions
export {
  seedRoles,
  seedOrganizations,
  seedUsers,
  seedClients,
  seedBehaviors,
  seedReplacementPrograms,
};

/**
 * Main function to seed all data
 */
export async function seedAll() {
  console.log("🌱 Seeding database...");

  try {
    // Reset database first to start fresh
    console.log("🧹 Resetting database...");
    await reset(db, schema);

    // Seed all tables
    await seedRoles();
    await seedOrganizations();
    await seedUsers();

    // Get first organization and user for behaviors seeding
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@praxisnotes.com"))
      .limit(1);

    if (!userResult[0]) {
      throw new Error("Could not find user");
    }

    const organizationResult = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, userResult[0].organizationId))
      .limit(1);

    if (!organizationResult[0]) {
      throw new Error("Could not find organization");
    }

    await seedClients();

    if (
      organizationResult.length > 0 &&
      userResult.length > 0 &&
      organizationResult[0]?.id &&
      userResult[0]?.id
    ) {
      // Seed behaviors first, as replacement programs depend on them
      await seedBehaviors(organizationResult[0].id, userResult[0].id);
      // Seed replacement programs after behaviors
      await seedReplacementPrograms(organizationResult[0].id, userResult[0].id);
    } else {
      console.error(
        "Could not seed behaviors or replacement programs: missing organization or user",
      );
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// If this file is run directly in Node.js, seed the database
// This works with both ESM and CJS
if (
  (typeof require !== "undefined" && require.main === module) ||
  (typeof process !== "undefined" &&
    process.argv[1] &&
    process.argv[1].includes("seed/index"))
) {
  seedAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to seed database:", error);
      process.exit(1);
    });
}
