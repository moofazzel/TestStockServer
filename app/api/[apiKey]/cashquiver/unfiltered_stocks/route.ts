import dbConnect from "@/lib/db";
import { Stock } from "@/models/Stock";
import { UnfilteredStocks } from "@/models/UnfilteredStocks";
import { StockServerUser } from "@/models/user-model";
import { NextResponse } from "next/server";

// Define the handler for GET requests
export async function GET(
  request: Request,
  { params }: { params: { apiKey: string } }
) {
  await dbConnect();

  const { apiKey } = params;

  const user = await StockServerUser.findOne({ apiKey });

  if (!user) {
    return NextResponse.json({ message: "Invalid API key" });
  }

  const unfilteredStocks = await UnfilteredStocks.find({});

  const stocks = await Stock.find({});

  return NextResponse.json({
    currentlyTotalUnfilteredStocks: unfilteredStocks.length,
    currentlyTotalFilteredStocks: stocks.length,
    stocks,
    unfilteredStocks,
  });
}
