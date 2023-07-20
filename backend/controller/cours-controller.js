const APIFeatures = require("../utils/apiFeatures");
const Cours = require("../models/cours");
const Professeur = require("../models/professeur");
const Matiere = require("../models/matiere");
const JSONCours = require("./json-response/cours-response");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const CoursReponse = require("./json-response/cours-response");
const TotalResponse = require("./json-response/total-response");
exports.getCours = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { cours: req.params.id };
  //EXECUTE QUERY
  const features = new APIFeatures(
    Cours.find(filter).populate([
      {
        path: "professeur",
      },
      {
        path: "matiere",
        populate: {
          path: "categorie",
        },
      },
    ]),

    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const cours = await features.query;
  const data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getOneCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.findById(id);
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",

    cours,
  });
});

exports.addCours = catchAsync(async (req, res, next) => {
  const data = req.body;
  const professeur = await Professeur.findById(req.body.professeur);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const cours = await Cours.create(data);
  res.status(201).json({
    status: "success",

    cours,
  });
});

exports.updateCours = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const professeur = await Professeur.findById(req.body.professeur);
  const matiere = await Matiere.findById(req.body.matiere);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  if (!matiere) {
    return next(new AppError("No matiere found with that ID", 404));
  }
  const cours = await Cours.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      cours: cours,
    },
  });
};

exports.deleteCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.findByIdAndDelete(id);
  if (!cours) {
    return next(new AppError("No cours found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "cours ssucceffily delete",
  });
});
exports.getNotPaidCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.aggregate([
    {
      $match: {
        isPaid: false,
      },
    },
    {
      $group: {
        _id: "professeur",
        nbH: { $sum: "$heures" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",

    count: cours.length,
    cours,
  });
});
exports.getPaidCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find().populate([
    {
      path: "professeur",
    },
    {
      path: "matiere",
    },
  ]);

  res.status(200).json({
    status: "success",
    cours,
  });
});

exports.getAllCoursProf = catchAsync(async (req, res, next) => {
  const data = req.body;
  const professeur = await Professeur.findById(req.params.id);
  if (!professeur) {
    return next(new AppError("No professeur found with that ID", 404));
  }
  /*  const cours1 = await Cours.aggregate([
    {
      $lookup: {
        from: "professeurs",
        localField: "professeur",
        foreignField: "_id",
        as: "professeur",
      },
    },
  ]); */
  //get All cours non paid ---------------------------------------------------------------------
  if (!req.body.debit && !req.body.fin) {
    const cours = await Cours.find({
      professeur: req.params.id,
      isPaid: false,
    }).populate([
      {
        path: "matiere",
        populate: {
          path: "categorie",
        },
      },
    ]);
    let data = coure_respone(cours);
    res.status(200).json({
      status: "success",
      data,
    });
  }
  //get All  cours non paid beetwen intervell temps---------------------------------------------------------------------
  const cours = await Cours.find({
    professeur: req.params.id,
    date: { $gte: req.body.debit, $lte: req.body.fin },

    isPaid: false,
  }).populate([
    {
      path: "matiere",
      populate: {
        path: "categorie",
      },
    },
  ]);
  data = coure_respone(cours);
  res.status(200).json({
    status: "success",
    data,
  });
});

//get total payement profs cours -------------------------------------------------
exports.getCoursGroupByProf = catchAsync(async (req, res, next) => {
  const profsseurs = await Professeur.find();
  let cours = await Cours.find().populate([
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

  //cours = coure_respone(cours);
  //cours = cours.countLL;
  let totalL = [];

  let idp = "";
  let id = "";
  profsseurs.forEach((elm) => {
    let somme = 0;
    let NBH = 0;
    let sommeT = 0;
    let NBHT = 0;
    idp = elm._id;

    let sm = 0;
    let nb = 0;
    cours.forEach((el) => {
      id = el.professeur._id;
      let prix = el.matiere.categorie.prix;
      el.types.forEach((e) => {
        if (e.name == "CM") {
          e.nbh = e.nbh;
        }
        if (e.name == "TD") {
          e.nbh = ((e.nbh * 2) / 3).toFixed(2);
        }
        if (e.name == "TP") {
          e.nbh = ((e.nbh * 2) / 3).toFixed(2);
        }
        nb = nb + e.nbh;
        sm = nb * prix;
      });

      if (elm.email == el.professeur.email) {
        sommeT = sm + sommeT;
        NBHT = nb + NBHT;
      } else {
        return;
      }
    });

    let elment = new TotalResponse(elm._id, elm.nom, sm, nb);
    totalL.push(elment);
  });

  res.status(200).json({
    status: "success",
    totalL,
    cours,
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
      elm.professeur._id,
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
