import { app } from "./app";
import config from "./config/config";
import { initDb } from "./db/db";

export async function main() {
  initDb();

  console.log(config.connectionString);
  app.listen(config.port, () => {
    console.log(`DevPulse server is running port on ${config.port}`);
  });
}

main();
