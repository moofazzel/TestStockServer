/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import yahooFinance from "yahoo-finance2";

export const getDividendInfo = async (stock, period1) => {
  const queryOptions = { period1 };

  const results = await yahooFinance.quote(stock);

  const exDividendResults = await yahooFinance.quoteSummary(`${stock}`, {
    modules: ["calendarEvents"],
  });

  if (!results) {
    throw new Error("Stock ticker does not exist");
  }

  const symbol = results.symbol;
  const displayName = results.displayName;

  const dividendResults = await yahooFinance._chart(stock, queryOptions);

  const stockInfo = {
    regularMarketPrice: results.regularMarketPrice,
    dividendRate: results.dividendRate,
    dividendDate: exDividendResults.calendarEvents.dividendDate,
    exDividendDate: exDividendResults.calendarEvents.exDividendDate,
  };

  const dividendInfo = dividendResults?.events?.dividends;

  const result = { displayName, symbol, stockInfo, dividendInfo };
  return result;
};
