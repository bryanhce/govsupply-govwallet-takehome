import readlineSync from "readline-sync";
import { parseUserInput, getUserInput } from "./utils/input-utils";
import { StaffMapping, Redemption, StaffPassId } from "./types";
import {
  addRedemption,
  isEligibleForRedemption,
  loadRedemptionData,
} from "./redemption";
import { loadStaffMapping, lookupStaffPass } from "./staff-mapping";

const handleExitProgram = () => {
  console.log("🎅 Exiting the Redemption Counter. Happy Holidays!");
  process.exit(0);
};

const handleRedemption = (
  userInput: string,
  staffMappings: StaffMapping[],
  redemptions: Redemption[]
): Redemption[] => {
  // Trim the input and check for emptiness beforehand,
  // so it's safe to assert this as StaffPassId
  const staffPassId: StaffPassId = userInput as StaffPassId;

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
      `❌ Oops, your team ${teamName} has already redeemed their gifts. Goodbye!`
    );
  }
  return redemptions;
};

const runRedemptionCounter = async () => {
  console.log("⚙️ Starting Christmas Redemption Counter...");
  try {
    const staffMappings: StaffMapping[] = await loadStaffMapping();
    let redemptions: Redemption[] = loadRedemptionData();

    while (true) {
      console.log("\n🎄 Welcome to the Redemption Counter!");

      const rawUserInput = await getUserInput();
      const userInput = parseUserInput(rawUserInput);

      if (!userInput) {
        console.log(
          "❌ Staff Pass ID cannot be empty! Please enter a valid ID."
        );
        continue;
      }

      if (userInput.toLowerCase() === "exit") {
        handleExitProgram();
      }

      redemptions = handleRedemption(userInput, staffMappings, redemptions);
    }
  } catch (error: unknown) {
    console.error(
      "❌ An unexpected error occurred:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.log("🎅 Exiting the Redemption Counter due to an error.");
    process.exit(1);
  }
};

runRedemptionCounter();
