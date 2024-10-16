/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import dbConnect from "@/lib/db";
import { Stock } from "@/models/Stock";
import { checkDividendDate } from "@/utils/checkDividendDate";
import { getDividendInfo } from "@/utils/getDividendInfo";

export default async function addStockIfEligible(ticker: string) {
  try {
    await dbConnect();

    const symbol = ticker.toUpperCase();
    const period1 = "2019-05-10";

    //  Check if the stock already exists in the Stock collection
    const existingStock = await Stock.findOne({ symbol });
    if (existingStock) {
      console.log(`Stock ${symbol} already exists in the database. Skipping.`);
      return;
    }
    // getting the dividend from the yahoo finance2
    const dividendInfo = await getDividendInfo(symbol, period1);

    const dividends = dividendInfo.dividendInfo;

    if (!dividends) {
      console.log(`No dividend data found for ${symbol}.`);
      return;
    }
    // Calculate the time intervals between consecutive dividend dates
    const intervals = [];
    let div_frequency = "";
    for (let i = 1; i < dividends.length; i++) {
      const currentDate = new Date(dividends[i].date);
      const prevDate = new Date(dividends[i - 1].date);
      const interval = currentDate - prevDate;
      intervals.push(interval);
    }

    // Calculate the average time interval
    const averageInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

    // Define thresholds in milliseconds to differentiate between payment frequencies
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    const monthlyThreshold = 45 * dayInMilliseconds; // slightly over 1 month to account for variation
    const quarterlyThreshold = 4 * monthlyThreshold;
    const biAnnualThreshold = 8 * monthlyThreshold;

    // Check which interval the average belongs to
    if (averageInterval <= monthlyThreshold) {
      div_frequency = "M";
    } else if (averageInterval <= quarterlyThreshold) {
      div_frequency = "Q";
    } else if (averageInterval <= biAnnualThreshold) {
      div_frequency = "SA";
    } else {
      div_frequency = "Y";
    }

    // sorted from dividend info
    const sortedDivData = dividendInfo.dividendInfo.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    // console.log("sortedDivData", sortedDivData);
    const latestDivElement = sortedDivData[0];
    const latestDivElementMinusOne = sortedDivData[1];
    const latestDivElementMinusTwo = sortedDivData[2];

    // Check if the dividend date is valid (within the last 366 days)
    try {
      checkDividendDate(latestDivElement.date);
    } catch (err) {
      console.error(`Invalid dividend date for ${symbol}:`, err.message);
      return; // Skip this stock if the dividend date is invalid
    }

    // If any stock not exists save index_value by default 1

    // Create a new Stock
    const newStock = new Stock({
      symbol: ticker.toUpperCase(),
      index_value: 0,
      use_counter: 1,
      regularMarketPrice: dividendInfo.stockInfo.regularMarketPrice,
      dividendRate: dividendInfo.stockInfo.dividendRate,
      div_frequency,
      div_amount: latestDivElement.amount,
      cal_div_x_date: dividendInfo.stockInfo.exDividendDate,
      last_div_date: latestDivElement.date,
      cal_dividend_date: dividendInfo.stockInfo.dividendDate,
      last_div_date_minus_one: latestDivElementMinusOne.date,
      last_div_date_minus_two: latestDivElementMinusTwo.date,
    });

    // console.log("New Stock: " + newStock)

    await newStock.save();
    console.log(`Stock ${ticker.toUpperCase()} added successfully.`);
  } catch (error) {
    console.error(
      `Error processing stock ${ticker.toUpperCase()}:`,
      (error as Error).message
    );
  }
}
