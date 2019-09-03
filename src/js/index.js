import Survey from "./models/survey";
import { elements, errors, domStrings, thankyouMsg } from "./views/base";
import * as surveyView from "./views/SurveyView";
import * as resultsView from "./views/resultsView";

/****Gobal State ***
 * Under 18
 * unlicensedsed
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
  console.log("app runinng ");
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
    //Calculate and print the car average
  }

  let carsAverage = state.survey.calcAverage(
    state.survey.results.targetsData.bmwsOwned,
    state.survey.results.groups.targets
  );
  if (isNaN(carsAverage)) {
    carsAverage = 0;
  }
  elements.header.innerHTML = `On average survey partacipans owned ${carsAverage} cars.`;

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
    // Alert user that the age is invalid
    surveyView.printInvalidInput(
      elements.form.namedItem("age"),
      errors.invalidAge
    );
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
    //if partacipant is licensed and age is 18 - 25 print the bonus question and run step Three
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
  console.log(state);
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
    // Prints the next question and dynamically add inputs according to how many bmws driven
    surveyView.appendQuestion(
      domStrings.modelsDriven,
      state.partacipant.bmwsDriven,
      domStrings.modelsInput
    );
    elements.continue.onclick = state.stepFive;
  } else {
    // Save Results inside targetables object
    state.survey.addTargetable(state.partacipant);
    state.survey.addPartacipant("targets");
    state.finishSurvey(thankyouMsg.completed);
  }
};

state.stepFive = () => {
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
    console.log(cars);
    surveyView.printInvalidCars(cars.invalidCars, cars.invalidInputIndex);
  } else {
    state.survey.addTargetable(state.partacipant);
    state.survey.addPartacipant("targets");
    state.finishSurvey(thankyouMsg.completed);
  }
};

state.finishSurvey = msg => {
  // Show Thank you message
  // Update Percentages
  surveyView.renderPopup(msg);
  state.survey.updatePercentages(
    state.survey.results.groups,
    state.survey.results.totalSubmits
  );
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
