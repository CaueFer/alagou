import type { CivilDefenseNotice } from "@/types/civilDefense";

export interface CivilDefenseClient {
  listNotices(): Promise<CivilDefenseNotice[]>;
}
