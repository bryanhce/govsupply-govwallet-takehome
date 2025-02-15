import { StaffPassId } from "../types";

const parseStaffPassId = (id: string): StaffPassId => {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw new Error("Staff pass ID cannot be empty");
  }

  return trimmedId as StaffPassId;
};

export { parseStaffPassId };
