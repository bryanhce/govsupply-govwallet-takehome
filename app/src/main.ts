import fs from "fs";
import path from "path";
import { parseCSV, StaffMapping } from "./utils/csv-parser";
import { getCurrentEpoch } from "./utils/date-utils";

interface Redemption {
  team_name: string;
  redeemed_at: number;
}

const csvFileName = "staff-id-to-team-mapping.csv";
const redemptionFileName = "redemption.json";
const dataFolderPath = "data";

const STAFF_CSV_PATH = path.join(__dirname, dataFolderPath, csvFileName);
const REDEMPTION_JSON_PATH = path.join(
  __dirname,
  dataFolderPath,
  redemptionFileName
);

const loadRedemptionData = (): Redemption[] => {
  const data = fs.readFileSync(REDEMPTION_JSON_PATH, "utf-8");
  return JSON.parse(data) as Redemption[];
};

// Save Redemption Data
const saveRedemptionData = (data: Redemption[]) => {
  fs.writeFileSync(REDEMPTION_JSON_PATH, JSON.stringify(data, null, 2));
};

// 1. Lookup Staff Pass ID
const lookupStaffPass = async (staffPassId: string): Promise<string | null> => {
  const staffMappings: StaffMapping[] = await parseCSV(STAFF_CSV_PATH);
  const staff = staffMappings.find(
    (record) => record.staff_pass_id === staffPassId
  );
  return staff ? staff.team_name : null;
};

// 2. Check Redemption Eligibility
const isEligibleForRedemption = (teamName: string): boolean => {
  const redemptions = loadRedemptionData();
  return !redemptions.some((redemption) => redemption.team_name === teamName);
};

// 3. Add New Redemption
const addRedemption = (teamName: string): void => {
  const redemptions = loadRedemptionData();
  redemptions.push({
    team_name: teamName,
    redeemed_at: getCurrentEpoch(),
  });
  saveRedemptionData(redemptions);
  console.log(`🎉 Team ${teamName} has successfully redeemed their gift!`);
};

// Main Function
const redeemGift = async (staffPassId: string) => {
  console.log(`🔍 Checking staff pass ID: ${staffPassId}`);
  const teamName = await lookupStaffPass(staffPassId);

  if (!teamName) {
    console.log("❌ Invalid staff pass ID.");
    return;
  }

  console.log(`✅ Verified! Team: ${teamName}`);

  if (isEligibleForRedemption(teamName)) {
    addRedemption(teamName);
  } else {
    console.log(`❌ Sorry, Team ${teamName} has already redeemed their gift.`);
  }
};

// Test with an example staff pass ID
redeemGift("STAFF_H123804820G");
