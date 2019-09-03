import { elements } from "./base";

// Show invalid message in placeholder
export const printInvalidInput = (el, err) => {
  el.value = "";
  el.placeholder = err;
};

// Change the placeholder message of the invalid cars
export const printInvalidCars = (invalidCars, input) => {
  invalidCars.forEach((el, index) => {
    elements.form.namedItem(
      `bmw-models-driven--${input[index]}`
    ).placeholder = `${el} is not a valid car`;
    elements.form.namedItem(`bmw-models-driven--${input[index]}`).value = "";
  });
};

// export const renderLoader = () => {
//   elements.loader.style.display = "block";
// };

// export const clearLoader = () => {
//   elements.loader.style.display = "none";
// };

export const renderPopup = message => {
  elements.popupMsg.innerHTML = message;
  elements.popup.style.display = "block";
};

export const closePopup = () => {
  elements.popup.style.display = "none";
};

export const printStep = step => {
  elements.formState.innerHTML = step;
};

//append question
//replace 'number' to index so every input will have an id
export const appendQuestion = (question, ammount, input) => {
  elements.formState.insertAdjacentHTML("beforeend", question);
  for (let i = 0; i < ammount; i++) {
    elements.formState.insertAdjacentHTML(
      "beforeend",
      input.replace("number", i)
    );
  }
};
