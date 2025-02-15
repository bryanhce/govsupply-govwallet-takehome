import path from "path";
import { StaffMapping } from "./types";
import { parseCSV } from "./utils/csv-parser";

const csvFileName = "staff-id-to-team-mapping.csv";
const STAFF_CSV_PATH = path.join(process.cwd(), "data", csvFileName);

const loadStaffMapping = async (): Promise<StaffMapping[]> => {
  return await parseCSV(STAFF_CSV_PATH);
};

const lookupStaffPass = (
  staffPassId: string,
  mapping: StaffMapping[]
): string | null => {
  const staff = mapping.find((record) => record.staff_pass_id === staffPassId);
  return staff ? staff.team_name : null;
};

// TODO check the export style, is this ok
export { lookupStaffPass };
export { loadStaffMapping };
