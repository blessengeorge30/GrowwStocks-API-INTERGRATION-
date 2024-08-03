import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./ThemeContext"; // Adjust the path as needed
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen name="Details" component={DetailsScreen}
           options={{ headerShown: false }}  />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
