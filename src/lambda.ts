import app from "./app";
import { initDb } from "./db/db";

await initDb();

export default app;