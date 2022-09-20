import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const Options = ({ userValue, setUserValue }) => {

    const [checked, setChecked] = useState(userValue);



    const handleCheck = (value) => {
        setUserValue(value);
    }
    // Implementing Touchable Opacity would be a better idea with respect to UX
    return (
        <View>
            <View style={[styles.radioBox]}>
                <RadioButton 
                    value={true}
                    status={checked === true ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(true);
                        handleCheck(true)}}
                />
                <Text style={[styles.radioText]}>Yes</Text>
            </View>
            <View style={[styles.radioBox]}>
                <RadioButton 
                    value={false}
                    status={checked === false ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(false);
                        handleCheck(false)}}
                />
                <Text style={[styles.radioText]}>No</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    radioText: {
      fontSize: 20
    },
    radioBox:{
        display: "flex",
        flexDirection: "row"
    }
  });

export default Options;