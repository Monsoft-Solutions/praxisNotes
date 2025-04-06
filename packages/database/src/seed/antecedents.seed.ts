import { db } from "../client";
import { antecedents, users, organizations } from "../schema";

/**
 * Seed antecedents table with common RBT session activities
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
    // Structured Learning activities
    {
      name: "DTT session",
      description: "Discrete Trial Training session with client",
      category: "structured_learning",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "PECS training",
      description: "Picture Exchange Communication System training",
      category: "structured_learning",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Social skills group",
      description: "Facilitated social skills group activity",
      category: "structured_learning",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Natural Environment Teaching
    {
      name: "Playground activity",
      description: "Supervised play and skills practice at playground",
      category: "natural_environment",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Snack/mealtime",
      description: "Supervised mealtime with targeted skills practice",
      category: "natural_environment",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Community outing",
      description:
        "Supervised community-based activity for skill generalization",
      category: "natural_environment",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Behavioral Interventions
    {
      name: "Token economy implementation",
      description: "Using token economy for behavior reinforcement",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Functional communication training",
      description:
        "Teaching appropriate communication to replace problem behaviors",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Self-regulation activity",
      description: "Teaching and practicing self-regulation strategies",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Skill Development
    {
      name: "Daily living skills",
      description: "Teaching and practicing daily living and self-help skills",
      category: "skill_development",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Academic support",
      description: "Providing support with academic tasks and skills",
      category: "skill_development",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Play skills development",
      description: "Teaching appropriate play skills and interactions",
      category: "skill_development",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Organization-specific antecedents
  const organizationAntecedents = [
    {
      name: "Clinic-based assessment",
      description: "Assessment activities conducted at the clinic",
      category: "assessment",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Parent training session",
      description: "Training parents on implementing behavioral strategies",
      category: "caregiver_training",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Transition planning",
      description: "Activities to support transitions between environments",
      category: "transition_support",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Specialized protocol implementation",
      description: "Implementation of organization-specific protocols",
      category: "specialized_protocols",
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
