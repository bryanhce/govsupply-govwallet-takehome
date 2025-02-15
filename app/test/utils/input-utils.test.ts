import prompts from "prompts";
import { parseUserInput, getUserInput } from "../../src/utils/input-utils";

describe("parseUserInput", () => {
  it("should trim whitespace and return valid input", () => {
    expect(parseUserInput("  STAFF_123  ")).toBe("STAFF_123");
  });

  it("should return null for empty input", () => {
    expect(parseUserInput("")).toBeNull();
    expect(parseUserInput("   ")).toBeNull();
  });

  it("should return same input if no whitespace to trim", () => {
    expect(parseUserInput("no-leading-trailing-whitespace")).toBe(
      "no-leading-trailing-whitespace",
    );
  });
});

jest.mock("prompts", () => ({
  __esModule: true, // Ensure ES module compatibility
  default: jest.fn(),
}));
const mockedPrompts = prompts as jest.MockedFunction<typeof prompts>;

describe("getUserInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user input from prompts", async () => {
    mockedPrompts.mockResolvedValue({ userInput: "STAFF_123" });

    const result = await getUserInput();
    expect(result).toBe("STAFF_123");
  });

  it("should handle empty input and return null", async () => {
    mockedPrompts.mockResolvedValue({ userInput: "" });

    const result = await getUserInput();
    expect(result).toBeNull();
  });

  it("should handle user canceling input and return null", async () => {
    mockedPrompts.mockResolvedValue({});
    const result = await getUserInput();
    expect(result).toBeNull();
  });
});
