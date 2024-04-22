
import { createError } from "../error.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Event from "../models/Event.js";

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserStores = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const stores = await Store.find({ownerId: req.params.id})

    res.status(200).json(stores)
  } catch (err) {
    next(err);
  }
}

export const update = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const imgUrl = req.body.imgUrl;
  const userId = req.params.id;
  console.log(req.body)
  if (!userId) {
    const error = new Error();
    error.status = 404;
    error.message = "User id not found.";
    throw error;
  }
  try {
    const user = await User.findById(userId);
    if (userId !== req.user.id) {
      return next(createError(403, "You're not allowed to update this user."))
    }
    if (!user) {
      const error = new Error();
      error.status = 404;
      error.message = "User not found.";
      throw error;
    }
    if (name?.length > 0) {
      user.name = name;
      await Event.updateMany({customerId: user.id }, {customerName: name})
    }
    if (email?.length > 0) {
      user.email = email;
    }
    if (imgUrl?.length > 0) {
      user.img = imgUrl;
    }
    const updatedUser = await user.save();
    const { password, ...updatedUserWithoutPW} = updatedUser._doc

    return res
      .status(200)
      .json(updatedUserWithoutPW);
  } catch (err) {
    next(err);
  }
};
