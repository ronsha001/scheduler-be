import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  myEvents,
  storeEvents
} from "../controllers/event.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE EVENT
router.post("/createEvent/:storeName", verifyToken, createEvent);
// UPDATE EVENT
router.put("/updateEvent/:eventId", verifyToken, updateEvent);
// DELETE EVENT
router.delete("/deleteEvent/:eventId", verifyToken, deleteEvent);
// GET MY EVENTS
router.get("/myEvents", verifyToken, myEvents);
// GET STORE EVENTS
router.get("/storeEvents/:storeName", storeEvents);

export default router;
