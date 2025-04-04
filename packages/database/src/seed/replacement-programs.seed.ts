import { db } from "../client";
import {
  replacementPrograms,
  behaviors,
  users,
  organizations,
} from "../schema";
import { eq } from "drizzle-orm";

/**
 * Seed replacement programs table with common ABA replacement programs
 * Some replacement programs are global (null organizationId) and some are org-specific
 */
export async function seedReplacementPrograms(
  organizationId: string,
  defaultUserId: string,
) {
  console.log("Seeding replacement programs table...");

  // Check if replacement programs are already seeded
  const existingPrograms = await db.select().from(replacementPrograms).limit(1);
  if (existingPrograms.length > 0) {
    console.log("Replacement programs already seeded, skipping...");
    return;
  }

  // Global replacement programs (available to all organizations)
  const globalPrograms = [
    // For physical aggression
    {
      name: "Functional Communication Training",
      description:
        "Teaching appropriate requesting instead of aggressive behavior",
      category: "communication",
      organizationId: null,
      steps: [
        "1. Identify the function of aggression",
        "2. Teach appropriate request forms",
        "3. Prompt using the communication strategy",
        "4. Reinforce appropriate requests",
        "5. Gradually fade prompts",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Anger Management Techniques",
      description: "Teaching self-regulation strategies to manage frustration",
      category: "emotional",
      organizationId: null,
      steps: [
        "1. Identify early signs of anger",
        "2. Teach deep breathing techniques",
        "3. Practice counting to 10",
        "4. Use visual supports for emotion identification",
        "5. Provide calm-down space",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // For self-injurious behavior
    {
      name: "Sensory Integration Activities",
      description:
        "Providing appropriate sensory input to address sensory needs",
      category: "sensory",
      organizationId: null,
      steps: [
        "1. Conduct sensory assessment",
        "2. Develop sensory diet",
        "3. Implement scheduled sensory breaks",
        "4. Provide sensory tools",
        "5. Teach appropriate sensory-seeking behaviors",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Differential Reinforcement",
      description:
        "Reinforcing alternative behaviors incompatible with self-injury",
      category: "behavioral",
      organizationId: null,
      steps: [
        "1. Identify target behavior",
        "2. Select alternative behavior",
        "3. Set up reinforcement schedule",
        "4. Ignore target behavior",
        "5. Consistently reinforce alternative behavior",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // For elopement
    {
      name: "Safety Awareness Training",
      description: "Teaching safety skills and appropriate boundaries",
      category: "safety",
      organizationId: null,
      steps: [
        "1. Establish clear boundaries",
        "2. Use visual supports for boundaries",
        "3. Teach asking for breaks",
        "4. Practice staying with group",
        "5. Reinforce appropriate boundary recognition",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Check-In System",
      description:
        "Implementing a structured system for requesting to leave an area",
      category: "organizational",
      organizationId: null,
      steps: [
        "1. Create check-in board",
        "2. Teach use of break card",
        "3. Practice requesting breaks",
        "4. Gradually increase time in designated area",
        "5. Reinforce staying in area and using check-in system",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // For tantrums/meltdowns
    {
      name: "Emotion Regulation Strategies",
      description: "Teaching strategies to identify and manage emotions",
      category: "emotional",
      organizationId: null,
      steps: [
        "1. Use emotion chart",
        "2. Teach emotion vocabulary",
        "3. Practice calming techniques",
        "4. Use social stories",
        "5. Create calm-down kit with preferred items",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Visual Schedule Implementation",
      description:
        "Using visual supports to increase predictability and reduce anxiety",
      category: "organizational",
      organizationId: null,
      steps: [
        "1. Create visual schedule",
        "2. Review schedule at start of session",
        "3. Signal transitions",
        "4. Use countdown timer",
        "5. Reinforce following schedule",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // For property destruction
    {
      name: "Appropriate Object Use Training",
      description: "Teaching appropriate use of materials and objects",
      category: "behavioral",
      organizationId: null,
      steps: [
        "1. Model proper object use",
        "2. Use visual supports",
        "3. Practice with durable items",
        "4. Reinforce gentle handling",
        "5. Provide appropriate destruction alternatives (stress balls, tear paper)",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // For non-compliance
    {
      name: "Choice-Making Opportunities",
      description: "Providing structured choices to increase autonomy",
      category: "behavioral",
      organizationId: null,
      steps: [
        "1. Offer 2-3 acceptable choices",
        "2. Use visual choice board",
        "3. Honor choices made",
        "4. Gradually expand choice options",
        "5. Reinforce making and following through with choices",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "First-Then Board",
      description: "Using visual support to show sequence of activities",
      category: "organizational",
      organizationId: null,
      steps: [
        "1. Create first-then board",
        "2. Keep 'first' activity brief",
        "3. Ensure 'then' activity is motivating",
        "4. Use consistent language",
        "5. Immediately provide 'then' activity upon completion",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Organization-specific replacement programs
  const organizationPrograms = [
    {
      name: "Peer Modeling Program",
      description: "Using peer models to demonstrate appropriate behaviors",
      category: "social",
      organizationId,
      steps: [
        "1. Identify appropriate peer models",
        "2. Structure cooperative activities",
        "3. Provide prompts for interaction",
        "4. Reinforce positive interactions",
        "5. Gradually fade adult support",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Zones of Regulation Implementation",
      description:
        "Using the Zones of Regulation curriculum for emotional regulation",
      category: "emotional",
      organizationId,
      steps: [
        "1. Teach zone identification",
        "2. Practice identifying feelings in each zone",
        "3. Create toolbox of strategies for each zone",
        "4. Practice zone transitions",
        "5. Implement check-in procedures",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Token Economy System",
      description:
        "Implementing token system to reinforce replacement behaviors",
      category: "behavioral",
      organizationId,
      steps: [
        "1. Select token board and tokens",
        "2. Define target behaviors",
        "3. Establish exchange schedule",
        "4. Implement consistently",
        "5. Gradually increase response requirement",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Combine replacement programs and insert
  const allPrograms = [...globalPrograms, ...organizationPrograms];

  try {
    await db.insert(replacementPrograms).values(allPrograms);
    console.log(
      `Inserted ${allPrograms.length} replacement programs successfully`,
    );
  } catch (error) {
    console.error("Error seeding replacement programs:", error);
    throw error;
  }
}

/**
 * Standalone function to seed replacement programs
 * Used when running this file directly
 */
export async function seedReplacementProgramsStandalone() {
  try {
    console.log("🔄 Starting standalone replacement programs seeding...");

    // Get the first organization and user
    const org = await db.select().from(organizations).limit(1);
    const user = await db.select().from(users).limit(1);

    if (!org.length || !user.length || !org[0]?.id || !user[0]?.id) {
      console.error(
        "❌ Cannot seed replacement programs: No organization or user found",
      );
      console.error(
        "Please run the full seed first to create users, organizations, and behaviors",
      );
      process.exit(1);
    }

    await seedReplacementPrograms(org[0].id, user[0].id);
    console.log("✅ Replacement programs seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding replacement programs:", error);
    process.exit(1);
  }
}
