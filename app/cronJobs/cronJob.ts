import cron from "node-cron";
import { runProcessWorkflow } from "./services/runWorkflow";

export async function startCronJob() {
  // Schedule the process workflow using node-cron to run every 15 seconds
  cron.schedule("*/15 * * * * *", async () => {
    await runProcessWorkflow();
  });
}
