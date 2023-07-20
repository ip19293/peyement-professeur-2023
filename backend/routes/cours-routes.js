const express = require("express");
const courController = require("../controller/cours-controller");
const authController = require("../auth/controller/auth-controller");
const CoursRouter = express.Router();
CoursRouter.route("/")
  .get(
    authController.protect,
    authController.restricTo("admin"),
    courController.getCours
  )
  .post(courController.addCours);
CoursRouter.route("/notpaid").get(
  authController.protect,
  authController.restricTo("admin"),
  courController.getNotPaidCours
);
CoursRouter.route("/total").get(courController.getCoursGroupByProf);
CoursRouter.route("/paid").get(courController.getPaidCours);
CoursRouter.route("/:id/cours").post(courController.getAllCoursProf);
CoursRouter.route("/:id")
  .delete(courController.deleteCours)
  .get(courController.getOneCours)
  .patch(courController.updateCours);

module.exports = CoursRouter;
