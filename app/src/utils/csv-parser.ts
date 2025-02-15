import fs from "fs";
import csv from "csv-parser";
import { StaffMapping } from "../types";

// TODO perhaps want to decouple parsing of CSV with staffMapping
export const parseCSV = (filePath: string): Promise<StaffMapping[]> => {
  return new Promise((resolve, reject) => {
    const results: StaffMapping[] = [];
    fs.createReadStream(filePath)
      .pipe(
        csv({
          // remove extra whitespace or hidden characters in CSV header
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", (data) => {
        results.push({
          staff_pass_id: data.staff_pass_id,
          team_name: data.team_name,
          created_at: Number(data.created_at),
        });
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
