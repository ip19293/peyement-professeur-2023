const express = require("express");
const {
  getMatieres,
  addMatiere,
  deleteMatiere,
  updateMatiere,
  getMatiereStats,
  deleteAllMatieres,
  getMatiere,
  getMatieresProf,
} = require("../controller/matiere-controller");

const matiereRouter = express.Router();
matiereRouter
  .route("/")
  .get(getMatieres)
  .post(addMatiere)
  .delete(deleteAllMatieres);

matiereRouter
  .route("/:id")
  .delete(deleteMatiere)
  .patch(updateMatiere)
  .get(getMatiere);

matiereRouter.route("/:id/professeur").get(getMatieresProf);
matiereRouter.route("/stats").get(getMatiereStats);
module.exports = matiereRouter;
