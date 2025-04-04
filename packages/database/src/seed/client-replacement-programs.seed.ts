import { db } from "../client";
import {
  clientReplacementPrograms,
  clientReplacementProgramBehaviors,
  clientBehaviors,
} from "../schema";
import type { ClientReplacementProgram } from "../schema/client-replacement-program.table";

/**
 * Seed client replacement programs
 * This will create sample replacement programs for clients and associate them with behaviors
 */
export async function seed() {
  console.log("🔄 Seeding client replacement programs...");

  try {
    // First get client behaviors
    const allClientBehaviors = await db.query.clientBehaviors.findMany();

    if (allClientBehaviors.length === 0) {
      console.warn(
        "No client behaviors found, skipping client replacement program seeding",
      );
      return [];
    }

    // Group behaviors by client
    const behaviorsByClient = new Map<string, typeof allClientBehaviors>();

    for (const behavior of allClientBehaviors) {
      const clientBehaviors = behaviorsByClient.get(behavior.clientId) || [];
      clientBehaviors.push(behavior);
      behaviorsByClient.set(behavior.clientId, clientBehaviors);
    }

    // Create replacement programs for each client with behaviors
    const insertedReplacementPrograms: ClientReplacementProgram[] = [];

    for (const [clientId, behaviors] of behaviorsByClient.entries()) {
      if (behaviors.length === 0) continue;

      // Create 1-2 replacement programs per client
      const programCount = Math.min(
        behaviors.length,
        Math.floor(Math.random() * 2) + 1,
      );

      for (let i = 0; i < programCount; i++) {
        // Create replacement program
        const replacementProgram = {
          clientId,
          programName: getRandomReplacementProgramName(),
          programDescription: getRandomReplacementProgramDescription(),
          baseline: String(Math.floor(Math.random() * 50) + 10), // Random baseline between 10-60
        };

        // Insert replacement program
        const result = await db
          .insert(clientReplacementPrograms)
          .values(replacementProgram)
          .returning();

        if (!result || result.length === 0) {
          console.warn("Failed to insert client replacement program, skipping");
          continue;
        }

        const insertedProgram = result[0] as ClientReplacementProgram;
        insertedReplacementPrograms.push(insertedProgram);

        // Associate with 1-3 behaviors from this client (random selection)
        const behaviorCount = Math.min(
          behaviors.length,
          Math.floor(Math.random() * 3) + 1,
        );
        const shuffledBehaviors = [...behaviors].sort(
          () => Math.random() - 0.5,
        );
        const selectedBehaviors = shuffledBehaviors.slice(0, behaviorCount);

        // Create associations
        for (const behavior of selectedBehaviors) {
          await db.insert(clientReplacementProgramBehaviors).values({
            clientReplacementProgramId: insertedProgram.id,
            clientBehaviorId: behavior.id,
          });
        }
      }
    }

    console.log(
      `✅ Seeded ${insertedReplacementPrograms.length} client replacement programs`,
    );
    return insertedReplacementPrograms;
  } catch (error) {
    console.error("❌ Error seeding client replacement programs:", error);
    throw error;
  }
}

/**
 * Helper function to get a random replacement program name
 */
function getRandomReplacementProgramName(): string {
  const programNames = [
    "Communication Training",
    "Self-Regulation Program",
    "Functional Skills Development",
    "Coping Strategies Training",
    "Social Skills Program",
    "Emotion Regulation Program",
    "Play Skills Development",
    "Attention Enhancement Program",
    "Tolerance Building Program",
    "Adaptive Behavior Training",
  ];

  const randomIndex = Math.floor(Math.random() * programNames.length);
  return programNames[randomIndex] || "Default Replacement Program";
}

/**
 * Helper function to get a random replacement program description
 */
function getRandomReplacementProgramDescription(): string {
  const descriptions = [
    "A comprehensive program focused on teaching alternative appropriate behaviors.",
    "This program aims to develop skills that replace challenging behaviors with adaptive ones.",
    "Structured intervention to promote positive behaviors and reduce challenging ones.",
    "A systematic approach to teaching functional alternatives to problematic behaviors.",
    "Evidence-based program to develop replacement skills for maladaptive behaviors.",
  ];

  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return (
    descriptions[randomIndex] ||
    "A program to develop appropriate replacement behaviors."
  );
}
