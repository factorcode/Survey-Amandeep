import React, { useState, useEffect } from "react";
import { Button, View, StyleSheet } from "react-native";
import QuestionContainer from "../containers/QuestionContainer";

export default function DetailsScreen({ navigation, route }) {

  const { surveydata: details } = route.params;

  //Setting the name of screen to Survey name
  navigation.setOptions({
    title: details.label
  });

  const questions = details.questions;

  //dummy data for testing and development debugging
  let a = [{ "survey1_q1": 2 }, { "survey1_q2": 3 }]

  const [answers, SetAnswers] = useState([]);
  const [displayQuestionId, SetDisplayQuestionId] = useState(null);
  const [displayQuestion, SetDisplayQuestion] = useState(null);
  const [displayAnswer, SetDisplayAnswer] = useState(0);
  const [questionCounter, SetQuestionCounter] = useState(1);
  const [isNextQuestionAvailable, SetNextQuestionAvailable] = useState(true);
  const [notAnswered, SetNotAnswered] = useState(true);

  useEffect(() => {
    // Load First question (else part). If data already saved by user - load question and selected answers accordingly.
    if (answers.length > 0) {

      let questionId = Object.keys(answers[answers.length - 1])[0];
      SetDisplayQuestionId(questionId);
      SetDisplayQuestion(questions[questionId]);
      SetDisplayAnswer(answers[answers.length - 1][questionId]);
      SetNotAnswered(false);
    }
    else {
      SetDisplayQuestionId(details.initial_question)
      SetDisplayQuestion(questions[details.initial_question]);
    }

  }, [])



  const updateAnswer = (userInput) => {

    //get the question id, check if question already exists in answers node,
    // if yes update, else enter new.

    let answerExists = false;
    let updatedItem = {} // this object will get replaced/added to updated/new answer
    updatedItem[String(displayQuestionId)] = userInput;
    if (answers.length > 0) {
      let updtArr = answers.map(element => {
        if (element && element.hasOwnProperty(displayQuestionId)) {
          answerExists = true;
          return updatedItem;
        }
        return element;
      });
      answerExists ? SetAnswers(updtArr) : SetAnswers([...answers, updatedItem]);

    }
    else {
      SetAnswers([updatedItem]);
    }

  }

  useEffect(() => {
    if (answers.length > 0) {
      console.log("answerss ->", answers);
      SetNotAnswered(false);
    }
  }, [answers])

  // function to read values from user inputs and update component state
  const saveFormattedAnswer = (userInput) => {

    if (userInput == 0 || userInput != displayAnswer) {
      SetDisplayAnswer(userInput);
      updateAnswer(userInput);
    }
  }

  useEffect(() => {
    
    //Load previous questions data from saved answers
    if (questionCounter <= answers.length) {
      console.log("current Question-->", questionCounter);

      let questionId = Object.keys(answers[questionCounter - 1])[0];

      console.log("questionId-->", questionId);
      updateOldStates(questionId);

    }
  }, [questionCounter])


  const updateOldStates = (questionId) => {

    SetDisplayQuestionId(questionId);
    SetDisplayQuestion(questions[questionId]);
    SetDisplayAnswer(answers[questionCounter - 1][questionId]);
  }

  const updateNewStates = (questionId) => {

    SetDisplayQuestionId(questionId);
    SetDisplayQuestion(questions[questionId]);
    SetDisplayAnswer(0);
  }

  const goBack = () => {
    SetQuestionCounter(questionCounter - 1);
  }

  const goForward = () => {
    SetQuestionCounter(questionCounter + 1);
    SetNotAnswered(true);
    findNextQuestion(displayQuestionId, displayAnswer);
  }

  const findNextQuestion = (questionId, answer) => {


    let next = questions[questionId].next_question.default;

    //Handling Survey 2 data
    let custom = questions[questionId].next_question.custom;

    if (custom) {
      if (questions[questionId].answer_type == "bool") {
        custom.forEach(element => {
          if (element.answer == answer)
            next = element.next;
        });
      }
      else if (questions[questionId].answer_type == "int") {
        custom.forEach(element => {
          if (answer >= element.answer[0] && answer <= element.answer[1])
            next = element.next;
        });
      }
    }

    console.log("next-->>", next);
    next != null ? updateNewStates(next) : SetNextQuestionAvailable(false);
  }

  const save = () => {

    let saveObject = {};
    saveObject[String(details.name)] = answers;
    console.log("Send the stored object to data layer-->>", saveObject);

    navigation.navigate('Index');
  }

  console.disableYellowBox = true;

  return (
    <View style={[styles.detailsScreen]}>
      <QuestionContainer surveyques={displayQuestion}
        userAnswer={saveFormattedAnswer}
        savedAnswer={displayAnswer} />
      <View style={[styles.questionsController]}>
        {isNextQuestionAvailable ?
          <Button style={[styles.button]}
            disabled={questionCounter <= 1}
            title="<<"
            color="#FF3D00"
            onPress={() => {
              goBack();
            }} />
          : <Button style={[styles.button]}
            title="<<"
            disabled={true}
          />}

        {isNextQuestionAvailable ?
          <Button style={[styles.button]}
            disabled={notAnswered}
            title=">>"
            color="#FF3D00"
            onPress={() => {
              goForward();
            }}
          /> : <Button style={[styles.button]}
            title="Save"
            color="#FF3D00"
            onPress={() => {
              save();
            }}
          />}

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  detailsScreen: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    height: 100,
    width: 100
  },
  questionsController: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
    marginLeft: 20,
    marginRight: 20
  }
});