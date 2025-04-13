/**
 * Collection of AI prompts used for generating content
 */
import { SessionFormData, ABCEntry } from "@praxisnotes/types";

/**
 * Creates a prompt for generating session notes based on session data
 * @param sessionData The session data to use for generating notes
 * @returns A formatted prompt string
 */
export function createSessionNotesPrompt(sessionData: SessionFormData): string {
  return `
You are a professional Registered Behavior Technician (RBT) writing a session report for a client. 
Please generate a comprehensive and professional report based on the following session data:

Date: ${sessionData.sessionDate instanceof Date ? sessionData.sessionDate.toLocaleDateString() : sessionData.sessionDate}
Time: ${sessionData.startTime} - ${sessionData.endTime}
Location: ${sessionData.location}
Participants: ${sessionData.presentParticipants.join(", ")}
Environmental Changes: ${sessionData.environmentalChanges.join(", ")}

${sessionData.abcEntries
  .map(
    (abc: ABCEntry, index: number) => `
ABC Entry #${index + 1}:
- Activity/Antecedent: ${abc.activityAntecedent}
- Behaviors: ${abc.behaviors.join(", ")}
- Interventions: ${abc.interventions.join(", ")}
- Replacement Programs: ${abc.replacementPrograms.join(", ")}
`,
  )
  .join("\n")}

Reinforcers: ${sessionData.reinforcers.join(", ")}
Overall Valuation: ${sessionData.valuation}

Please generate a professional narrative report that flows like a cohesive story. 
DO NOT format the response as structured markdown with sections and headings.

The report should:
1. Be written in a professional but narrative tone that reads like a continuous story
2. Focus primarily on the activities and client behaviors
3. Include all relevant clinical details but presented within a flowing narrative
4. Mention the client by their initials, the guardian by their initials, and the RBT by their initials
5. Include specific data about behaviors, prompts, and reinforcements within the narrative
6. Maintain chronological flow between activities
7. End with a brief summary of environmental factors and plans for the next session
8. Don't be verbose, just write the report in a concise manner
9. Use 3rd person to write the report. Don't use "I" or "we" to refer to the RBT.

Please provide ONLY the narrative report without any section headings, metadata, or additional commentary.
`;
}
