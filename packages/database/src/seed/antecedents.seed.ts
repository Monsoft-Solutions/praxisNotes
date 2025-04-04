import { db } from "../client";
import { antecedents, users, organizations } from "../schema";

/**
 * Seed antecedents table with common ABA antecedents
 * Some antecedents are global (null organizationId) and some are org-specific
 */
export async function seedAntecedents(
  organizationId: string,
  defaultUserId: string,
) {
  console.log("Seeding antecedents table...");

  // Check if antecedents are already seeded
  const existingAntecedents = await db.select().from(antecedents).limit(1);
  if (existingAntecedents.length > 0) {
    console.log("Antecedents already seeded, skipping...");
    return;
  }

  // Global antecedents (available to all organizations)
  const globalAntecedents = [
    // Environmental antecedents
    {
      name: "Loud noises",
      description: "Sudden or persistent loud noises in the environment",
      category: "environmental",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Crowded spaces",
      description: "Areas with many people or limited personal space",
      category: "environmental",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Changes in routine",
      description: "Unexpected changes or transitions in the daily schedule",
      category: "environmental",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Physiological antecedents
    {
      name: "Hunger",
      description: "Feeling hungry or not having eaten recently",
      category: "physiological",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Fatigue",
      description: "Feeling tired or not having adequate sleep",
      category: "physiological",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Physical discomfort",
      description: "Experiencing pain, illness, or sensory discomfort",
      category: "physiological",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Social antecedents
    {
      name: "Denied access to preferred item/activity",
      description: "Being unable to access a desired item or activity",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Peer conflict",
      description: "Disagreements or conflicts with peers",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Instructional demands",
      description: "Being presented with tasks or instructions",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Emotional antecedents
    {
      name: "Anxiety",
      description: "Feeling anxious or worried about a situation",
      category: "emotional",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Frustration",
      description: "Feeling frustrated with a task or situation",
      category: "emotional",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Sensory overload",
      description: "Experiencing overwhelming sensory input",
      category: "emotional",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Organization-specific antecedents
  const organizationAntecedents = [
    {
      name: "Specific classroom transitions",
      description: "Transitions between specific classroom activities",
      category: "environmental",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Particular staff interactions",
      description: "Interactions with specific staff members",
      category: "social",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Organization-specific demands",
      description: "Tasks or expectations specific to the organization",
      category: "social",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Specific sensory triggers",
      description: "Particular sensory inputs relevant to the environment",
      category: "environmental",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Combine antecedents and insert
  const allAntecedents = [...globalAntecedents, ...organizationAntecedents];

  try {
    await db.insert(antecedents).values(allAntecedents);
    console.log(`Inserted ${allAntecedents.length} antecedents successfully`);
  } catch (error) {
    console.error("Error seeding antecedents:", error);
    throw error;
  }
}

/**
 * Standalone function to seed antecedents
 * Used when running this file directly
 */
export async function seedAntecedentsStandalone() {
  try {
    console.log("🔄 Starting standalone antecedent seeding...");

    // Get the first organization and user
    const org = await db.select().from(organizations).limit(1);
    const user = await db.select().from(users).limit(1);

    if (!org.length || !user.length || !org[0]?.id || !user[0]?.id) {
      console.error(
        "❌ Cannot seed antecedents: No organization or user found",
      );
      console.error(
        "Please run the full seed first to create users and organizations",
      );
      process.exit(1);
    }

    await seedAntecedents(org[0].id, user[0].id);
    console.log("✅ Antecedents seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding antecedents:", error);
    process.exit(1);
  }
}
