export const elements = {
  continue: document.getElementById("continue"),
  ctx: document.getElementById("myChart").getContext("2d"),
  barChart: document.getElementById("barChart").getContext("2d"),
  horizontalChart: document.getElementById("horizontalChart").getContext("2d"),
  header: document.getElementById("header"),
  menu: document.querySelector(".header--menu"),
  formContainer: document.querySelector(".form"),
  form: document.getElementById("form").elements,
  formErrors: document.querySelector(".form__errors"),
  formState: document.querySelector(".form__state"),
  formAlert: document.querySelector(".form--alert"),
  // loader: document.querySelector(".loader"),
  popup: document.querySelector(".popup"),
  popupMsg: document.querySelector(".popup--msg"),
  popupClose: document.querySelector(".popup--close")
};

export const errors = {
  invalidAge: "The age you entered is invalid",
  invalidCarModel: "Is not a valid car model"
};

export const thankyouMsg = {
  normal: "Thank you for your interest in helping BMW.",
  unexperienced:
    "We are targeting more experienced clients, thank you for your interest",
  completed:
    "Thank you for taking the time to complete this survey. We truly value the information you have provided."
};

export const domStrings = {
  start: `<div class="form__state">
          <h1 class="form--alert d-none"></h1>
          <label class="form--label" for="age">Age</label>
          <input
            class="form--input"
            type="number"
            name="age"
            id="age"
            min="0"
            max="100"
          />

          <label class="form--label" for="gender">Gender</label>
          <select class="form__select" name="gender" id="gender">
            <option class="form__select--option" value="m">Male</option>
            <option class="form__select--option" value="f">Female</option>
            <option class="form__select--option" value="other">Other</option>
          </select>
        </div>`,
  isLicenced: `<label class="form--label" for="licence">
    Do you own a car driving license?</label>
  <select class="form__select" name="licence" id="licence">
    <option class="form__select--option" value="yes">Yes</option>
    <option class="form__select--option" value="no">No, I prefer using other transport</option>
  </select>`,

  isFirstCar: `     
  <label class="form--label" for="first-car">Is this your first car?</label>
  <select class="form__select" name="first-car" id="first-car">
    <option class="form__select--option" value="yes">Yes</option>
    <option class="form__select--option" value="no">No</option>
  </select>`,

  targetableQuestions: `
  <label class="form--label" for="drive-train">Which drivetrain do you prefer?</label>
    <select class="form__select" name="drive-train" id="drive-train">
      <option class="form__select--option" value="FWD">FWD</option>
      <option class="form__select--option" value="RWD">RWD</option>
      <option class="form__select--option" value="idk">I don't know</option>
    </select>

    <label class="form--label" for="drifting">Do you care about drifting?</label>
      <select class="form__select" name="drifting" id="drifting">
        <option class="form__select--option" value="yes">Yes</option>
        <option class="form__select--option" value="no">No</option>
      </select>

    <label class="form--label" for="bmws-driven">How many BMWs did you drive?</label>
    <input class="form--input" type="number" name="bmws-driven" id="bmws-driven"  min="0"/>`,

  modelsDriven: `<label class="form--label" for="bmw-models-driven">Which BMW did you drive?</label>`,
  modelsInput: `<input class="form--input" type="text" class="bmw-models-driven" name='bmw-models-driven' id="bmw-models-driven--number" />`
};
