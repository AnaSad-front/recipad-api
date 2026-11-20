const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadImage");

const router = express.Router();

// Protect all routes after this middleware to logged in users only
router.use(authController.protect);

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(upload.single("imageCover"), recipeController.createRecipe);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

module.exports = router;
