import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import QuestionContainer from '../containers/QuestionContainer';

export default function DetailsScreen({ navigation, route }) {
  const { surveydata: details } = route.params;

  //Setting the name of screen to Survey name
  navigation.setOptions({
    title: details.label,
  });

  const questions = details.questions;

  //dummy data for testing and development debugging
  let a = [{ survey1_q1: 2 }, { survey1_q2: 3 }];

  const [answers, SetAnswers] = useState([]);
  const [questionsAttempted, SetQuestionsAttempted] = useState([]);
  const [displayQuestionId, SetDisplayQuestionId] = useState(null);
  const [displayQuestion, SetDisplayQuestion] = useState(null);
  const [displayAnswer, SetDisplayAnswer] = useState(null);
  const [questionCounter, SetQuestionCounter] = useState(1);
  const [isAnswered, SetIsAnswered] = useState(false);
  const [nextQuestionAvailable, SetNextQuestionAvailable] = useState(false);
  const [isSave, SetIsSave] = useState(false);

  useEffect(() => {
    // Load First question (else part). If data already saved by user - load question and selected answers accordingly.
    if (details) {
      console.log('Entry Point');
      SetDisplayQuestionId(details.initial_question);
    }
  }, []);

  useEffect(() => {
    console.log('current Question Number-->', questionCounter);
    console.log('questionsAttempted.length-->', questionsAttempted.length);
  }, [questionCounter]);


  useEffect(() => {
    if (displayQuestionId !== null) {
      //console.log('displayQuestionID-->', displayQuestionId);
      SetDisplayQuestion(questions[displayQuestionId]);

      if (answers.length) {
        let answerExists = answers.find((item) =>
          item.hasOwnProperty(displayQuestionId)
        );

        if (answerExists) {
          SetDisplayAnswer(answerExists[displayQuestionId]);
          SetIsAnswered(true);
        } else SetDisplayAnswer(0);
      } else {
        SetDisplayAnswer(0);
      }
    }
  }, [displayQuestionId]);

  useEffect(() => {
    if (displayAnswer !== null) {
      //Check if next question exists on basis of current answer

      console.log('displayAnswer-->', displayAnswer);
      let next = nextQuestion(displayQuestionId, displayAnswer);

      if (next != null) {
        console.log('SetNextQuestionAvailable ->', true);
        SetNextQuestionAvailable(true);
      } else {
        console.log('SetNextQuestionAvailable ->', false);
        SetNextQuestionAvailable(false);
      }
    }
  }, [displayAnswer]);

  useEffect(() => {
    if (answers !== null && answers.length != 0)
      console.log('answerss ->', answers);
  }, [answers]);

  
  useEffect(() => {
    // This effect is called to update questions attempted and pass data to db layer
    console.log('questionsAttempted-->', questionsAttempted);

    if (
      isSave && questionsAttempted !== null && questionsAttempted.length != 0
    ) {
      let match = [];

      answers.forEach((element) => {
        questionsAttempted.forEach((qa) => {
          if (element && element.hasOwnProperty(qa)) {
            match.push(element);
          }
        });
      });

      console.log('match ->', match);
      let saveObject = {};
      saveObject[String(details.name)] = match;
      console.log('Send the stored object to data layer-->>', saveObject);
    }
  }, [questionsAttempted]);


  // function to read values from user inputs and update component state
  const saveFormattedAnswer = (userInput) => {
    console.log('----SAVE FormattedAnswer called ->', typeof userInput);
    if (userInput == 0 || userInput != displayAnswer) {
      //('userInput84 ->', userInput);
      SetDisplayAnswer(userInput);
      updateAnswer(userInput);
      SetIsAnswered(true);
    }
  };

  const goForward = () => {
    console.log('FORWARD-->>');
    SetQuestionCounter(questionCounter + 1);

    SetQuestionsAttempted([...questionsAttempted, displayQuestionId]);
    updateAnswer(displayAnswer);
    let next = nextQuestion(displayQuestionId, displayAnswer);
    if (next != null) {
      //SetPreviousQuestion(displayQuestionId);
      SetDisplayQuestionId(next);
    } else SetNextQuestionAvailable(false);
  };

  const goBack = () => {
    console.log('BACKKKKKK-->>');
    SetQuestionCounter(questionCounter - 1);
    updateAnswer(displayAnswer);

    SetDisplayQuestionId(questionsAttempted.slice(-1)[0]);
    SetQuestionsAttempted([
      ...questionsAttempted.slice(0, questionsAttempted.length - 1),
      ...questionsAttempted.slice(questionsAttempted.length),
    ]);
  };

  const nextQuestion = (questionId, answer) => {
    let next = questions[questionId].next_question.default;

    //Handling Survey 2 data
    let custom = questions[questionId].next_question.custom;

    if (custom) {
      if (questions[questionId].answer_type == 'bool') {
        custom.forEach((element) => {
          if (element.answer == answer) next = element.next;
        });
      } else if (questions[questionId].answer_type == 'int') {
        custom.forEach((element) => {
          if (answer >= element.answer[0] && answer <= element.answer[1])
            next = element.next;
        });
      }
    }

    console.log('next-->>', next);
    return next;
  };

  const save = () => {
    SetQuestionsAttempted([...questionsAttempted, displayQuestionId]);
    updateAnswer(displayAnswer);
    SetIsSave(true);

    navigation.navigate('Index');
  };

  const updateAnswer = (userInput) => {
    //get the question id, check if question already exists in answers node,
    // if yes update, else enter new.

    let answerExists = false;
    let updatedItem = {}; // this object will get replaced/added to updated/new answer
    updatedItem[String(displayQuestionId)] = userInput;
    if (answers.length > 0) {
      let updtArr = answers.map((element) => {
        if (element && element.hasOwnProperty(displayQuestionId)) {
          answerExists = true;
          return updatedItem;
        }
        return element;
      });
      if (answerExists) {
        SetAnswers(updtArr);
        SetIsAnswered(true);
      } else {
        SetAnswers([...answers, updatedItem]);
        SetIsAnswered(true);
      }
    } else {
      SetAnswers([updatedItem]);
      SetIsAnswered(false);
    }
  };

  console.disableYellowBox = true;

  return (
    <View style={[styles.detailsScreen]}>
      <QuestionContainer
        surveyques={displayQuestion}
        userAnswer={saveFormattedAnswer}
        savedAnswer={displayAnswer}
      />
      <View style={[styles.questionsController]}>
        {questionCounter > 1 ? (
          <Button
            style={[styles.button]}
            disabled={questionCounter <= 1}
            title="<<"
            color="#FF3D00"
            onPress={() => {
              goBack();
            }}
          />
        ) : (
          <Button style={[styles.button]} title="<<" disabled={true} />
        )}

        {nextQuestionAvailable == true && questionCounter > 0 ? (
          <Button
            style={[styles.button]}
            disabled={!isAnswered}
            title=">>"
            color="#FF3D00"
            onPress={() => {
              goForward();
            }}
          />
        ) : (
          <Button
            style={[styles.button]}
            title="Save"
            disabled={!isAnswered}
            color="#FF3D00"
            onPress={() => {
              save();
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsScreen: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    height: 100,
    width: 100,
  },
  questionsController: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
    marginLeft: 20,
    marginRight: 20,
  },
});
