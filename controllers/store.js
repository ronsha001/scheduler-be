
import { createError } from "../error.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Event from "../models/Event.js";


export const createStore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (!req.body.name || typeof req.body.name !== "string" || req.body.name.length < 2) {
      return next(createError(400, "Store name must be provided and contain at least 2 characters."))
    }
    if (!req.body.description || typeof req.body.description !== "string" || req.body.description.length < 30) {
      return next(createError(400, "Store description must be provided and contain at least 30 characters."))
    }
    const storeExist = await Store.findOne({name: req.body.name})
    if (storeExist) {
      return next(createError(400, "Store already exists"));
    }

    const newStore = new Store({name: req.body.name, desc: req.body.description, ownerId: req.user.id})
    await newStore.save()

    res.status(200).json("Created new store, name: " + req.body.name + ", User: " + req.user.id);
  } catch (err) {
    next(err);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const store = await Store.findOne({name: req.params.name})
    if (!store) {
      return next(createError(404, "Store not found."));
    }
    if (store.ownerId !== req.user.id) {
      return next(createError(403, "You are not allowed to update this store."))
    }

    if (req.body.name?.length >= 2) {
      store.name = req.body.name
    }
    if (req.body.description?.length >= 30) {
      store.desc = req.body.description
    }
    if (req.body.categories) {
      store.categories = req.body.categories
    }

    await store.save()

    res.status(200).json("Updated store: " + store);
  } catch (err) {
    next(err);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const store = await Store.findOne({name: req.params.name})
    if (!store) {
      return next(createError(404, "Store not found."));
    }
    if (store.ownerId !== req.user.id) {
      return next(createError(403, "You are not allowed to delete this store."))
    }

    await Event.deleteMany({storeId: store.id})

    await Store.deleteOne({_id: store._id})

    res.status(200).json("Deleted store: " + store);
  } catch (err) {
    next(err);
  }
};

