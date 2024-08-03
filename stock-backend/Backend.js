const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

// const ALPHA_VANTAGE_API_KEY = "660V4S5DMKOYKITD";
const ALPHA_VANTAGE_API_KEY = "demo";

function calculatePercentageChange(open, close) {
  return ((close - open) / open) * 100;
}


app.get("/stocks/all", async (req, res) => {
  const symbols = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA",
  "IBM",
  "META"]; 

  try {
    const promises = symbols.map((symbol) =>
      axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      })
    );

    const responses = await Promise.all(promises);

    const stocksData = responses
      .map((response, index) => {
        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
          console.error(`Missing Time Series data for symbol: ${symbols[index]}`);
          return null;
        }

        const dates = Object.keys(timeSeries);
        const latestDate = dates[0];
        const previousDate = dates[1];

        if (!latestDate || !previousDate) {
          console.error(`Missing date data for symbol: ${symbols[index]}`);
          return null;
        }

        const latestData = timeSeries[latestDate];
        const previousData = timeSeries[previousDate];

        const openPrice = parseFloat(previousData["1. open"]);
        const closePrice = parseFloat(latestData["4. close"]);

        const percentageChange = calculatePercentageChange(openPrice, closePrice);

        return {
          symbol: symbols[index],
          openPrice,
          closePrice,
          percentageChange,
        };
      })
      .filter((stock) => stock !== null);

    res.json({ stocks: stocksData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});


app.get("/stocks/gainers-losers", async (req, res) => {
  const symbols = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA","MS",
  "IBM",
  "FB",]; 

  try {
    const promises = symbols.map((symbol) =>
      axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      })
    );

    const responses = await Promise.all(promises);

    const stocksData = responses
      .map((response, index) => {
        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
          console.error(`Missing Time Series data for symbol: ${symbols[index]}`);
          return null;
        }

        const dates = Object.keys(timeSeries);
        const latestDate = dates[0];
        const previousDate = dates[1];

        if (!latestDate || !previousDate) {
          console.error(`Missing date data for symbol: ${symbols[index]}`);
          return null;
        }

        const latestData = timeSeries[latestDate];
        const previousData = timeSeries[previousDate];

        const openPrice = parseFloat(previousData["1. open"]);
        const closePrice = parseFloat(latestData["4. close"]);

        const percentageChange = calculatePercentageChange(openPrice, closePrice);

        return {
          symbol: symbols[index],
          openPrice,
          closePrice,
          percentageChange,
        };
      })
      .filter((stock) => stock !== null);

    const sortedStocks = stocksData.sort(
      (a, b) => b.percentageChange - a.percentageChange
    );

    const gainers = sortedStocks.slice(0, 3); 
    const losers = sortedStocks.slice(-3); 

    res.json({ gainers, losers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});


app.get("/stocks/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const timeSeriesResponse = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const globalQuoteResponse = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    console.log(`Time Series Daily for ${symbol}:`, timeSeriesResponse.data);
    console.log(`Global Quote for ${symbol}:`, globalQuoteResponse.data);

    res.json({
      timeSeriesDaily: timeSeriesResponse.data["Time Series (Daily)"],
      globalQuote: globalQuoteResponse.data["Global Quote"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
