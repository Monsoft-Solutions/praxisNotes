import { db } from "../client";
import { behaviors, users, organizations } from "../schema";

/**
 * Seed behaviors table with common ABA behaviors
 * Some behaviors are global (null organizationId) and some are org-specific
 */
export async function seedBehaviors(
  organizationId: string,
  defaultUserId: string,
) {
  console.log("Seeding behaviors table...");

  // Check if behaviors are already seeded
  const existingBehaviors = await db.select().from(behaviors).limit(1);
  if (existingBehaviors.length > 0) {
    console.log("Behaviors already seeded, skipping...");
    return;
  }

  // Global behaviors (available to all organizations)
  const globalBehaviors = [
    // Communication behaviors
    {
      name: "Requesting items/activities",
      description:
        "Uses verbal or non-verbal means to request desired items or activities",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Responding to questions",
      description: "Responds appropriately to direct questions",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Maintaining conversation",
      description:
        "Sustains reciprocal conversation with back-and-forth exchanges",
      category: "communication",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Social behaviors
    {
      name: "Taking turns",
      description:
        "Waits for turn and participates appropriately in turn-taking activities",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Sharing with peers",
      description:
        "Shares materials or toys with peers when requested or spontaneously",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Eye contact",
      description: "Establishes appropriate eye contact during interactions",
      category: "social",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Task behaviors
    {
      name: "Following instructions",
      description: "Follows 1-step, 2-step or multi-step instructions",
      category: "task",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Task completion",
      description: "Completes assigned tasks or activities without prompting",
      category: "task",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Transition between activities",
      description:
        "Transitions between activities with minimal resistance or prompting",
      category: "task",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Self-help behaviors
    {
      name: "Independent toileting",
      description: "Completes toileting routine independently",
      category: "self-help",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Hand washing",
      description: "Washes hands independently following appropriate steps",
      category: "self-help",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Challenging behaviors
    {
      name: "Physical aggression",
      description:
        "Displays aggression towards others (hitting, kicking, biting, etc.)",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Self-injurious behavior",
      description: "Engages in behaviors that may cause harm to self",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Elopement",
      description: "Runs away or leaves designated area without permission",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Tantrum/meltdown",
      description:
        "Displays emotional outburst with crying, yelling, or flopping",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Property destruction",
      description: "Damages, breaks, or destroys items in the environment",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Non-compliance",
      description: "Refuses to follow directions or complete tasks when asked",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },

    // Additional challenging behaviors
    {
      name: "Bolting",
      description:
        "Suddenly running away or quickly moving away from supervision",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Disruptive behavior",
      description:
        "Actions that interrupt or disrupt ongoing activities or the learning environment",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Climbing",
      description:
        "Climbing on furniture, equipment, or structures that are not meant for climbing",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Off-task",
      description:
        "Disengagement from assigned or expected tasks and activities",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Throwing objects",
      description: "Throwing items inappropriately or in a dangerous manner",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Defiant behavior",
      description: "Deliberately disobeying rules or direct instructions",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Temper tantrum",
      description:
        "Intense emotional outburst characterized by extreme anger or frustration",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Inappropriate sexual behavior toward self",
      description:
        "Engaging in sexual self-stimulation or behavior that is inappropriate for the setting or context",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Verbal aggression",
      description:
        "Using threatening, hostile, or inappropriate language toward others",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Food refusal",
      description: "Refusing to eat or engage with food during mealtimes",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Stereotypic behavior",
      description:
        "Repetitive movements or actions without clear functional purpose",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Screaming/yelling",
      description:
        "Loud vocalizations that are disruptive or inappropriate for the setting",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Inappropriate touching",
      description:
        "Touching others in ways that violate personal boundaries or social norms",
      category: "challenging",
      organizationId: null,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Organization-specific behaviors
  const organizationBehaviors = [
    {
      name: "Using visual schedule",
      description: "References and follows visual schedule independently",
      category: "organization",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Using AAC device",
      description:
        "Uses augmentative and alternative communication device appropriately",
      category: "communication",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Following classroom rules",
      description:
        "Follows established classroom or program rules consistently",
      category: "social",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Using calm down strategies",
      description: "Utilizes taught self-regulation strategies when upset",
      category: "emotional",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Peer interaction avoidance",
      description:
        "Consistently avoids or refuses to interact with peers when opportunities arise",
      category: "social",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Transitional aggression",
      description:
        "Displays aggressive behaviors specifically during activity transitions",
      category: "challenging",
      organizationId,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
  ];

  // Combine behaviors and insert
  const allBehaviors = [...globalBehaviors, ...organizationBehaviors];

  try {
    await db.insert(behaviors).values(allBehaviors);
    console.log(`Inserted ${allBehaviors.length} behaviors successfully`);
  } catch (error) {
    console.error("Error seeding behaviors:", error);
    throw error;
  }
}

/**
 * Standalone function to seed behaviors
 * Used when running this file directly
 */
export async function seedBehaviorsStandalone() {
  try {
    console.log("🔄 Starting standalone behavior seeding...");

    // Get the first organization and user
    const org = await db.select().from(organizations).limit(1);
    const user = await db.select().from(users).limit(1);

    if (!org.length || !user.length || !org[0]?.id || !user[0]?.id) {
      console.error("❌ Cannot seed behaviors: No organization or user found");
      console.error(
        "Please run the full seed first to create users and organizations",
      );
      process.exit(1);
    }

    await seedBehaviors(org[0].id, user[0].id);
    console.log("✅ Behaviors seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding behaviors:", error);
    process.exit(1);
  }
}
