import { model, models, Schema } from "mongoose";

const unfilteredStocksSchema = new Schema({
  cik_str: {
    type: Number,
    required: true,
    unique: true,
  },
  ticker: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export const UnfilteredStocks =
  models.UnfilteredStocks ?? model("UnfilteredStocks", unfilteredStocksSchema);
