const Recipe = require("../models/recipeModel");
const factory = require("./handlerFactory");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../utils/cloudinary");

const filterFn = (req) => ({ user: req.user.id });

exports.createRecipe = factory.createOne(Recipe, {
  beforeCreate: async (req) => {
    if (!req.file) return;

    const image = await uploadToCloudinary(req.file.buffer);

    req.body.imageCover = image;

    return image;
  },
  cleanup: async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
  },
});
exports.getRecipe = factory.getOne(Recipe, filterFn);
exports.getAllRecipes = factory.getAll(Recipe, filterFn);
exports.updateRecipe = factory.updateOne(Recipe, filterFn);
exports.deleteRecipe = factory.deleteOne(Recipe, filterFn);
