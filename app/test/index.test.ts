import {
  runRedemptionCounter,
  handleRedemption,
  stopRedemptionCounter,
} from "../src/index";
import { getUserInput } from "../src/utils/input-utils";
import { loadStaffMapping, lookupStaffPass } from "../src/staff-mapping";
import {
  addRedemption,
  isEligibleForRedemption,
  loadRedemptionData,
} from "../src/redemption";
import { StaffMapping, Redemption } from "../src/types";

jest.mock("../src/utils/input-utils", () => ({
  getUserInput: jest.fn(),
}));
jest.mock("../src/staff-mapping", () => ({
  loadStaffMapping: jest.fn(),
  lookupStaffPass: jest.fn(),
}));
jest.mock("../src/redemption", () => ({
  addRedemption: jest.fn(),
  isEligibleForRedemption: jest.fn(),
  loadRedemptionData: jest.fn(),
}));

describe("handleRedemption", () => {
  const mockStaffMappings: StaffMapping[] = [
    { staffPassId: "STAFF_123", teamName: "TEAM_A", createdAt: 1623772799000 },
  ];
  let mockRedemptions: Redemption[];

  beforeEach(() => {
    mockRedemptions = [
      {
        teamName: "TEAM_A",
        redeemedAt: 1623772799000,
        redeemedBy: "STAFF_001",
      },
    ];
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exited");
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    (process.exit as unknown as jest.Mock).mockRestore();
    stopRedemptionCounter();
  });

  it("should add redemption if team is eligible", () => {
    (lookupStaffPass as jest.Mock).mockReturnValue("TEAM_B");
    (isEligibleForRedemption as jest.Mock).mockReturnValue(true);
    (addRedemption as jest.Mock).mockReturnValue([
      ...mockRedemptions,
      {
        teamName: "TEAM_B",
        redeemedAt: 1700000000000,
        redeemedBy: "STAFF_999",
      },
    ]);

    const updatedRedemptions = handleRedemption(
      "STAFF_999",
      mockStaffMappings,
      mockRedemptions,
    );

    expect(updatedRedemptions).toHaveLength(2);
    expect(addRedemption).toHaveBeenCalledWith(
      "TEAM_B",
      "STAFF_999",
      mockRedemptions,
    );
  });

  it("should not add redemption if team is ineligible", () => {
    (lookupStaffPass as jest.Mock).mockReturnValue("TEAM_A");
    (isEligibleForRedemption as jest.Mock).mockReturnValue(false);

    const updatedRedemptions = handleRedemption(
      "STAFF_123",
      mockStaffMappings,
      mockRedemptions,
    );

    expect(updatedRedemptions).toHaveLength(1);
    expect(addRedemption).not.toHaveBeenCalled();
  });

  it("should return the same redemption array if staff pass is invalid", () => {
    (lookupStaffPass as jest.Mock).mockReturnValue(null);

    const updatedRedemptions = handleRedemption(
      "INVALID_PASS",
      mockStaffMappings,
      mockRedemptions,
    );

    expect(updatedRedemptions).toHaveLength(1);
    expect(addRedemption).not.toHaveBeenCalled();
  });
});
