const express = require("express");
const router = express.Router();
const {
  createExpense,
  getAllExpense,
  getExpense,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

// All routes protected
router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getAllExpense);
router.get("/:id", authMiddleware, getExpense);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
