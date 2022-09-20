import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from "react-native";

export default function SurveyButton({ title, onPress = f => f }) {
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={() => onPress(title)}
      underlayColor="#FF3D00"
    >
      <View style={styles.row}>
        <Text style={styles.buttonText}>
          {title}
        </Text>
        <View style={[styles.sample]}></View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  buttonText: {
    fontSize: 30,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sample: {
    height: 30,
    width: 30,
    margin: 5,
    borderRadius: 15,
    backgroundColor: "#FF3D00"
  }
});
