const APIFeatures = require("../utils/apiFeatures");
const Type = require("../models/cours-type");
const Cours = require("../models/cours");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterOb = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  c;
  return newObj;
};
// 1) get All type
exports.getTypes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Type.find(), req.query);
  const types = await features.query;

  res.status(200).json({
    status: "success",
    types,
  });
});
// 2) delete All type
exports.deleteAllTypes = catchAsync(async (req, res, next) => {
  await Type.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all types is deleted",
  });
});
// 3) Create new type
exports.addType = catchAsync(async (req, res, next) => {
  const data = req.body;
  const Oldtype = await Type.findOne({ name: req.body.name });
  if (Oldtype) {
    return res.status(400).json({
      status: "fail",
      message: "the type name existe before",
    });
  }
  const type = await Type.create(data);

  res.status(200).json({
    status: "success",
    type,
  });
});
// 4) Edit a type
exports.updateType = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const type = await Type.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    return next(new AppError("No type found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    type,
  });
});
// 5) Remove a type
exports.deleteType = catchAsync(async (req, res, next) => {
  firstMessage = "";
  const id = req.params.id;
  const all = req.body.all;
  if (all === true) {
    const matieres = await Cours.find({ type: id }).deleteMany();
    firstMessage = "with All cours";
  }

  const type = await Type.findByIdAndDelete(id);
  if (!type) {
    return next(new AppError("No type found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "type ssucceffily delete" + firstMessage,
    type,
  });
});
// 6) get type By ID
exports.getTypeById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const type = await Type.findById(id);
  if (!type) {
    return next(new AppError("No type found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    type,
  });
});
//Get type matieres
exports.getTypeCours = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cours = await Cours.find({
    type: id,
  });

  res.status(200).json({
    status: "success",
    cours,
  });
});
