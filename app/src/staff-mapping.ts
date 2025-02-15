import path from "path";
import { StaffMapping, StaffPassId } from "./types";
import { readCSV } from "./utils/csv-utils";

const csvFileName = "staff-id-to-team-mapping.csv";
const STAFF_CSV_PATH = path.join(process.cwd(), "data", csvFileName);

const loadStaffMapping = async (): Promise<StaffMapping[]> => {
  const rawData = await readCSV(STAFF_CSV_PATH);

  // Assume no missing fields in csv
  return rawData.map((row) => ({
    // We trust the CSV as the source of truth for staff_pass_id,
    // so it's safe to assert it as StaffPassId
    staffPassId: row.staff_pass_id as StaffPassId,
    teamName: row.team_name,
    createdAt: Number(row.created_at),
  }));
};

const lookupStaffPass = (
  staffPassId: StaffPassId,
  mapping: StaffMapping[]
): string | null => {
  const staff = mapping.find((record) => record.staffPassId === staffPassId);
  return staff ? staff.teamName : null;
};

export { lookupStaffPass, loadStaffMapping };
