import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Slider from '@react-native-community/slider';


const Range = ({ question, userValue, setUserValue }) => {

    let answer_min = question.answer_min;
    let answer_max = question.answer_max;
    let answer_unit = question.answer_unit ? question.answer_unit : "";
    const handleSlider = (value) => {
        setUserValue(value);
    }
    const handleInput = (value) => {

        const parsedQty = Number.parseInt(value)
          if (Number.isNaN(parsedQty)) {
            Number(answer_min) 
          } else if (parsedQty > Number(answer_max)) {
            setUserValue(Number(answer_max))
          } else {
            setUserValue(parsedQty);
          }
        
    }
    
    return (

        <View style={styles.sliderContainer}>
            {answer_max > 10 ?
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={newText => handleInput(newText)}
                        defaultValue={ `${userValue}`}
                        keyboardType="numeric"
                        />
                    <Text style={styles.unit}>{answer_unit}</Text>
                </View>
                :
                <>
                    <Text style={styles.sliderValue}>{userValue}</Text>
                    <Slider
                        style={styles.slider}
                        value={ typeof userValue === 'number' ? userValue : Number(userValue)}
                        minimumValue={answer_min}
                        maximumValue={answer_max}
                        minimumTrackTintColor="#FF3D00"
                        maximumTrackTintColor="gray"
                        onValueChange={(e) => handleSlider(e)}
                        step={1}
                    />
                    <View style={styles.maxmin}>
                        <Text style={styles.unit}>{answer_min}</Text>
                        <Text style={styles.unit}>{answer_max}</Text>
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        alignItems: 'center'
    },
    slider: {
        width: '100%',
        height: 40,
        fontSize: 20
    },
    inputContainer: {
        flexDirection: 'row',
    },
    input: {
        borderWidth: 1,
        width: '25%',
        fontSize: 50,
        color: 'black'
    },
    sliderValue: {
        fontSize: 24
    },
    maxmin: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between"
    },
    unit: {
        fontSize: 24,
        marginLeft: 10,
    }
});

export default Range