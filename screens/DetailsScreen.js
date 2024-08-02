import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

export default function DetailsScreen({ route }) {
  const { symbol: initialSymbol } = route.params;
  const [symbol, setSymbol] = useState(initialSymbol);
  const [stockDetails, setStockDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStockDetails(symbol);
  }, [symbol]);

  const fetchStockDetails = (symbol) => {
    axios
      .get(`http://192.168.1.72:5001/stocks/${symbol}`)
      .then((response) => {
        setStockDetails(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    setSymbol(searchQuery);
  };

  if (!stockDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search symbol"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <Icon name="ios-search" size={20} color="#000" onPress={handleSearch} style={styles.searchIcon} />
      </View>

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

      <View style={styles.chartContainer}>
        <Text>Chart goes here</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>About {stockDetails["01. symbol"]}</Text>
        <Text style={styles.description}>
          Apple Inc. is an American multinational technology company that specializes in consumer electronics, software, and online services.
        </Text>

        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>Industry: Electronic computers</Text>
          <Text style={styles.tag}>Sector: Technology</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>52-Week Low:</Text>
            <Text style={styles.infoValue}>{stockDetails["04. low"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Current Price:</Text>
            <Text style={styles.infoValue}>{stockDetails["05. price"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>52-Week High:</Text>
            <Text style={styles.infoValue}>{stockDetails["03. high"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Open:</Text>
            <Text style={styles.infoValue}>{stockDetails["02. open"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Volume:</Text>
            <Text style={styles.infoValue}>{stockDetails["06. volume"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Latest Trading Day:</Text>
            <Text style={styles.infoValue}>{stockDetails["07. latest trading day"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Previous Close:</Text>
            <Text style={styles.infoValue}>{stockDetails["08. previous close"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Change:</Text>
            <Text style={styles.infoValue}>{stockDetails["09. change"]}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.infoTitle}>Change Percent:</Text>
            <Text style={styles.infoValue}>{stockDetails["10. change percent"]}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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

  }
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    width:'40%',
    
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchIcon: {
    padding: 10,
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
    padding: 9,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  column: {
    flexBasis: "30%",
    marginBottom: 15,
    marginLeft: 8,
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
