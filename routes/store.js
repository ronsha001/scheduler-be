import express from "express";
import {
  createStore,
  updateStore,
  deleteStore
} from "../controllers/store.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE STORE
router.post("/createStore", verifyToken, createStore);
// UPDATE STORE
router.put("/updateStore/:name", verifyToken, updateStore);
// DELETE STORE
router.delete("/deleteStore/:name", verifyToken, deleteStore);

export default router;