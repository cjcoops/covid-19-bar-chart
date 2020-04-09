import BarChart from "./bar-chart";
import ScatterPlot from "./scatter-plot";

const visualizations = [
  {
    name: "Bar Chart",
    function: BarChart,
  },
  {
    name: "Scatter Plot",
    function: ScatterPlot,
  },
];

const navElement = document.getElementsByTagName("nav")[0];

visualizations.forEach((visualization) => {
  const a = document.createElement("a");
  a.innerHTML = visualization.name;
  a.addEventListener("click", () => visualization.function());
  navElement.appendChild(a);
});

visualizations[1].function();