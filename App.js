import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import IndexScreen from "./src/components/screens/IndexScreen";
import DetailsScreen from "./src/components/screens/DetailsScreen";

const { Navigator, Screen } = createStackNavigator();

//Two Screens - Home page and Survey Details Screen

export default function App() {
  console.disableYellowBox = true;
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          name="Index"
          options={{ title: "Surveys" }}
          component={IndexScreen}
        />
        <Screen name="Details" options={{ title: "Survey Name" }} component={DetailsScreen} />
      </Navigator>
    </NavigationContainer>
  );
}