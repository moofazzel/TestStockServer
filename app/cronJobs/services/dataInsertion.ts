import dbConnect from "@/lib/db";
import { Stock } from "@/models/Stock";
import { UnfilteredStocks } from "@/models/UnfilteredStocks";
import pLimit from "p-limit";

export interface TickerData {
  cik_str: number;
  ticker: string;
  title: string;
}

export async function insertDataWithLimitedConcurrency(
  dataArray: TickerData[]
) {
  const BATCH_SIZE = 200;
  const CONCURRENCY_LIMIT = 2;
  const limit = pLimit(CONCURRENCY_LIMIT);

  const batchPromises = [];

  for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
    const batch = dataArray.slice(i, i + BATCH_SIZE);
    batchPromises.push(
      limit(() =>
        UnfilteredStocks.insertMany(batch, { ordered: false }).catch(
          (error) => {
            console.error("Error inserting batch:", error.message);
            return Promise.resolve(); // Continue with the next batch even if this one fails
          }
        )
      )
    );
  }

  const results = await Promise.allSettled(batchPromises);

  let successCount = 0;
  let failureCount = 0;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      successCount++;
    } else {
      failureCount++;
      console.error("Batch insertion error:", result.reason);
    }
  });

  return {
    success: failureCount === 0,
    message: `${successCount} batch(es) inserted successfully. ${failureCount} batch(es) failed.`,
  };
}

export async function fetchAndInsertDataToUnfilteredStocks() {
  try {
    await dbConnect();

    const response = await fetch(
      "https://www.sec.gov/files/company_tickers.json"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fetchedData: TickerData = await response.json();

    const dataArray = Object.values(fetchedData).map((item) => ({
      cik_str: item.cik_str,
      ticker: item.ticker,
      title: item.title,
    }));

    // Fetch all existing symbols from the Stock collection to prevent duplicates
    const existingStocks = await Stock.find({}, { symbol: 1 }).lean();
    const existingSymbols = new Set(
      existingStocks.map((stock) => stock.symbol)
    );

    // Filter the fetched data to include only those not in the Stock collection
    const filteredDataArray = dataArray.filter(
      (item) => !existingSymbols.has(item.ticker)
    );

    if (filteredDataArray.length === 0) {
      console.log("No new stocks to add to UnfilteredStocks.");
      return;
    }

    // Insert the filtered data with concurrency limits
    const result = await insertDataWithLimitedConcurrency(filteredDataArray);
    console.log(result);
  } catch (error) {
    console.error(
      "Error fetching or inserting data to UnfilteredStocks:",
      (error as Error).message
    );
  }
}
