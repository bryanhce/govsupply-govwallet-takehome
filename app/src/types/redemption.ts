import { StaffPassId } from "./staff-mapping";
export interface Redemption {
  teamName: string;
  redeemedAt: number;
  redeemedBy: StaffPassId;
}
