const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Categorie = require("../models/categorie");
const matiereSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "matiere nom is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },
    categorie: {
      type: mongoose.Schema.ObjectId,
      ref: "Categorie",
      required: true,
    },
    taux: {
      type: Number,
      required: [true, "prix is required"],
      default: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Matiere", matiereSchema);
