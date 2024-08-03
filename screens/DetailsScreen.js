import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

const cache = {}; // In-memory cache

export default function DetailsScreen({ route }) {
  const { symbol: initialSymbol } = route.params;
  const [symbol, setSymbol] = useState(initialSymbol);
  const [stockDetails, setStockDetails] = useState(null);
  const [timeSeriesDaily, setTimeSeriesDaily] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    fetchStockDetails(symbol);
  }, [symbol]);

  const fetchStockDetails = (symbol) => {
    // Check if data is already in cache
    if (cache[symbol]) {
      const cachedData = cache[symbol];
      setStockDetails(cachedData.globalQuote);
      setTimeSeriesDaily(cachedData.timeSeriesDaily);
      return;
    }

    // Fetch data from API
    axios
      .get(`http://192.168.1.72:5001/stocks/${symbol}`)
      .then((response) => {
        const { globalQuote, timeSeriesDaily } = response.data;

        // Store response in cache
        cache[symbol] = { globalQuote, timeSeriesDaily };

        setStockDetails(globalQuote);
        setTimeSeriesDaily(timeSeriesDaily);
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = () => {
    setSymbol(searchQuery);
  };

  if (!stockDetails || !timeSeriesDaily) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Prepare data for the chart
  const labels = Object.keys(timeSeriesDaily).reverse(); // Dates
  const data = Object.values(timeSeriesDaily).reverse().map(dailyData => parseFloat(dailyData["4. close"])); // Closing prices

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Line color
        strokeWidth: 2 // Line width
      }
    ]
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "0",
      strokeWidth: "0",
      stroke: "#000000"
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid background lines with no dashes
      stroke: "#e3e3e3"
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Details</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image source={require('../assets/search.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stockHeader}>
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
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 30}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>About {stockDetails["01. symbol"]}</Text>
        <Text style={styles.description}>
          An American multinational technology company that specializes in consumer electronics, software, and online services. It develops innovative products such as tablets, personal computers, and wearables, alongside powerful software solutions. The company is a leader in online services, offering a range of cloud-based solutions that enhance the functionality of its devices.
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
      marginTop: 28,
    },
    backIcon: {
      width: 18,
      height: 18,
      marginLeft: 8,
      marginTop: 5,
    },
    headerText: {
      fontSize: 15,
      fontWeight: "bold",
      marginLeft: 10,
      marginTop: 5,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 0.7,
      borderColor: "#ccc",
      marginBottom: 18,
      marginTop: 28,
      height: 40,
      width: '60%',
      alignSelf: 'flex-end',
      borderRadius: 12,
      marginHorizontal: 75,
    },
    searchInput: {
      flex: 1,
      padding: 10,
      fontSize: 16,
    },
    searchIcon: {
      padding: 10,
      height: 18,
      width: 18,
      marginRight: 14,
      opacity: 0.7,
    },
    stockHeader: {
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
    chart: {
      borderRadius: 16,
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
