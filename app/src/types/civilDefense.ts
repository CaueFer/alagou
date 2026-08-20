export type RiskLevel = "ATTENTION" | "ALERT" | "EMERGENCY";

export interface CivilDefenseNotice {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  link: string;
  riskLevel: RiskLevel;
  publishedAt: string;
  thumbnailUrl: string | null;
}
