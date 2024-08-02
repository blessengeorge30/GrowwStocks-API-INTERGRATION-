import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Switch } from "react-native";
import axios from "axios";
import { useTheme } from "../ThemeContext"; // import the useTheme hook

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [data, setData] = useState({ all: [], gainers: [], losers: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState("all");

  useEffect(() => {
    axios
      .get("http://192.168.1.72:5001/stocks/gainers-losers")
      .then((response) => {
        setData({
          all: [...response.data.gainers, ...response.data.losers],
          gainers: response.data.gainers,
          losers: response.data.losers,
        });
        setFilteredData([...response.data.gainers, ...response.data.losers]);
      })
      .catch((error) => console.error(error));
  }, []);

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
      default:
        return require("../assets/placeholder.png");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tile, isDarkMode && styles.tileDark]}
      onPress={() => navigation.navigate("Details", { symbol: item.symbol })}
    >
      <Image source={getImageSource(item.symbol)} style={styles.image} />
      <Text style={[styles.symbol, isDarkMode && styles.symbolDark]}>{item.symbol}</Text>
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
      <TouchableOpacity onPress={() => Linking.openURL('https://groww.in/')}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>

      <Switch value={isDarkMode} onValueChange={toggleTheme} />

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, view === "gainers" && styles.activeButton]}
          onPress={() => toggleView("gainers")}
        >
          <Text style={styles.buttonText}>Top Gainers</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.button, view === "losers" && styles.activeButton]}
          onPress={() => toggleView("losers")}
        >
          <Text style={styles.buttonText}>Top Losers</Text>
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
    backgroundColor: "#333",
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
    marginVertical: 15,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
  tileDark: {
    backgroundColor: "#555",
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
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  logo: {
    width: 180,
    height: 50,
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 80,
    marginBottom: 25,
  },
});
