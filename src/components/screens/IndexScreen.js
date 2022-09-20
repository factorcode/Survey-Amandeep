import React, { useState } from "react";
import { StyleSheet, FlatList, Text, View, Button } from "react-native";
import SurveyCard from "../layouts/SurveyCard";


import {getArrayData} from "../../services/utilities";


export default function IndexScreen({ navigation }) {

//Making an Api call / Load application data
const surveyListData = require('../../../data/survey.json');

//Convert data to array format
let formattedData = getArrayData(surveyListData);

  return (
    <>
     <FlatList
        style={[styles.container]}
        data={formattedData}
        renderItem={({ item }) => {
          return (
            <SurveyCard
              key={item.key}
              title={Object.values(item)[0].label}
              onPress={() =>
                navigation.navigate("Details", {
                  surveydata: Object.values(item)[0]
                })
              }
            />
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex"
  }
});
