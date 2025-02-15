import { StaffPassId } from "../types";

export const parseStaffPassId = (id: string): StaffPassId | null => {
  const trimmedId = id.trim();
  if (!trimmedId) {
    return null;
  }

  // Trim the input and check for emptiness,
  // so it's safe to assert this as StaffPassId
  return trimmedId as StaffPassId;
};
