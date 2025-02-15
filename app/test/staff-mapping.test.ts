import { lookupStaffPass, loadStaffMapping } from "../src/staff-mapping";
import { readCSV } from "../src/utils/csv-utils";
import { StaffMapping, StaffPassId } from "../src/types";

jest.mock("../src/utils/csv-utils", () => ({
  __esModule: true, // Ensure ES module compatibilityw
  readCSV: jest.fn(),
}));

describe("loadStaffMapping", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly load and transform staff mapping data", async () => {
    (readCSV as jest.Mock).mockResolvedValue([
      {
        staff_pass_id: "STAFF_123",
        team_name: "TEAM_A",
        created_at: "1623772799000",
      },
      {
        staff_pass_id: "STAFF_456",
        team_name: "TEAM_B",
        created_at: "1623772799001",
      },
    ]);

    const data = await loadStaffMapping();

    expect(data).toEqual([
      {
        staffPassId: "STAFF_123",
        teamName: "TEAM_A",
        createdAt: 1623772799000,
      },
      {
        staffPassId: "STAFF_456",
        teamName: "TEAM_B",
        createdAt: 1623772799001,
      },
    ]);
  });

  it("should return an empty array if CSV is empty", async () => {
    (readCSV as jest.Mock).mockResolvedValue([]);

    const data = await loadStaffMapping();
    expect(data).toEqual([]);
  });

  it("should throw an error if readCSV fails", async () => {
    (readCSV as jest.Mock).mockRejectedValue(new Error("Failed to read CSV"));

    await expect(loadStaffMapping()).rejects.toThrow("Failed to read CSV");
  });
});

describe("lookupStaffPass", () => {
  const mockStaffMapping: StaffMapping[] = [
    { staffPassId: "STAFF_123", teamName: "TEAM_A", createdAt: 1623772799000 },
    { staffPassId: "STAFF_456", teamName: "TEAM_B", createdAt: 1623772799001 },
  ];

  it("should return the correct team name for a valid staffPassId", () => {
    expect(lookupStaffPass("STAFF_123", mockStaffMapping)).toBe("TEAM_A");
    expect(lookupStaffPass("STAFF_456", mockStaffMapping)).toBe("TEAM_B");
  });

  it("should return null if staffPassId does not exist", () => {
    expect(lookupStaffPass("STAFF_999", mockStaffMapping)).toBeNull();
  });

  it("should return null if staffPassId is an empty string", () => {
    expect(lookupStaffPass("" as StaffPassId, mockStaffMapping)).toBeNull();
  });

  it("should return null if the mapping array is empty", () => {
    expect(lookupStaffPass("STAFF_123", [])).toBeNull();
  });
});
