import path from "path";
import fs from "fs";
import { Redemption } from "./types";
import { getCurrentEpoch } from "./utils/date-utils";

const REDEMPTION_JSON_PATH = path.join(
  process.cwd(),
  "data",
  "redemption.json"
);

const loadRedemptionData = (): Redemption[] => {
  const data = fs.readFileSync(REDEMPTION_JSON_PATH, "utf-8");
  return JSON.parse(data) as Redemption[];
};

const addRedemptionToFile = (newRedemption: Redemption): void => {
  const existingData = fs.readFileSync(REDEMPTION_JSON_PATH, "utf-8").trim();

  if (!existingData || existingData === "[]") {
    fs.writeFileSync(
      REDEMPTION_JSON_PATH,
      JSON.stringify([newRedemption], null, 2)
    );
  } else {
    fs.writeFileSync(
      REDEMPTION_JSON_PATH,
      // Remove the closing bracket, add new object, then close the array
      existingData.replace(
        /\]$/,
        `,\n  ${JSON.stringify(newRedemption, null, 2)}\n]`
      )
    );
  }
};

const isEligibleForRedemption = (
  teamName: string,
  redemptions: Redemption[]
): boolean => {
  return !redemptions.some((redemption) => redemption.team_name === teamName);
};

const addRedemption = (
  teamName: string,
  redemptions: Redemption[]
): Redemption[] => {
  const newRedemption: Redemption = {
    team_name: teamName,
    redeemed_at: getCurrentEpoch(),
    // TODO add a redeemed by
  };
  redemptions.push(newRedemption);
  addRedemptionToFile(newRedemption);
  return redemptions;
};

export { addRedemption };
export { isEligibleForRedemption };
export { loadRedemptionData };
