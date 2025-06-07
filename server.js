const express = require("express");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Coin list (manually added + top 50)
const coins = [
  "bitcoin", "ethereum", "bnb", "solana", "xrp", "cardano", "dogecoin", "avalanche", "tron", "polkadot",
  "toncoin", "shiba-inu", "chainlink", "near", "matic-network", "internet-computer", "litecoin", "uniswap", "stellar", "optimism",
  "injective", "vechain", "sui", "sei-network", "plume-network", "walchain", "arbitrum", "aptos", "algorand", "kaspa",
  "mina-protocol", "render-token", "gala", "axie-infinity", "the-graph", "chiliz", "curve-dao-token", "floki", "lido-dao", "theta-token",
  "blur", "zilliqa", "oasis-network", "pancakeswap-token", "decentraland", "iota", "enjincoin", "waves", "basic-attention-token", "frax-share"
];

// GET coins list
app.get("/coins", (req, res) => {
  res.json(coins);
});

// Coin price
app.get("/price/:coin", async (req, res) => {
  const coin = req.params.coin;
  try {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: { ids: coin, vs_currencies: "usd" },
    });
    res.json({ price: data[coin]?.usd || 0 });
  } catch {
    res.status(500).json({ error: "Price fetch failed" });
  }
});

// RSI (TAAPI.io Free Tier)
app.get("/rsi/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const exchange = "binance";
  const interval = "1h";
  const apiKey = process.env.TAAPI_KEY;

  try {
    const { data } = await axios.get("https://api.taapi.io/rsi", {
      params: {
        secret: apiKey,
        exchange,
        symbol: `${symbol}/USDT`,
        interval,
      },
    });
    res.json({ rsi: data.value });
  } catch {
    res.status(500).json({ error: "RSI fetch failed" });
  }
});

// Prediction (fake logic)
app.get("/signal/:coin", (req, res) => {
  const signals = ["BUY", "HOLD", "SELL"];
  const random = signals[Math.floor(Math.random() * signals.length)];
  res.json({ signal: random });
});

// Strategy text (example)
app.get("/strategy/:coin", (req, res) => {
  const strategies = {
    BUY: "Consider entering a position and monitor RSI closely.",
    SELL: "Signal indicates potential overbought levels, consider exiting.",
    HOLD: "Neutral zone detected. Wait for confirmation.",
  };
  const pick = Object.keys(strategies)[Math.floor(Math.random() * 3)];
  res.json({ strategy: strategies[pick] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
