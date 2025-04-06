import { db } from "../client";
import { replacementPrograms, users, organizations } from "../schema";

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

    // Additional replacement programs
    {
      name: "Take a Reinforcer from Two Choice of Items",
      description: "Teaching client to make choices between preferred items",
      category: "choice-making",
      organizationId: null,
      steps: [
        "1. Identify preferred items through preference assessment",
        "2. Present two items within reach",
        "3. Prompt client to select one item if needed",
        "4. Allow immediate access to selected item",
        "5. Gradually reduce prompting as skill develops",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Follow Instruction to Look at a Non-Reinforcing Item",
      description: "Teaching compliance with simple attention directions",
      category: "attention",
      organizationId: null,
      steps: [
        "1. Select non-preferred but neutral items",
        "2. Give clear, simple instruction to look at item",
        "3. Provide immediate reinforcement for compliance",
        "4. Gradually increase duration of attention required",
        "5. Vary items and contexts to promote generalization",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Waits Without Touching Stimuli",
      description: "Teaching waiting skills and impulse control",
      category: "self-regulation",
      organizationId: null,
      steps: [
        "1. Place desirable item in view but not accessible",
        "2. Give clear wait instruction",
        "3. Start with brief wait intervals (3-5 seconds)",
        "4. Reinforce successful waiting",
        "5. Gradually increase wait time as tolerance builds",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Match Identical Objects to Sample",
      description: "Teaching basic visual discrimination and matching skills",
      category: "cognitive",
      organizationId: null,
      steps: [
        "1. Start with highly distinct objects",
        "2. Present sample object and array of comparison objects",
        "3. Prompt matching response if needed",
        "4. Reinforce correct matches",
        "5. Gradually increase similarity between comparison objects",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Motor Imitation Using Objects",
      description: "Teaching client to copy actions performed with objects",
      category: "imitation",
      organizationId: null,
      steps: [
        "1. Select motivating objects",
        "2. Demonstrate simple action with object",
        "3. Provide identical object to client",
        "4. Prompt imitation if needed",
        "5. Reinforce successful imitation and fade prompts",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Delay of Reinforcement",
      description: "Teaching tolerance for delayed gratification",
      category: "self-regulation",
      organizationId: null,
      steps: [
        "1. Identify powerful reinforcers",
        "2. Start with minimal delay (1-2 seconds)",
        "3. Provide visual timer if helpful",
        "4. Reinforce waiting behavior",
        "5. Gradually increase delay interval",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Imitation of Words on Request",
      description: "Teaching vocal imitation skills for language development",
      category: "communication",
      organizationId: null,
      steps: [
        "1. Start with motivating words (preferred items/activities)",
        "2. Present clear model with appropriate volume and speed",
        "3. Reinforce any approximation initially",
        "4. Shape responses toward accurate production",
        "5. Practice in various contexts to promote generalization",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Follows Instructions to Completion",
      description: "Teaching task completion and instruction following",
      category: "compliance",
      organizationId: null,
      steps: [
        "1. Start with simple, one-step instructions",
        "2. Use clear, concise language",
        "3. Prompt completion if needed",
        "4. Reinforce task completion",
        "5. Gradually increase complexity of instructions",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Allows Others to Manipulate/Touch Toys",
      description: "Teaching tolerance for shared play and turn-taking",
      category: "social",
      organizationId: null,
      steps: [
        "1. Start with less preferred toys",
        "2. Model appropriate play",
        "3. Briefly touch/manipulate toy while client observes",
        "4. Reinforce tolerance",
        "5. Gradually increase duration of shared play",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Playing Appropriately with Items",
      description: "Teaching functional play skills with toys and objects",
      category: "play",
      organizationId: null,
      steps: [
        "1. Select developmentally appropriate toys",
        "2. Model appropriate play actions",
        "3. Prompt functional play if needed",
        "4. Reinforce appropriate play",
        "5. Expand play repertoire with new toys and actions",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Request Tangible",
      description: "Teaching appropriate requesting for desired items",
      category: "communication",
      organizationId: null,
      steps: [
        "1. Identify motivating items",
        "2. Create opportunities for requests (item in sight but out of reach)",
        "3. Prompt appropriate request form (verbal, sign, picture, etc.)",
        "4. Immediately provide requested item",
        "5. Fade prompts as independent requesting emerges",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Responds to Own Name and to 'Come'",
      description: "Teaching basic responsiveness to verbal cues",
      category: "attention",
      organizationId: null,
      steps: [
        "1. Call name in close proximity",
        "2. Reinforce any orientation response",
        "3. Gradually increase distance when calling",
        "4. Pair name with 'come' instruction",
        "5. Reinforce approaching when called",
      ],
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    },
    {
      name: "Transitions/Interruptions",
      description: "Teaching flexibility and tolerance for activity changes",
      category: "self-regulation",
      organizationId: null,
      steps: [
        "1. Use visual countdown timer for transitions",
        "2. Provide verbal warnings before transitions",
        "3. Use transition objects when possible",
        "4. Reinforce smooth transitions",
        "5. Create social stories about transitions if helpful",
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
