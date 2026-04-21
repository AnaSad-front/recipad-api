const mongoose = require("mongoose");
const slugify = require("slugify");
const UNITS = require("../utils/units");
const CATEGORIES = require("../utils/categories");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Recipe title is required"],
    maxlength: [
      50,
      "A recipe title must have less or equal than 50 characters",
    ],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Recipe description is required"],
    maxlength: [
      150,
      "A recipe description must have less or equal than 150 characters",
    ],
    trim: true,
  },
  slug: String,
  imageCover: {
    type: String,
    default: "defaultRecipe.png",
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: CATEGORIES,
  },
  ingredients: {
    type: [
      {
        name: {
          type: String,
          required: [true, "Ingredient name is required"],
          trim: true,
        },
        amount: {
          type: Number,
          required: [true, "Ingredient amount is required"],
          trim: true,
        },
        unit: {
          type: String,
          enum: UNITS,
          required: [true, "Ingredient unit is required"],
        },
      },
    ],
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "Recipe must have at least one ingredient",
    },
  },
  steps: {
    type: [
      {
        type: String,
        trim: true,
        minlength: [1, "Step cannot be empty"],
        maxlength: [600, "Step must be less than 600 characters"],
      },
    ],
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "Recipe must have at least one step",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Recipe must belong to a user"],
  },
});

recipeSchema.index({ title: 1, user: 1 }, { unique: true });

recipeSchema.pre("save", function () {
  this.slug = slugify(this.title, { lower: true });
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
