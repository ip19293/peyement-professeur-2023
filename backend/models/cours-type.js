const mongoose = require("mongoose");
const coursTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "type is required"],
      enum: {
        values: ["CM", "TD", "TP"],
        message: "{VALUE} is not supported",
      },
    },
    coifficient: {
      type: Number,
      required: true,
      max: 1,
      min: 2 / 3,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("CoursType", coursTypeSchema);
