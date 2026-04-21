/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, filterFn = () => ({})) =>
  catchAsync(async (req, res, next) => {
    const filter = filterFn(req);
    const features = new APIFeatures(Model.find(filter), req.cleanQuery)
      .filter()
      .search()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, filterFn = () => ({})) =>
  catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id, ...filterFn(req) };
    const doc = await Model.findOne(filter);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model, filterFn = () => ({})) =>
  catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id, ...filterFn(req) };
    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model, filterFn = () => ({})) =>
  catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id, ...filterFn(req) };
    const doc = await Model.findOneAndDelete(filter);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
