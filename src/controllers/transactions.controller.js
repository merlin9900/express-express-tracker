import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const trasactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return res.status(200).json({
      data: trasactions,
    });
  } catch (error) {
    console.log("Error getting the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(400).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
      `;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
          `;

    const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
          `;

    return res.status(200).json({
      balance: balanceResult[0].balance,
      expenses: expensesResult[0].expenses,
      income: incomeResult[0].income,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
