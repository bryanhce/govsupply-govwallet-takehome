type StaffPassId = string;

interface StaffMapping {
  staffPassId: StaffPassId;
  teamName: string;
  createdAt: number;
}

export { StaffPassId, StaffMapping };
