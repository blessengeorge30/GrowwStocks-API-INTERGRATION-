import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import axios from "axios";

export default function DetailsScreen({ route }) {
  const { symbol } = route.params;
  const [stockDetails, setStockDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://192.168.1.72:5001/stocks/${symbol}`)
      .then((response) => {
        setStockDetails(response.data);
      })
      .catch((error) => console.error(error));
  }, [symbol]);

  if (!stockDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={getImageSource(symbol)} style={styles.logo} />
        <View>
          <Text style={styles.title}>{stockDetails["01. symbol"]}</Text>
          <Text style={styles.subtitle}>{stockDetails["01. symbol"]}</Text>
        </View>
        <View>
          <Text style={styles.price}>${parseFloat(stockDetails["05. price"]).toFixed(2)}</Text>
          <Text
            style={
              parseFloat(stockDetails["10. change percent"]) >= 0
                ? styles.positiveChange
                : styles.negativeChange
            }
          >
            {stockDetails["10. change percent"]}
          </Text>
        </View>
      </View>

      {/* Chart placeholder */}
      <View style={styles.chartContainer}>
        <Text>Chart goes here</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>About {stockDetails["01. symbol"]}</Text>
        <Text style={styles.description}>
          Apple Inc. is an American multinational technology company that specializes in consumer electronics, software, and online services.
        </Text>

        {/* Industry and Sector */}
        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>Industry: Electronic computers</Text>
          <Text style={styles.tag}>Sector: Technology</Text>
        </View>

        {/* Additional stock information in three columns */}
        <View style={styles.infoContainer}>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>52-Week Low:</Text>
            <Text style={styles.infoValue}>{stockDetails["04. low"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>52-Week High:</Text>
            <Text style={styles.infoValue}>{stockDetails["03. high"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Market Cap:</Text>
            <Text style={styles.infoValue}>$2.77T</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.infoTitle}>P/E Ratio:</Text>
            <Text style={styles.infoValue}>27.77</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Beta:</Text>
            <Text style={styles.infoValue}>1.308</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Dividend Yield:</Text>
            <Text style={styles.infoValue}>0.54%</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.infoTitle}>Profit Margin:</Text>
            <Text style={styles.infoValue}>24.7%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Function to get the image path based on the stock symbol
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
    // default:
    //   return require("../assets/placeholder.png"); // Placeholder for unknown symbols
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  positiveChange: {
    color: "#4CAF50",
  },
  negativeChange: {
    color: "#F44336",
  },
  chartContainer: {
    height: 200,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tag: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  column: {
    flexBasis: "30%",
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
});
