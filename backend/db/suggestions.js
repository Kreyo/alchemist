const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuggestionsSchema = new Schema(
  {
    element: Number,
    text: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Suggestions", SuggestionsSchema);
