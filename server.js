const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/signal", async (req, res) => {
  const coin = req.query.coin || "bitcoin";
  const mock = {
    entry_price: (Math.random() * 100).toFixed(2),
    take_profit: (Math.random() * 120).toFixed(2),
    stop_loss: (Math.random() * 80).toFixed(2),
    signal: Math.random() > 0.5 ? "BUY" : "SELL"
  };
  res.json(mock);
});

app.use(express.static("public"));

app.listen(port, () => console.log(`Server running on port ${port}`));
