import { configDotenv } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, '../.env');

export function initConfig() {
  configDotenv({
    path: envPath
  });
}