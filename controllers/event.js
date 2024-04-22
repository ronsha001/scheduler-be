import { createError } from "../error.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Event from "../models/Event.js";

export const createEvent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found."));
    }
    const store = await Store.findOne({name: req.params.storeName})
    if (!store) {
      return next(createError(404, "Store not found."));
    }
    // Check Category 
    if (!req.body.category || typeof req.body.category !== "string" || req.body.category?.length <= 0) {
      return next(createError(400, "Category name must be provided."))
    }
    var categoryExist = false
    var categoryTime = 0 
    for (var i = 0; i < store.categories?.length; i++) {
      if (req.body.category === store.categories[i].name) {
        categoryTime = store.categories[i].time
        categoryExist = true
        break
      }
    }
    if (!categoryExist) {
      return next(createError(404, "Category not found."));
    }
    // Check time
    if (!req.body.time?.start || typeof req.body.time?.start !== "string" || isNaN(new Date(req.body.time?.start))) {
      return next(createError(400, "Start time must be provided and be valid."))
    }
    if (!req.body.time?.end || typeof req.body.time?.end !== "string" || isNaN(new Date(req.body.time?.end))) {
      return next(createError(400, "End time must be provided and be valid."))
    }
    const start = new Date(req.body.time.start)
    const end = new Date(req.body.time.end)
    const timeDifferenceMS = end - start
    const timeDifferenceMins = Math.floor(timeDifferenceMS / 60000);
    
    if (timeDifferenceMins !== categoryTime) {
      return next(createError(400, "Event time must be match to category time."))
    }

    const newEvent = new Event({
      storeId: store.id,
      customerId: user.id,
      customerName: user.name,
      category: req.body.category,
      time: {
        start: start,
        end: end
      }
    })

    await newEvent.save()

    res.status(200).json("Created new event: " + newEvent);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const event = await Event.findOne({_id: req.params.eventId})
    if (!event) {
      return next(createError(404, "Event not found."));
    }
    if (event.customerId !== req.user.id) {
      return next(createError(403, "You are not allowed to update this event."))
    }

    // Check Category 
    const store = await Store.findOne({_id: event.storeId})
    if (!req.body.category || typeof req.body.category !== "string" || req.body.category?.length <= 0) {
      return next(createError(400, "Category name must be provided."))
    }
    var categoryExist = false
    var categoryTime = 0 
    for (var i = 0; i < store.categories?.length; i++) {
      if (req.body.category === store.categories[i].name) {
        categoryTime = store.categories[i].time
        categoryExist = true
        break
      }
    }
    if (!categoryExist) {
      return next(createError(404, "Category not found."));
    }

    // Check time
    if (!req.body.time?.start || typeof req.body.time?.start !== "string" || isNaN(new Date(req.body.time?.start))) {
      return next(createError(400, "Start time must be provided and be valid."))
    }
    if (!req.body.time?.end || typeof req.body.time?.end !== "string" || isNaN(new Date(req.body.time?.end))) {
      return next(createError(400, "End time must be provided and be valid."))
    }
    const start = new Date(req.body.time.start)
    const end = new Date(req.body.time.end)
    const timeDifferenceMS = end - start
    const timeDifferenceMins = Math.floor(timeDifferenceMS / 60000);
    
    if (timeDifferenceMins !== categoryTime) {
      return next(createError(400, "Event time must be match to category time."))
    }

    event.category = req.body.category,
    event.time = {
      start: start,
      end: end
    }

    await event.save()

    res.status(200).json("Updated event: " + event);
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const event = await Event.findOne({_id: req.params.eventId})
    if (!event) {
      return next(createError(404, "Event not found."));
    }
    if (event.customerId !== req.user.id) {
      return next(createError(403, "You are not allowed to delete this event."))
    }

    await event.delete();

    res.status(200).json("Deleted event: " + event);
  } catch (err) {
    next(err);
  }
}

export const myEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const events = await Event.find({customerId: req.user.id})

    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

export const storeEvents = async (req, res, next) => {
  try {
    const store = await Store.findOne({name: req.params.storeName});
    if (!store) {
      return next(createError(404, "Store not found"));
    }

    const events = await Event.find({storeId: store.id}).select({_id: 0, customerName: 1, 'time.start': 1, 'time.end': 1})

    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}