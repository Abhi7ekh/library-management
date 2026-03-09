const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  },
  issue_date: Date,
  return_date: Date,
  status: {
    type: String,
    default: "issued"
  },
  fine: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);