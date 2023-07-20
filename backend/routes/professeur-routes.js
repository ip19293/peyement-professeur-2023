const express = require("express");

const professeurController = require("../controller/professeur-controller");
const authController = require("../auth/controller/auth-controller");

const routerPro = express.Router();
routerPro
  .route("/")
  .get(
    authController.protect,
    authController.restricTo("admin"),
    professeurController.getProfesseurs
  )
  .post(professeurController.addProfesseur);
routerPro
  .route("/:email/email")
  .get(authController.protect, professeurController.getProfesseurEmail);

routerPro
  .route("/:id")
  .get(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.getProfesseurById
  )
  .delete(
    authController.protect,
    authController.restricTo("admin"),
    professeurController.deleteProfesseur
  )
  .post(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.addMatiereToProfesseus
  )
  .patch(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.updateProfesseur
  );

routerPro
  .route("/:id/cours")
  .get(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.getProfesseurCours
  )
  .post(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.addCoursToProf
  );
routerPro
  .route("/:id/matiere")
  .get(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.addMatiereToProfesseus
  );
routerPro
  .route("/:id/:idM")
  .delete(
    authController.protect,
    authController.restricTo("admin", "user"),
    professeurController.deleteOneMatProf
  );
module.exports = routerPro;
