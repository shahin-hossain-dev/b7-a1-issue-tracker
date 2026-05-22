import dotenv from "dotenv";
import path from "path";

// Load .env file from root
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.NODE_NNV || "development",
} as const;

export default config;
