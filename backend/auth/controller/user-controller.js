const APIFeatures = require("../../utils/apiFeatures");
const User = require("../models/user");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const filterOb = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
// 1) get All User
exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find().select("+active"), req.query);
  const users = await features.query;

  res.status(200).json({
    status: "success",

    users,
  });
});
// 2) delete All User
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all users is deleted",
  });
});
// 3) Create new User
exports.addUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  const user = await User.create(data);

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
// 4) Edit a User
exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    user: user,
  });
});
// 5) Remove a User
exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    message: "user ssucceffily delete",
  });
});
// 6) get User By ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this route not for password updates.please use /updateMypassword",
        400
      )
    );
  }
  // 2 filtered out unwanted fields names that are not allowed to be updated
  const filterBody = filterOb(req.body, "nom", "email", "photo");

  // 2 update user
  const user = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
