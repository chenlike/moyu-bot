import logger from "@/common/logger";
import { initConfig } from "@/common/config";
import { initDatabase } from "@/common/database";
import { initWechat } from "./wechat"
import { initScheduler } from "./scheduler"
import { initWeb } from "@/web"
async function main() {
  initConfig();
  await initDatabase()
  initWechat()
  await initScheduler()
  initWeb()
}

try {
  main();
} catch (err) {
  logger.error(err);
}





