import mockFs from "mock-fs";
import fs from "fs";
import { Redemption, StaffPassId } from "../src/types";
import {
  addRedemption,
  isEligibleForRedemption,
  loadRedemptionData,
  addRedemptionToFile,
} from "../src/redemption";

jest.mock("../src/utils/date-utils", () => ({
  getCurrentEpoch: jest.fn(() => 1700000000000),
}));

const REDEMPTION_JSON_PATH = "data/redemption.json";

describe("Redemption Functions", () => {
  beforeEach(() => {
    mockFs({
      data: {
        "redemption.json": JSON.stringify([
          {
            teamName: "TEAM_A",
            redeemedAt: 1623772799000,
            redeemedBy: "STAFF_123",
          },
        ]),
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe("loadRedemptionData", () => {
    it("should correctly load redemption data from JSON file", () => {
      const data = loadRedemptionData();
      expect(data).toEqual([
        {
          teamName: "TEAM_A",
          redeemedAt: 1623772799000,
          redeemedBy: "STAFF_123",
        },
      ]);
    });

    it("should return an empty array if the file is empty", () => {
      mockFs({ "data/redemption.json": "" });

      const data = loadRedemptionData();
      expect(data).toEqual([]);
    });

    it("should throw an error if the file is missing", () => {
      mockFs({});

      expect(() => loadRedemptionData()).toThrow();
    });
  });

  describe("isEligibleForRedemption", () => {
    it("should return true if the team has not redeemed", () => {
      const data: Redemption[] = [
        {
          teamName: "TEAM_B",
          redeemedAt: 1623772799001,
          redeemedBy: "STAFF_456",
        },
      ];
      expect(isEligibleForRedemption("TEAM_C", data)).toBe(true);
    });

    it("should return false if the team has already redeemed", () => {
      const data: Redemption[] = [
        {
          teamName: "TEAM_A",
          redeemedAt: 1623772799000,
          redeemedBy: "STAFF_123",
        },
      ];
      expect(isEligibleForRedemption("TEAM_A", data)).toBe(false);
    });
  });

  describe("addRedemption", () => {
    it("should add a new redemption entry in memory when file is empty", () => {
      mockFs({ "data/redemption.json": "" });
      const staffPassId: StaffPassId = "STAFF_789";
      let redemptions: Redemption[] = loadRedemptionData();

      redemptions = addRedemption("TEAM_C", staffPassId, redemptions);

      expect(redemptions).toContainEqual({
        teamName: "TEAM_C",
        redeemedAt: 1700000000000,
        redeemedBy: staffPassId,
      });
    });

    it("should correctly append a new redemption in memory when file is not empty", () => {
      const staffPassId: StaffPassId = "STAFF_999";
      let redemptions = loadRedemptionData();

      redemptions = addRedemption("TEAM_B", staffPassId, redemptions);

      expect(redemptions).toHaveLength(2);
      expect(redemptions).toContainEqual({
        teamName: "TEAM_B",
        redeemedAt: 1700000000000,
        redeemedBy: staffPassId,
      });
    });
  });

  describe("addRedemptionToFile", () => {
    it("should create a new redemption file if it does not exist", () => {
      mockFs({ "data/redemption.json": "" }); // Empty file

      const newRedemption: Redemption = {
        teamName: "TEAM_X",
        redeemedAt: 1700000000000,
        redeemedBy: "STAFF_NEW",
      };

      addRedemptionToFile(newRedemption);

      const fileContent = JSON.parse(
        fs.readFileSync(REDEMPTION_JSON_PATH, "utf-8"),
      );
      expect(fileContent).toEqual([newRedemption]);
    });

    it("should append a new redemption entry to an existing file", () => {
      const newRedemption: Redemption = {
        teamName: "TEAM_Y",
        redeemedAt: 1700000000000,
        redeemedBy: "STAFF_Y",
      };

      addRedemptionToFile(newRedemption);

      const fileContent = JSON.parse(
        fs.readFileSync(REDEMPTION_JSON_PATH, "utf-8"),
      );
      expect(fileContent).toHaveLength(2);
      expect(fileContent).toContainEqual(newRedemption);
    });
  });
});
