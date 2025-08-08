import express from "express";
import { sql } from "../config/db.js";
import {
  createTransaction,
  deleteTransactionById,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransactionById);

router.post("/", createTransaction);

router.get("/summary/:userId", getSummaryByUserId);

export default router;
