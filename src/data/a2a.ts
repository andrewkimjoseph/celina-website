import agentCard from "../../public/.well-known/agent-card.json";

export interface A2ASkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export const A2A_SKILLS = agentCard.skills as A2ASkill[];

/** Comma-separated A2A skill IDs from the hosted Agent Card */
export const A2A_SKILL_IDS_CSV = A2A_SKILLS.map((skill) => skill.id).join(", ");
