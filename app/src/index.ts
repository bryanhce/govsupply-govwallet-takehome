import readlineSync from "readline-sync";
import { parseStaffPassId } from "./utils/input-parser";
import { StaffMapping, Redemption, StaffPassId } from "./types";
import {
  addRedemption,
  isEligibleForRedemption,
  loadRedemptionData,
} from "./redemption";
import { loadStaffMapping, lookupStaffPass } from "./staff-mapping";

const handleExitProgram = () => {
  console.log("🎅 Exiting the Redemption Counter. Happy Holidays!");
  process.exit();
};

const handleRedemption = (
  staffPassId: StaffPassId,
  staffMappings: StaffMapping[],
  redemptions: Redemption[]
): Redemption[] => {
  console.log(`🔍 Checking staff pass ID: ${staffPassId}`);

  const teamName = lookupStaffPass(staffPassId, staffMappings);
  if (!teamName) {
    console.log("❌ Invalid staff pass ID. Please enter a valid ID.");
    return redemptions;
  }

  console.log(
    `✅ Verified! You will be collecting on behalf of Team ${teamName}`
  );

  console.log("🔍 Checking if your team is eligible for redemption...");

  if (isEligibleForRedemption(teamName, redemptions)) {
    redemptions = addRedemption(teamName, staffPassId, redemptions);
    console.log(
      `🎉 All is good! Your team ${teamName} can redeem your gifts! Merry Christmas!`
    );
  } else {
    console.log(
      `❌ Oops, your ream ${teamName} has already redeemed their gifts. Goodbye!`
    );
  }
  return redemptions;
};

const runRedemptionCounter = async () => {
  console.log("⚙️ Starting Christmas Redemption Counter...");
  const staffMappings: StaffMapping[] = await loadStaffMapping();
  let redemptions: Redemption[] = loadRedemptionData();

  while (true) {
    console.log("\n🎄 Welcome to the Redemption Counter!");

    const userInput = readlineSync.question(
      "👨‍💻 Please enter your Staff Pass ID (or type 'exit' to quit): "
    );

    if (userInput.toLowerCase().trim() === "exit") {
      handleExitProgram();
    }

    const staffPassId: StaffPassId = parseStaffPassId(userInput);
    redemptions = handleRedemption(staffPassId, staffMappings, redemptions);
  }
};

runRedemptionCounter();
// "STAFF_H123804820G"
