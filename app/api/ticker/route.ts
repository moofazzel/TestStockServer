import { NextResponse } from "next/server";

export interface TickerData {
  cik_str: number;
  ticker: string;
  title: string;
}

export async function GET() {
  const response = await fetch(
    "https://www.sec.gov/files/company_tickers.json"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const fetchedData: TickerData = await response.json();

  // Fetch all existing symbols from the Stock collection to prevent duplicates

  const dataArray = Object.values(fetchedData).map((item) => ({
    cik_str: item.cik_str,
    ticker: item.ticker,
    title: item.title,
  }));

  return NextResponse.json(dataArray);
}
