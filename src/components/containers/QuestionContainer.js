import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text, 
} from "react-native";

import Range from "../layouts/Range";
import Options from "../layouts/Options";

export default function QuestionContainer({ surveyques, userAnswer, savedAnswer = null }) {

  const [answerType, SetAnswerType] = useState(null);


  useEffect(() => {
    if (surveyques != null){
      //console.log("Question Container-->>",surveyques);
      SetAnswerType(surveyques.answer_type);
      }
  }, [surveyques])

  // useEffect(() => {
  //   if (answerType != null)
      
  //     console.log("answerType-->>",answerType);
  // }, [answerType])

  return (
    <View style={styles.questionsContainer}>
      <Text style={styles.questionsText}>
        {surveyques ? surveyques.question_text : "Loading..."}
      </Text>
      <View style={styles.answerType}>
        {answerType ? answerType == "int" ?
            <Range question={surveyques} userValue={savedAnswer} setUserValue={userAnswer} /> :
          answerType == "bool" ? <Options userValue={savedAnswer} setUserValue={userAnswer}/> :
            <Text>Question Type Not Found...</Text>
          : <Text>
            Loading...
          </Text>}
      </View>
      
    </View>

  );
}

const styles = StyleSheet.create({
  questionsText: {
    fontSize: 25,
    marginTop: 25,

  },
  questionsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 10
  },
  answerType:{
    marginTop: 100
  }
});
