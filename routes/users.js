import express from "express";
import {
  getUser,
  getUserStores,
  deleteUser,
  update,
} from "../controllers/users.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// UPDATE USER
router.put("/:id", verifyToken, update);
// DELETE USER
router.delete("/:id", verifyToken, deleteUser);
// GET A USER
router.get("/find/:id", getUser);
// GET USER's STORES
router.get("/findStores/:id", getUserStores)

export default router;