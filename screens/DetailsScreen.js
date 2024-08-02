import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import axios from "axios";

export default function DetailsScreen({ route }) {
  const { symbol } = route.params;
  const [stock, setStock] = useState(null);

  useEffect(() => {
    axios
      .get(`http://192.168.1.70:5000/stocks/${symbol}`)
      .then((response) => setStock(response.data))
      .catch((error) => console.error(error));
  }, [symbol]);

  if (!stock) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={{ uri: stock.logoUrl }} />
        <View style={styles.headerText}>
          <Text style={styles.symbol}>{stock["01. symbol"]}</Text>
          <Text style={styles.company}>{stock["02. name"]}</Text>
          <Text style={styles.exchange}>{stock["03. exchange"]}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{stock["05. price"]}</Text>
          <Text style={stock["09. change"].startsWith("-") ? styles.negativeChange : styles.positiveChange}>
            {stock["09. change"]}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {/* Add your chart component here */}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>About {stock["02. name"]}</Text>
        <Text style={styles.description}>{stock.description || "No description available."}</Text>
      </View>

      <View style={styles.detailsContainer}>
        {/* Add more details as needed */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
  },
  company: {
    fontSize: 16,
    color: "#555",
  },
  exchange: {
    fontSize: 14,
    color: "#888",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
  },
  positiveChange: {
    fontSize: 16,
    color: "#4CAF50",
  },
  negativeChange: {
    fontSize: 16,
    color: "#F44336",
  },
  chartContainer: {
    height: 200,
    marginBottom: 20,
    // Chart component styles go here
  },
  infoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  detailsContainer: {
    // Additional details styles go here
  },
});
