import dotenv from "dotenv";
import path from "path";

// Load .env file from root
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET as string,
} as const;

export default config;
