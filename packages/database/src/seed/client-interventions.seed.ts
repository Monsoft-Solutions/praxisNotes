import { db } from "../client";
import { clientInterventions, clientInterventionBehaviors } from "../schema";
import type { ClientIntervention } from "../schema/client-intervention.table";

/**
 * Seed client interventions
 * This will create sample interventions for clients and associate them with behaviors
 */
export async function seed() {
  console.log("🏆 Seeding client interventions...");

  try {
    // First get client behaviors
    const allClientBehaviors = await db.query.clientBehaviors.findMany();

    if (allClientBehaviors.length === 0) {
      console.warn(
        "No client behaviors found, skipping client intervention seeding",
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

    // Create interventions for each client with behaviors
    const insertedInterventions: ClientIntervention[] = [];

    for (const [clientId, behaviors] of behaviorsByClient.entries()) {
      if (behaviors.length === 0) continue;

      // Create 1-3 interventions per client
      const interventionCount = Math.min(
        behaviors.length,
        Math.floor(Math.random() * 3) + 1,
      );

      for (let i = 0; i < interventionCount; i++) {
        // Create intervention
        const intervention = {
          clientId,
          interventionName: getRandomInterventionName(),
          interventionDescription: getRandomInterventionDescription(),
        };

        // Insert intervention
        const result = await db
          .insert(clientInterventions)
          .values(intervention)
          .returning();

        if (!result || result.length === 0) {
          console.warn("Failed to insert client intervention, skipping");
          continue;
        }

        const insertedIntervention = result[0] as ClientIntervention;
        insertedInterventions.push(insertedIntervention);

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
          await db.insert(clientInterventionBehaviors).values({
            clientInterventionId: insertedIntervention.id,
            clientBehaviorId: behavior.id,
          });
        }
      }
    }

    console.log(
      `✅ Seeded ${insertedInterventions.length} client interventions`,
    );
    return insertedInterventions;
  } catch (error) {
    console.error("❌ Error seeding client interventions:", error);
    throw error;
  }
}

/**
 * Helper function to get a random intervention name
 */
function getRandomInterventionName(): string {
  const interventionNames = [
    "Differential Reinforcement",
    "Token Economy",
    "Visual Schedule Implementation",
    "Behavioral Momentum",
    "Extinction Procedure",
    "Response Interruption",
    "Non-Contingent Reinforcement",
    "Task Analysis Training",
    "Functional Communication Training",
    "Behavioral Skills Training",
    "Pivotal Response Training",
    "Antecedent Manipulation",
  ];

  const randomIndex = Math.floor(Math.random() * interventionNames.length);
  return interventionNames[randomIndex] || "Standard Behavioral Intervention";
}

/**
 * Helper function to get a random intervention description
 */
function getRandomInterventionDescription(): string {
  const descriptions = [
    "Systematic procedure to decrease challenging behaviors and increase appropriate behaviors.",
    "Evidence-based intervention designed to address the target behavior pattern.",
    "Structured approach to modify environmental conditions and reinforce positive behaviors.",
    "Comprehensive intervention protocol focusing on skill acquisition and behavior reduction.",
    "Targeted intervention strategy addressing the function of problematic behaviors.",
  ];

  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return (
    descriptions[randomIndex] ||
    "Behavioral intervention protocol targeting specific behaviors."
  );
}
