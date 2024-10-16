import dbConnect from "@/lib/db";
import { UnfilteredStocks } from "@/models/UnfilteredStocks";
import addStockIfEligible from "./addStockIfEligible";
import { fetchAndInsertDataToUnfilteredStocks } from "./dataInsertion";

let isProcessing = false; // Flag for processing data to avoid overlap

// Process stocks from UnfilteredStocks every 15 seconds
export async function runProcessWorkflow() {
  try {
    // Ensure the connection is made to the correct database
    await dbConnect();

    // Prevent overlapping executions
    if (isProcessing) {
      console.log("Processing is already running. Skipping this execution.");
      return;
    }

    // Set isProcessing to true
    isProcessing = true;

    // Check for unprocessed stock
    let unfilterStock = await UnfilteredStocks.findOne();

    if (!unfilterStock) {
      console.log("No unprocessed stocks remaining in the collection.");

      // Fetch new data and add to UnfilteredStocks
      console.log("Starting new cycle: fetching new data...");
      await fetchAndInsertDataToUnfilteredStocks();
      console.log("New data added to UnfilteredStocks.");

      // After fetching new data, check if there are new stocks to process
      unfilterStock = await UnfilteredStocks.findOne();
      if (!unfilterStock) {
        console.log("No new stocks added after fetching. Exiting.");
        isProcessing = false;
        return; // Exit if there is still no stock
      }
    }

    // Process the stock by running addStockIfEligible
    try {
      await addStockIfEligible(unfilterStock.ticker);
      console.log(`Stock ${unfilterStock.ticker} processed successfully.`);

      // Delete the stock after successful processing
      await UnfilteredStocks.findByIdAndDelete(unfilterStock._id);
      console.log(`Stock ${unfilterStock.ticker} deleted from the collection.`);
    } catch (error) {
      console.error(
        `Error processing stock ${unfilterStock.ticker}:`,
        (error as Error).message
      );
    }
  } catch (error) {
    console.error("Error in processing workflow:", (error as Error).message);
  } finally {
    // Reset the isProcessing flag after completion
    isProcessing = false;
  }
}
