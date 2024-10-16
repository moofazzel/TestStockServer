import dbConnect from "@/lib/db";
import { StockServerUser } from "@/models/user-model";

export async function getApiKey() {
  await dbConnect();

  return await StockServerUser.findOne({}).select("apiKey");
}
