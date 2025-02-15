import fs from "fs";
import csv from "csv-parser";

export const readCSV = (
  filePath: string
): Promise<Record<string, string>[]> => {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    fs.createReadStream(filePath)
      .pipe(
        csv({
          // Trim headers to remove extra whitespace
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
