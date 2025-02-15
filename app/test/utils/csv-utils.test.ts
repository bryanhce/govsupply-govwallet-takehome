import mockFs from "mock-fs";
import { readCSV } from "../../src/utils/csv-utils";

describe("readCSV", () => {
  beforeEach(() => {
    mockFs({
      "test.csv":
        "staff_pass_id,team_name,created_at\nSTAFF_123,TEAM_A,1623772799000\nSTAFF_456,TEAM_B,1623772799001",
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should correctly parse a valid CSV file", async () => {
    const data = await readCSV("test.csv");

    expect(data).toEqual([
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
  });

  it("should return an empty array for an empty CSV file", async () => {
    mockFs({ "empty.csv": "" });

    const data = await readCSV("empty.csv");
    expect(data).toEqual([]);
  });

  it("should trim header keys", async () => {
    mockFs({
      "trimmed_headers.csv":
        " staff_pass_id , team_name , created_at \nSTAFF_789,TEAM_C,1623772799002",
    });

    const data = await readCSV("trimmed_headers.csv");

    expect(data).toEqual([
      {
        staff_pass_id: "STAFF_789",
        team_name: "TEAM_C",
        created_at: "1623772799002",
      },
    ]);
  });

  it("should handle CSV with missing values as empty string", async () => {
    mockFs({
      "missing_values.csv":
        "staff_pass_id,team_name,created_at\nSTAFF_999,,1623772799003",
    });

    const data = await readCSV("missing_values.csv");

    expect(data).toEqual([
      {
        staff_pass_id: "STAFF_999",
        team_name: "",
        created_at: "1623772799003",
      },
    ]);
  });
});
