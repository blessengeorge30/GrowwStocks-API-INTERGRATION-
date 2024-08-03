import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Switch } from "react-native";
import axios from "axios";
import { useTheme } from "../ThemeContext";

const cache = {}; // In-memory cache

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [data, setData] = useState({ all: [], gainers: [], losers: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState("all");

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = () => {
    const cacheKey = "gainers-losers";

    // Check if data is already in cache
    if (cache[cacheKey]) {
      const cachedData = cache[cacheKey];
      setData(cachedData);
      setFilteredData([...cachedData.gainers, ...cachedData.losers]);
      return;
    }

    // Fetch data from API
    axios
      .get("http://192.168.1.72:5001/stocks/gainers-losers")
      .then((response) => {
        const newData = {
          all: [...response.data.gainers, ...response.data.losers],
          gainers: response.data.gainers,
          losers: response.data.losers,
        };

        // Store response in cache
        cache[cacheKey] = newData;

        setData(newData);
        setFilteredData([...response.data.gainers, ...response.data.losers]);
      })
      .catch((error) => console.error(error));
  };

  const toggleView = (selectedView) => {
    if (view === selectedView) {
      setView("all");
      setFilteredData(data.all);
    } else {
      setView(selectedView);
      setFilteredData(data[selectedView]);
    }
  };

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
      // Add more cases as needed
    }
  };

  const getStockTitle = (symbol) => {
    switch (symbol) {
      case "AAPL":
        return "Apple Inc.";
      case "GOOGL":
        return "Alphabet Inc.";
      case "TSLA":
        return "Tesla, Inc.";
      case "AMZN":
        return "Amazon.com, Inc.";
      case "MSFT":
        return "Microsoft Corporation";
      case "AMD":
        return "Advanced Micro Devices, Inc.";
      // Add more cases as needed
      default:
        return "Unknown Stock"; // Fallback title if the symbol isn't matched
    }
  };

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
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Track color
            thumbColor={isDarkMode ? '#fff' : '#00ebb4'} // Thumb color
            ios_backgroundColor="#3e3e3e" // iOS background color
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
    backgroundColor: "#000", // Black background for dark mode
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content horizontally
    paddingVertical: 10,
    marginTop: 35,
  },
  headerDark: {
    backgroundColor: "#000", // Dark background for header in dark mode
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
    backgroundColor: "#333", // Dark background for tiles in dark mode
  },
  symbol: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  symbolDark: {
    color: "#fff", // White text for symbol in dark mode
  },
  price: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  priceDark: {
    color: "#fff", // White text for price in dark mode
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
    backgroundColor: "#000", // Black background for button container in dark mode
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
  buttonTextDark: {
    color: "#fff",
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    color: "#666", // Default color
    textAlign: "center",
    marginBottom: 5,
  },
  titleDark: {
    color: "#ccc", // Lighter color for dark mode
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
    marginTop: 35, // Added marginTop
    flexDirection: 'row',
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerDark: {
    backgroundColor: '#333', // Example dark mode background color
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 60
  },
  label: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  textWhite: {
    color: '#fff',
  },
  switch: {
    marginHorizontal: 5,
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }], // Slightly increase size
    borderRadius: 24, // Make the border radius larger for more rounded appearance
    borderWidth: 2,
    borderColor: '#d3d3d3', // Lighter border color for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Elevation for Android shadow
  },
});

