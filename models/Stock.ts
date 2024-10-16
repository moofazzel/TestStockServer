import { model, models, Schema } from "mongoose";

const stockSchema = new Schema({
  symbol: {
    type: String,
  },
  index_value: {
    type: Number,
    default: 0,
  },
  use_counter: {
    type: Number,
    default: 0,
  },
  regularMarketPrice: {
    type: Number,
  },
  dividendRate: {
    type: Number,
  },
  div_frequency: {
    type: String, //option are monthly, quarterly, semi-annual, annual
  },
  last_div_date: {
    type: String,
  },
  last_div_date_minus_one: {
    type: String,
  },
  last_div_date_minus_two: {
    type: String,
  },
  div_amount: {
    type: Number,
  },
  cal_dividend_date: {
    type: Date,
  },
  cal_div_x_date: {
    type: Date,
  },
});

export const Stock = models.Stock ?? model("Stock", stockSchema);
