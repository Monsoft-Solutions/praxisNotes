import { db } from "../client";
import { interventions, users, organizations } from "../schema";

/**
 * Seed interventions table with common interventions
 * Some interventions are global (null organizationId) and some are org-specific
 */
export async function seedInterventions(
  organizationId: string,
  defaultUserId: string,
) {
  console.log("Seeding interventions table...");

  // Check if interventions are already seeded
  const existingInterventions = await db.select().from(interventions).limit(1);
  if (existingInterventions.length > 0) {
    console.log("Interventions already seeded, skipping...");
    return;
  }

  // Global interventions (available to all organizations)
  const globalInterventions = [
    // Behavioral interventions
    {
      name: "Positive reinforcement",
      description: "Providing rewards or praise to increase desired behaviors",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Token economy",
      description:
        "System where tokens are earned for positive behaviors and exchanged for rewards",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Response cost",
      description:
        "Removal of reinforcers contingent upon inappropriate behavior",
      category: "behavioral",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Communication interventions
    {
      name: "Visual support systems",
      description:
        "Using pictures, symbols, or written words to support communication",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Social stories",
      description:
        "Short stories describing social situations and appropriate responses",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Video modeling",
      description:
        "Watching videos demonstrating appropriate behaviors or skills",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Skills development interventions
    {
      name: "Task analysis",
      description: "Breaking down complex tasks into smaller, manageable steps",
      category: "skills",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Chaining",
      description:
        "Teaching skills by linking discrete behaviors together in sequence",
      category: "skills",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Prompting hierarchy",
      description: "Systematic approach to providing and fading assistance",
      category: "skills",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Emotional regulation interventions
    {
      name: "Zones of regulation",
      description: "Framework to foster self-regulation and emotional control",
      category: "emotional",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Mindfulness exercises",
      description: "Activities to promote present-moment awareness and calm",
      category: "emotional",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Crisis management interventions
    {
      name: "Functional behavior assessment",
      description: "Process to identify function of challenging behaviors",
      category: "crisis",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Crisis prevention plan",
      description:
        "Proactive strategies to prevent and manage crisis situations",
      category: "crisis",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Redirect and replacement",
      description:
        "Redirecting challenging behavior to functionally equivalent appropriate behavior",
      category: "crisis",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "De-escalation techniques",
      description: "Methods to reduce the intensity of escalating behaviors",
      category: "crisis",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Organization-specific interventions
  const organizationInterventions = [
    {
      name: "Classroom behavior management system",
      description:
        "Comprehensive system for managing behaviors in classroom setting",
      category: "organization",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Check-in/Check-out",
      description: "Daily monitoring system with regular feedback sessions",
      category: "behavioral",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Peer-mediated intervention",
      description:
        "Utilizing peers to model and reinforce appropriate behaviors",
      category: "social",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Self-monitoring protocol",
      description:
        "System for clients to track and evaluate their own behavior",
      category: "emotional",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Combine interventions and insert
  const allInterventions = [
    ...globalInterventions,
    ...organizationInterventions,
  ];

  try {
    await db.insert(interventions).values(allInterventions);
    console.log(
      `Inserted ${allInterventions.length} interventions successfully`,
    );
  } catch (error) {
    console.error("Error seeding interventions:", error);
    throw error;
  }
}

/**
 * Standalone function to seed interventions
 * Used when running this file directly
 */
export async function seedInterventionsStandalone() {
  try {
    console.log("🔄 Starting standalone intervention seeding...");

    // Get the first organization and user
    const org = await db.select().from(organizations).limit(1);
    const user = await db.select().from(users).limit(1);

    if (!org.length || !user.length || !org[0]?.id || !user[0]?.id) {
      console.error(
        "❌ Cannot seed interventions: No organization or user found",
      );
      console.error(
        "Please run the full seed first to create users and organizations",
      );
      process.exit(1);
    }

    await seedInterventions(org[0].id, user[0].id);
    console.log("✅ Interventions seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding interventions:", error);
    process.exit(1);
  }
}
