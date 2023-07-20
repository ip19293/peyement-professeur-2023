const APIFeatures = require("../utils/apiFeatures");
const Matiere = require("../models/matiere");
const Professeur = require("../models/professeur");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cours = require("../models/cours");
const CoursReponse = require("./json-response/cours-response");
exports.getProfesseurs = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { cours: req.params.id };
  const features = new APIFeatures(
    Professeur.find().populate([
      {
        path: "matieres",
        populate: { path: "categorie" },
      },
    ]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const professeurs = await features.query;
  res.status(200).json({
    status: "success",
    professeurs,
  });
});
exports.deleteAllProfesseurs = catchAsync(async (req, res, next) => {
  await Professeur.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all professeurs is deleted",
  });
});

exports.addProfesseur = catchAsync(async (req, res, next) => {
  const data = req.body;

  const Oldprofesseur_Nom = await Professeur.findOne({ nom: req.body.nom });
  const Oldprofesseur_Mobile = await Professeur.findOne({
    mobile: req.body.mobile,
  });
  const Oldprofesseur_Email = await Professeur.findOne({
    email: req.body.email,
  });
  const Oldprofesseur_Prenom = await Professeur.findOne({
    prenom: req.body.prenom,
  });
  if (Oldprofesseur_Prenom && Oldprofesseur_Nom && Oldprofesseur_Email) {
    return res.status(400).json({
      status: "fail",
      message: "the professeur name , prenom email existe before",
    });
  }
  let professeur = new Professeur({
    nom: req.body.nom,
    prenom: req.body.prenom,
    mobile: req.body.mobile,
    email: req.body.email,
    matieres: req.body.matieres,
  });
  professeur = await professeur.save();
  res.status(200).json({
    status: "success",
    data: {
      professeur,
    },
  });
});

exports.updateProfesseur = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const professeur = await Professeur.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    professeur: professeur,
  });
});

exports.deleteProfesseur = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const professeur = await Professeur.findByIdAndDelete(id);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "professeur ssucceffily delete",
  });
});
exports.getProfesseurCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find({ professeur: id }).populate([
    {
      path: "professeur",
    },
    {
      path: "matiere",
      populate: {
        path: "categorie",
      },
    },
  ]);
  const data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});
///Get Professeur By ID-----------------------------------------------------------------------------------------
exports.getProfesseurById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const professeur = await Professeur.findById(id).populate([
    {
      path: "matieres",
      populate: { path: "categorie" },
    },
  ]);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    professeur,
  });
});
///Get Professeur By Email-----------------------------------------------------------------------------------------

exports.getProfesseurEmail = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const professeur = await Professeur.findOne({
    email: email,
  }).populate([
    {
      path: "matieres",
      populate: { path: "categorie" },
    },
  ]);
  if (!professeur) {
    return next(new AppError("No professeur found with that EMAIL", 404));
  }
  res.status(200).json({
    status: "success",
    professeur,
  });
});
exports.addMatiereToProfesseus = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const professeur = await Professeur.updateMany(
    {
      _id: id,
    },
    {
      $addToSet: {
        matieres: req.body.matieres,
      },
    }
  );
  const matiere = await Matiere.findById(req.body.matiere);
  const matiere_prof = professeur.matieres;

  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    professeur,
    matiere,
  });
});

//Add One Matiere To Professeur     -----------------------------------------------------------------------------------------------------
exports.deleteOneMatProf = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const idM = req.params.idM;
  const Oldprofesseur = await Professeur.findById(id);
  if (!Oldprofesseur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  const professeur = await Professeur.updateMany(
    {
      _id: id,
    },
    {
      $pull: {
        matieres: idM,
      },
    }
  );

  res.status(200).json({
    status: "success",
    professeur,
  });
});
// Add Cours to Professeur--------------------------------------------------------------------------------------
exports.addCoursToProf = catchAsync(async (req, res, next) => {
  const data = req.body;
  const professeur = await Professeur.findById(req.params.id);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const cours = await Cours.create({
    professeur: req.params.id,
    matiere: req.body.matiere,
    type: req.body.type,
    heures: req.body.heures,
    date: req.body.date,
  });
  res.status(201).json({
    status: "success",

    cours,
  });
});
//----------------------------------------------------------------------------------------------
exports.getProfesseurStats = catchAsync(async (req, res, next) => {
  const stats = await Professeur.aggregate([
    {
      $match: { prixParHeur: { $gte: 2000 } },
    },
    {
      $group: {
        _id: "$categorie",
        numprofesseurs: { $sum: 1 },
        avgPrixParHeur: { $avg: "$prixParHeur" },
        minPrixParHeur: { $min: "$prixParHeur" },
        maxPrixParHeur: { $max: "$prixParHeur" },
      },
    },
  ]);
  if (!stats) {
    return next(new AppError("aggregate fail", 404));
  }
  res.status(200).json({
    status: "success",
    message: stats,
  });
});
//---------------FUNCTION----------------------------------------------------------

const coure_respone = (cours) => {
  let coursLL = [];
  let heuresTV = 0;
  let sommeTV = 0;
  cours.forEach((elm) => {
    let somme = 0;
    let prix = 0;
    let line = " ";
    let sm = 0;
    let CM = 0;
    let TD = 0;
    let TP = 0;
    let isSigne = 0;
    let isPaid = 0;
    prix = elm.matiere.categorie.prix;
    elm.types.forEach((elm) => {
      line = line + elm.name + " : " + elm.nbh + ", ";
      if (elm.name == "CM") {
        CM = elm.nbh;
        elm.nbh = elm.nbh;
      }
      if (elm.name == "TD") {
        TD = elm.nbh;
        elm.nbh = ((elm.nbh * 2) / 3).toFixed(2);
      }
      if (elm.name === "TP") {
        TP = elm.nbh;
        elm.nbh = ((elm.nbh * 2) / 3).toFixed(2);
      }

      sm = sm + elm.nbh;
      somme = sm * prix;
    });
    let cours = new CoursReponse(
      elm._id,
      elm.matiere.name,
      elm.professeur.nom + " " + elm.professeur.prenom,
      line,
      sm,
      elm.date,
      elm.debit,
      CM,
      TD,
      TP,
      somme,
      prix,
      elm.isSigne,
      elm.isPaid
    );
    coursLL.push(cours);
    sommeTV = sommeTV + somme;
    heuresTV = sm + heuresTV;
  });
  let data = {
    countLL: coursLL.length,
    heuresTV,
    sommeTV,
    coursLL,
  };
  return data;
};
