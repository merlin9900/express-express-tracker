import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactions.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(rateLimiter);
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is up and running!",
  });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on PORT:", PORT);
  });
});
