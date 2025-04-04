import { db } from "../client";
import { clientBehaviors } from "../schema";

/**
 * Seed client behaviors
 * This will create sample behaviors for each client
 */
export async function seed() {
  console.log("🧠 Seeding client behaviors...");

  try {
    // Get clients from database
    const clients = await db.query.clients.findMany({
      limit: 3, // Just use first 3 clients for sample data
    });

    if (clients.length === 0) {
      console.warn("No clients found, skipping client behavior seeding");
      return [];
    }

    // Make sure we have all 3 clients, otherwise log warning and continue with what we have
    if (clients.length < 3) {
      console.warn(
        `Only found ${clients.length} clients, some behavior data will be skipped`,
      );
    }

    // Sample behavior data to associate with clients
    const behaviors = [];

    // Client 1 behaviors (3)
    if (clients[0]) {
      behaviors.push(
        {
          clientId: clients[0].id,
          behaviorName: "Aggression",
          behaviorDescription: "Physical aggression towards others or property",
          baseline: "12",
          type: "frequency",
          topographies: [
            "Hitting",
            "Kicking",
            "Biting",
            "Property destruction",
          ],
        },
        {
          clientId: clients[0].id,
          behaviorName: "Self-injury",
          behaviorDescription:
            "Self-injurious behaviors including head-banging and scratching",
          baseline: "8",
          type: "frequency",
          topographies: ["Head-banging", "Scratching", "Hair-pulling"],
        },
        {
          clientId: clients[0].id,
          behaviorName: "Task Refusal",
          behaviorDescription: "Refusing to complete assigned tasks",
          baseline: "65",
          type: "percentage",
          topographies: ["Verbal refusal", "Walking away", "Dropping to floor"],
        },
      );
    }

    // Client 2 behaviors (2)
    if (clients[1]) {
      behaviors.push(
        {
          clientId: clients[1].id,
          behaviorName: "Disruptive Vocalization",
          behaviorDescription:
            "Loud vocalizations that disrupt the learning environment",
          baseline: "25",
          type: "frequency",
          topographies: ["Screaming", "Yelling", "Loud humming"],
        },
        {
          clientId: clients[1].id,
          behaviorName: "Elopement",
          behaviorDescription: "Leaving designated area without permission",
          baseline: "4",
          type: "frequency",
          topographies: ["Running from classroom", "Leaving designated area"],
        },
      );
    }

    // Client 3 behaviors (3)
    if (clients[2]) {
      behaviors.push(
        {
          clientId: clients[2].id,
          behaviorName: "Stereotypy",
          behaviorDescription:
            "Repetitive movements that interfere with learning",
          baseline: "85",
          type: "percentage",
          topographies: ["Hand flapping", "Rocking", "Spinning objects"],
        },
        {
          clientId: clients[2].id,
          behaviorName: "Non-compliance",
          behaviorDescription:
            "Not following through with instructions within 10 seconds",
          baseline: "72",
          type: "percentage",
          topographies: [
            "Ignoring instructions",
            "Engaging in alternative behavior",
          ],
        },
        {
          clientId: clients[2].id,
          behaviorName: "Tantrums",
          behaviorDescription:
            "Emotional outbursts including crying and screaming",
          baseline: "7",
          type: "frequency",
          topographies: ["Crying", "Screaming", "Dropping to floor"],
        },
      );
    }

    // If no behaviors could be created, return
    if (behaviors.length === 0) {
      console.warn(
        "No client behaviors could be created, returning empty array",
      );
      return [];
    }

    // Insert client behaviors
    const insertedBehaviors = [];

    for (const behavior of behaviors) {
      const [inserted] = await db
        .insert(clientBehaviors)
        .values({
          clientId: behavior.clientId,
          behaviorName: behavior.behaviorName,
          behaviorDescription: behavior.behaviorDescription,
          baseline: behavior.baseline,
          type: behavior.type,
          topographies: behavior.topographies,
        })
        .returning();

      insertedBehaviors.push(inserted);
    }

    console.log(`✅ Seeded ${insertedBehaviors.length} client behaviors`);
    return insertedBehaviors;
  } catch (error) {
    console.error("❌ Error seeding client behaviors:", error);
    throw error;
  }
}
