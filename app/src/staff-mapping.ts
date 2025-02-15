import path from "path";
import { StaffMapping, StaffPassId } from "./types";
import { parseCSV } from "./utils/csv-parser";

const csvFileName = "staff-id-to-team-mapping.csv";
const STAFF_CSV_PATH = path.join(process.cwd(), "data", csvFileName);

const loadStaffMapping = async (): Promise<StaffMapping[]> => {
  return await parseCSV(STAFF_CSV_PATH);
};

const lookupStaffPass = (
  staffPassId: StaffPassId,
  mapping: StaffMapping[]
): string | null => {
  const staff = mapping.find((record) => record.staffPassId === staffPassId);
  return staff ? staff.teamName : null;
};

export { lookupStaffPass, loadStaffMapping };
