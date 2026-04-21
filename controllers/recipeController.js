const Recipe = require("../models/recipeModel");
const factory = require("./handlerFactory");

const filterFn = (req) => ({ user: req.user.id });

exports.createRecipe = factory.createOne(Recipe);
exports.getRecipe = factory.getOne(Recipe, filterFn);
exports.getAllRecipes = factory.getAll(Recipe, filterFn);
exports.updateRecipe = factory.updateOne(Recipe, filterFn);
exports.deleteRecipe = factory.deleteOne(Recipe, filterFn);
