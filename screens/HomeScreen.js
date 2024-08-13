import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Switch } from "react-native";
import axios from "axios";
import { useTheme } from "../ThemeContext";

const ALPHA_VANTAGE_API_KEY = "LJTRZN7Q5GKIK2NH";

export default function HomeScreen({ navigation }) {

  //  toggle for theme (light/dark)
  const { isDarkMode, toggleTheme } = useTheme();

  // State for stock data and filtered view
  const [data, setData] = useState({ all: [], gainers: [], losers: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState("all");

  // Fetch stock data on component mount
  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      // List of stock symbols to fetch data 
      const symbols = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT", "AMD", "IBM", "META"];
    
      // Fetch data for each symbol from the API
      const promises = symbols.map((symbol) =>
        axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol: symbol,
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        })
      );

      const responses = await Promise.all(promises);
      const stocks = responses.map((response, index) => {
        console.log(`Response for ${symbols[index]}:`, response.data); // to Log the response

        // to Parse time series data
        const timeSeries = response.data["Time Series (Daily)"];

        // to Ensure there is sufficient data
        if (!timeSeries || Object.keys(timeSeries).length < 2) {
          throw new Error(`Insufficient data for symbol: ${symbols[index]}`);
        }

        // to Get latest and previous day's data of 
        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];
        const previousDate = Object.keys(timeSeries)[1];
        const previousData = timeSeries[previousDate];

        // to Calculate percentage change in each stock price
        const closePrice = parseFloat(latestData["4. close"]);
        const previousClosePrice = parseFloat(previousData["4. close"]);
        const percentageChange = ((closePrice - previousClosePrice) / previousClosePrice) * 100;

        return {
          symbol: symbols[index],
          closePrice,
          percentageChange,
        };
      });

      // Sort stocks into gainers and losers seperatly 
      const gainers = stocks.filter(stock => stock.percentageChange > 0).sort((a, b) => b.percentageChange - a.percentageChange);
      const losers = stocks.filter(stock => stock.percentageChange < 0).sort((a, b) => a.percentageChange - b.percentageChange);

      setData({ all: stocks, gainers, losers });
      setFilteredData(stocks);
    } catch (error) {


      // Handle errors from API requests
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config || 'No config available');
    }
  };

  // Toggle between different views (all, gainers, losers) 
  const toggleView = (selectedView) => {
    if (view === selectedView) {
      setView("all");
      setFilteredData(data.all);
    } else {
      setView(selectedView);
      setFilteredData(data[selectedView]);
    }
  };

  // Get image(logos) based on stock symbol
  const getImageSource = (symbol) => {
    switch (symbol) {
      case "AAPL":
        return require("../assets/apple.png");
      case "GOOGL":
        return require("../assets/google.png");
      case "TSLA":
        return require("../assets/tesla.png");
      case "AMZN":
        return require("../assets/shopping.png");
      case "MSFT":
        return require("../assets/microsoft.png");
      case "AMD":
        return require("../assets/amd.png");
      case "IBM":
        return require("../assets/ibm.png");
      case "META":
        return require("../assets/meta.png");
      default:
        return require("../assets/splash.png");
    }
  };



  // Get  stock's full name based on stock symbol using switch statement
  const getStockTitle = (symbol) => {
    switch (symbol) {
      case "AAPL":
        return "Apple Inc.";
      case "GOOGL":
        return "Alphabet Inc. (Google)";
      case "TSLA":
        return "Tesla, Inc.";
      case "AMZN":
        return "Amazon.com, Inc.";
      case "MSFT":
        return "Microsoft Corporation";
      case "AMD":
        return "Advanced Micro Devices, Inc.";
      case "IBM":
        return "IBM Corporation";
      case "META":
        return "Meta Platforms, Inc. (formerly Facebook)";
      default:
        return "Unknown Stock";
    }
  };

  // Render individual stock's details
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tile, isDarkMode && styles.tileDark]}
      onPress={() => navigation.navigate("Details", { symbol: item.symbol })}
    >
      <Image source={getImageSource(item.symbol)} style={styles.image} />
      <Text style={[styles.symbol, isDarkMode && styles.symbolDark]}>{item.symbol}</Text>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{getStockTitle(item.symbol)}</Text>
      <Text style={[styles.price, isDarkMode && styles.priceDark]}>
        ${item.closePrice.toFixed(2)}
      </Text>
      <Text style={item.percentageChange >= 0 ? styles.positiveChange : styles.negativeChange}>
        {item.percentageChange.toFixed(2)}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.switchContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Linking.openURL('https://groww.in/')}>
            <Image source={require('../assets/logo.png')} style={[styles.logo, isDarkMode && { tintColor: '#fff' }]} />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={[styles.label, isDarkMode && styles.textWhite]}>Light</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#fff' : '#00ebb4'}
            ios_backgroundColor="#3e3e3e"
            style={styles.switch}
          />
          <Text style={[styles.label, isDarkMode && styles.textWhite]}>Dark</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.buttonContainer, isDarkMode && styles.buttonContainerDark]}>
        <TouchableOpacity
          style={[styles.button, view === "gainers" && (isDarkMode ? styles.activeButtonDark : styles.activeButton)]}
          onPress={() => toggleView("gainers")}
        >
          <Text style={[styles.buttonText, isDarkMode && styles.textWhite]}>Top Gainers</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.button, view === "losers" && (isDarkMode ? styles.activeButtonDark : styles.activeButton)]}
          onPress={() => toggleView("losers")}
        >
          <Text style={[styles.buttonText, isDarkMode && styles.textWhite]}>Top Losers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 25,
  },
  listContent: {
    paddingBottom: 80,
  },
  row: {
    justifyContent: "space-between",
  },
  tile: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginVertical: 8,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
  tileDark: {
    backgroundColor: "#333",
  },
  symbol: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  symbolDark: {
    color: "#fff",
  },
  price: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  priceDark: {
    color: "#fff",
  },
  positiveChange: {
    marginTop: 5,
    fontSize: 14,
    color: "#4CAF50",
  },
  negativeChange: {
    marginTop: 5,
    fontSize: 14,
    color: "#F44336",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainerDark: {
    backgroundColor: "#000",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
  activeButtonDark: {
    backgroundColor: "#181818",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  textWhite: {
    color: "#fff",
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  titleDark: {
    color: "#ccc",
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  logo: {
    width: 160,
    height: 50,
    resizeMode: 'contain',
  },
  switchContainer: {
    alignItems: 'center',
    marginVertical: 15,
    flexDirection: 'row',
    marginLeft: 10,
    alignSelf: "center"
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginLeft: 60,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  switch: {
    marginHorizontal: 5,
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#d3d3d3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
