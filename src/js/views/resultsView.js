import { elements } from "./base";

// PIE Chart
export const chart = results => {
  Chart.defaults.global.defaultFontColor = "#58595b";
  Chart.defaults.global.defaultFontFamily = "Lato";
  window.chart = new Chart(elements.ctx, {
    type: "pie",
    data: {
      labels: ["Adolescents", "Unlicensed", "First-timers", "Targetables"],
      datasets: [
        {
          data: [
            results.groups.adolescents,
            results.groups.unlicensed,
            results.groups.firstTimers,
            results.groups.targets
          ],

          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ]
        }
      ]
    },
    options: {
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return data["labels"][tooltipItem[0]["index"]];
          },
          label: function(tooltipItem, data) {
            var label = data["datasets"][0]["data"][tooltipItem["index"]];
            if (label === 1) {
              label += " submission";
            } else {
              label += " submissions";
            }
            return label;
          },
          afterLabel: function(tooltipItem, data) {
            console.log(data);
            console.log(tooltipItem);
            var percentage =
              (data["datasets"][0]["data"][tooltipItem["index"]] /
                results.totalSubmits) *
              100;
            percentage = Math.round(percentage * 100) / 100;
            return percentage + "% of submissions";
          }
        }
      }
    }
  });
};

//Bar Chart
export const barChart = results => {
  window.barChart = new Chart(elements.barChart, {
    type: "bar",
    data: {
      labels: ["Care about drifting", "FWD or IDK for drivetrain"],
      datasets: [
        {
          data: [results.drifter, results.fwdOrAny],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)"
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"]
        }
      ]
    },
    options: {
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      legend: false,
      scales: {
        yAxes: [
          {
            scaleLabel: { display: true, labelString: "percentages" },
            position: "left",
            id: "y-axis-1",
            type: "linear",
            ticks: { min: 0, beginAtZero: true, stepSize: 20, max: 100 }
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data["datasets"][0]["data"][tooltipItem["index"]];
            label += "%";
            return label;
          }
        }
      }
    }
  });
};

//Horizontal Chart
export const horizontalChart = results => {
  window.horizontalChart = new Chart(elements.horizontalChart, {
    type: "horizontalBar",
    data: {
      labels: Object.keys(results.modelsOwned),
      datasets: [
        {
          data: Object.values(results.modelsOwned),
          backgroundColor: "rgba(129, 196, 255, 0.6)"
        }
      ]
    },
    options: {
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      legend: false,
      scales: {
        yAxes: [
          {
            scaleLabel: { display: true, labelString: "Models Owned" },
            id: "y-axis-1"
          }
        ],
        xAxes: [
          {
            ticks: { beginAtZero: true, stepSize: 1 }
          }
        ]
      }
    }
  });
};
