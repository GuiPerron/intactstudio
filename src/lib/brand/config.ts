export type BrandId = "intact" | "belairdirect";

export interface BrandConfig {
  id: BrandId;
  name: string;
  tagline: string;
  agentName: string;
  agentRole: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const brands: Record<BrandId, BrandConfig> = {
  intact: {
    id: "intact",
    name: "Intact Insurance",
    tagline: "For Everything You Care About",
    agentName: "Mia",
    agentRole: "Intact Brand Strategist",
    colors: {
      primary: "#DF0030",
      background: "#F7F2EA",
      text: "#000000",
      accent: "#DF0030",
    },
  },
  belairdirect: {
    id: "belairdirect",
    name: "belairdirect",
    tagline: "insurance. simplified.",
    agentName: "Fred",
    agentRole: "belairdirect Brand Strategist",
    colors: {
      primary: "#C8102E",
      background: "#F5F8FA",
      text: "#333333",
      accent: "#0F68D8",
    },
  },
};
