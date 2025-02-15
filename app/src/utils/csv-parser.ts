import fs from "fs";
import path from "path";
import csv from "csv-parser";

export interface StaffMapping {
  staff_pass_id: string;
  team_name: string;
  created_at: number;
}

export const parseCSV = (filePath: string): Promise<StaffMapping[]> => {
  return new Promise((resolve, reject) => {
    const results: StaffMapping[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) =>
        results.push({
          staff_pass_id: data.staff_pass_id,
          team_name: data.team_name,
          created_at: Number(data.created_at),
        })
      )
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
