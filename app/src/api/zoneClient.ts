import type { Zone } from "@/types/zone";

export interface ZoneClient {
  list(): Promise<Zone[]>;
}
