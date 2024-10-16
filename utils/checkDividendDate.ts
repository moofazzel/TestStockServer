/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export const checkDividendDate = (dividendDate): void => {
  // Convert the Unix timestamp (in seconds) to milliseconds for Date object
  const inputDate = new Date(dividendDate * 1000); // Convert to milliseconds
  const currentDate = new Date();

  // Format the date to 'Month Day Year'
  const year = inputDate.getUTCFullYear();
  const month = inputDate.toLocaleString("en-US", { month: "short" });
  const day = String(inputDate.getUTCDate()).padStart(2, "0");

  const formattedDate = `${month} ${day} ${year}`;

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = currentDate.getTime() - inputDate.getTime();

  // Calculate the number of days difference
  const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

  // Check if the dividend date was more than 366 days ago
  if (daysDifference > 366) {
    throw new Error(
      `Last dividend payout was ${formattedDate}, which is ${daysDifference} days ago. This company may not be paying out dividends.`
    );
  }
};
