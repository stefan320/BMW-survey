import Survey from "./models/survey";
import { elements, errors, domStrings, thankyouMsg } from "./views/base";
import * as surveyView from "./views/SurveyView";
import * as resultsView from "./views/resultsView";

/****Gobal State ***
 * Under 18
 * unlicensed
 * First Timers
 * Targetable Clients
 *******************/
const state = {};
state.partacipant = {};

/*******************
 ********************
 * Event Listeners*
 ********************
 *********************/

//When survey completion popup is closed
elements.popupClose.addEventListener("click", () => {
  surveyView.closePopup();
  state.restart();
});

//if step = 0 continue btn will proceed to step one
//else the continue btn onclick value will be assigned to run the next step function
elements.continue.addEventListener("click", e => {
  e.preventDefault();
  if (state.step === 0) {
    state.stepOne();
  }
});

const initForm = () => {
  console.log("app runinng");
  if (!state.survey) {
    state.survey = new Survey();
  }
  state.step = 0;
  //Check for data in localStorage

  if (state.survey.retriveData("results")) {
    state.survey.results = state.survey.retriveData("results");
  }
  if (state.survey.retriveData("targetsData")) {
    state.survey.results.targetsData = state.survey.retriveData("targetsData");
  }

  state.carsAverage = state.survey.calcAverage(
    state.survey.results.targetsData.bmwsOwned,
    state.survey.results.groups.targets
  );
  if (isNaN(state.carsAverage)) {
    state.carsAverage = 0;
  }
  elements.header.innerHTML = `On average survey partacipans owned ${state.carsAverage} cars`;

  //Init the charts
  state.chart();
};

state.restart = () => {
  surveyView.printStep(domStrings.start);
  elements.continue.onclick = state.stepOne;
  //Destroy the current charts and create the new ones
  window.chart.destroy();
  window.barChart.destroy();
  window.horizontalChart.destroy();
  state.chart();
};

/**** Survey Steps ****
 * AGE & GENDER
 * IS USER LICENCED?
 * BONUS QUESTION IF AGE (18-25) & LICENCED: IS IT USERS FIRST CAR?
 ********************/

state.stepOne = () => {
  //Save the input values
  state.partacipant.age = elements.form.namedItem("age").value;
  state.partacipant.age = state.survey.validateAge(state.partacipant.age);
  state.partacipant.gender = elements.form.namedItem("gender").value;

  //Validate the age
  if (!state.partacipant.age) {
    const ageLabel = elements.form.namedItem("age").labels[0];
    // Alert user that the age is invalid
    surveyView.printInvalidInput(ageLabel, errors.invalidAge);
  } else if (state.partacipant.age < 18) {
    state.step++;
    // Save Survey as Under Aged partacipant
    state.survey.addPartacipant("adolescents");

    //Finish Survey
    state.finishSurvey(thankyouMsg.normal);
  } else {
    state.step++;
    //Print The Next Question
    surveyView.printStep(domStrings.isLicenced);
    //Assign the click button to step Two
    elements.continue.onclick = state.stepTwo;
  }
};

state.stepTwo = () => {
  state.partacipant.licenced = elements.form.namedItem("licence").value;
  if (state.partacipant.licenced === "no") {
    state.survey.addPartacipant("unlicensed");
    state.finishSurvey(thankyouMsg.normal);
  } else if (
    //if partacipant is licensed and age is 18 - 25 print the bonus question and run stepThree
    state.partacipant.licenced === "yes" &&
    state.partacipant.age <= 25
  ) {
    surveyView.printStep(domStrings.isFirstCar);
    elements.continue.onclick = state.stepThree;
  } else {
    //Print The Next Question
    surveyView.printStep(domStrings.targetableQuestions);
    //Since the bonus question is skipped step is incremented by two
    elements.continue.onclick = state.stepFour;
  }
};

//BONUS QUESTION only if partacipant is licensed between 18 & 25 years
state.stepThree = () => {
  state.firstCar = elements.form.namedItem("first-car").value;

  //IF this is the partacipant first car the partacipants is added to first timers and survey end
  if (state.firstCar === "yes") {
    state.survey.addPartacipant("firstTimers");
    state.finishSurvey(thankyouMsg.unexperienced);
  } else {
    //Print The Next set of Questions
    surveyView.printStep(domStrings.targetableQuestions);
    state.modelsInputCtrl();

    elements.continue.onclick = state.stepFour;
  }
};

state.stepFour = () => {
  // Get Values
  state.partacipant.drivetrain = elements.form.namedItem("drive-train").value;
  state.partacipant.drifting = elements.form.namedItem("drifting").value;
  state.partacipant.bmwsDriven = elements.form.namedItem("bmws-driven").value;

  // If partacipant drove 1 or more bmws
  if (state.partacipant.bmwsDriven > 0) {
    // Prints the next question
    surveyView.appendQuestion(domStrings.modelsDriven);
    // Dynamically add inputs according to how many bmws driven
    surveyView.appendInputs(
      state.partacipant.bmwsDriven,
      domStrings.modelsInput
    );
    state.modelsInputCtrl();
    elements.continue.onclick = state.stepFive;
  } else {
    // Save Results inside targetables object
    state.survey.addTargetable(state.partacipant);
    state.survey.addPartacipant("targets");
    state.finishSurvey(thankyouMsg.completed);
  }
};

state.stepFive = () => {
  if (
    state.partacipant.bmwsDriven != elements.form.namedItem("bmws-driven").value
  ) {
    console.log("changed");
    surveyView.appendInputs(
      elements.form.namedItem("bmws-driven").value -
        state.partacipant.bmwsDriven,
      domStrings.modelsInput
    );
  }
  state.partacipant.modelsDriven = [];

  // push the models driven to the array
  if (parseInt(state.partacipant.bmwsDriven) === 1) {
    state.partacipant.modelsDriven.push(
      elements.form.namedItem("bmw-models-driven").value
    );
  } else {
    state.partacipant.modelsDriven = state.survey.getInputList(
      state.partacipant.bmwsDriven,
      elements.form.namedItem("bmw-models-driven")
    );
  }

  // Validate the car list
  var cars = state.survey.validateCar(state.partacipant.modelsDriven);

  if (cars.invalidCars.length > 0) {
    surveyView.printInvalidCars(cars.invalidCars, cars.invalidInputIndex);
  } else {
    state.survey.addTargetable(state.partacipant);
    state.survey.addPartacipant("targets");
    state.finishSurvey(thankyouMsg.completed);
  }
};

/*********************
 * ****************
 * Testing
 * ****************
 *********************/

state.modelsInputCtrl = () => {
  const bmwsDriven = elements.form.namedItem("bmws-driven");
  let oldVal = parseInt(bmwsDriven.value);
  let newVal, difference;

  bmwsDriven.addEventListener("change", () => {
    newVal = parseInt(bmwsDriven.value);

    //If the new value is smaller than the old one
    if (newVal < oldVal) {
      console.log("pass");
      difference = oldVal - newVal;
      //Remove extra inputs
      surveyView.removeElements(difference);

      //Remove label if no more inputs
      if (newVal === 0) {
        surveyView.removeElements(1);
      }

      oldVal = newVal;
    } else {
      //Add inputs
      difference = newVal - oldVal;
      if (oldVal === 0) {
        surveyView.appendQuestion(domStrings.modelsDriven);
      }
      console.log("pass");
      surveyView.appendInputs(difference, domStrings.modelsInput, oldVal);
      oldVal = newVal;
    }

    state.partacipant.bmwsDriven = elements.form.namedItem("bmws-driven").value;
  });
  elements.continue.onclick = state.stepFive;
};

/*********************
 * ****************
 * Testing
 * ****************
 *********************/

state.finishSurvey = msg => {
  // Show Thank you message
  // Update Percentages
  surveyView.renderPopup(msg);
  state.survey.updatePercentages(
    state.survey.results.groups,
    state.survey.results.totalSubmits
  );
  state.carsAverage = state.survey.calcAverage(
    state.survey.results.targetsData.bmwsOwned,
    state.survey.results.groups.targets
  );
  if (isNaN(state.carsAverage)) {
    state.carsAverage = 0;
  }
  elements.header.innerHTML = `On average survey partacipans owned ${state.carsAverage} cars`;
};

state.chart = () => {
  const targetsData = state.survey.results.targetsData;
  let barChartData = {
    drifter: targetsData.drifter,
    fwdOrAny: targetsData.fwdOrAny
  };

  // Transform barChartData Values to percentages
  let barChartDataInPercent = state.survey.updatePercentages(
    barChartData,
    state.survey.results.groups.targets
  );

  resultsView.chart(state.survey.results);
  resultsView.barChart(barChartDataInPercent);
  resultsView.horizontalChart(targetsData);
};

initForm();
