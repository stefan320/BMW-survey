export default class Survey {
  constructor() {
    if (this.retriveData("results")) {
      //Check for data in localStorage
      this.results = this.retriveData("results");
    } else {
      this.results = {
        groups: {
          adolescents: 0,
          unlicensed: 0,
          firstTimers: 0,
          targets: 0
        },
        totalSubmits: 0,
        targetsData: { drifter: 0, fwdOrAny: 0, bmwsOwned: [], modelsOwned: {} }
      };
    }
  }

  // Adds 1 to totalSubmits and the group type  the partacipant falls in
  addPartacipant(type) {
    this.results.groups[type]++;
    this.results.totalSubmits++;
    this.persistData("results", JSON.stringify(this.results));
  }

  validateAge(age) {
    if (age < 0 || age > 100) {
      return false;
    } else {
      return age;
    }
  }

  //Recives input object
  // Update the counters
  addTargetable(input) {
    const results = this.results;
    if (input.drifting === "yes") {
      results.targetsData.drifter++;
    }
    if (input.drivetrain === "FWD" || input.drivetrain === "idk") {
      results.targetsData.fwdOrAny++;
    }

    // if partacipant driven any bmw
    if (input.bmwsDriven > 0) {
      results.targetsData.bmwsOwned.push(parseInt(input.bmwsDriven));

      input.modelsDriven.forEach(el => {
        // Check if the bmw model entered is already in the list if no add it with value of 1
        if (!results.targetsData.modelsOwned[el]) {
          results.targetsData.modelsOwned[el] = 1;
        } else if (results.targetsData.modelsOwned[el] >= 1) {
          // if its already on the list increment by 1
          results.targetsData.modelsOwned[el]++;
        }
      });
    } else {
      results.targetsData.bmwsOwned.push(0);
    }

    this.persistData("targetsData", JSON.stringify(this.results.targetsData));
  }

  //Get an array of car models driven by partacipant
  getInputList(numOfCars, el) {
    const carList = [];
    for (let i = 0; i < numOfCars; i++) {
      carList.push(el[i].value);
    }
    return carList;
  }

  //Check if the car models are valid and sort them
  validateCar(arr) {
    const reg = new RegExp("^[0-9]+$");
    const cars = {
      carList: [],
      invalidCars: [],
      invalidInputIndex: []
    };
    arr.forEach((el, index) => {
      if (
        el[0] == "m" ||
        (reg.test(el) && el.length === 3) ||
        el[el.length - 1] === "i"
      ) {
        cars.carList.push(el);
      } else {
        cars.invalidCars.push(el);
        cars.invalidInputIndex.push(index);
      }
    });
    return cars;
  }

  persistData(name, data) {
    localStorage.setItem(name, data);
  }

  retriveData(name) {
    return JSON.parse(localStorage.getItem(name));
  }

  updatePercentages(obj, total) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let curPercentage;
    const percentages = {};

    keys.forEach((el, index) => {
      curPercentage = (values[index] / total) * 100;
      percentages[el] = Math.round(curPercentage * 100) / 100;
    });
    console.log(percentages);
    return percentages;
  }

  calcAverage(arr, total) {
    //Count all numbers in  the array
    const arrTotal = arr.reduce((a, b) => a + b, 0);
    const average = arrTotal / total;
    return average.toFixed(2);
  }
}
