import { getCurrentEpoch } from "../../src/utils/date-utils";

describe("getCurrentEpoch", () => {
  it("should return a timestamp close to the current time", () => {
    const before = Date.now();
    const epoch = getCurrentEpoch();
    const after = Date.now();

    expect(epoch).toBeGreaterThanOrEqual(before);
    expect(epoch).toBeLessThanOrEqual(after);
  });
});
