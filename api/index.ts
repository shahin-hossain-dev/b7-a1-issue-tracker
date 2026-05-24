import app from "../src/app";
import { initDb } from "../src/db/db";

await initDb();

export default app;
