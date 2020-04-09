import {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format,
} from "d3";

module.exports = () => {
  const svg = select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    select("svg").selectAll("*").remove();

    const title = "COVID-19 Cases vs Deaths by Country (20 < Deaths < 500)";

    const xValue = (d) => d.cases;
    const xAxisLabel = "Cases";

    const yValue = (d) => d.deaths;
    const circleRadius = 10;
    const yAxisLabel = "Deaths";

    const margin = { top: 40, right: 40, bottom: 88, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxisTickFormat = (number) => format("~s")(number);

    const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight)
      .tickPadding(15);

    const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

    const yAxisG = g.append("g").call(yAxis);
    yAxisG.selectAll(".domain").remove();

    yAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", -70)
      .attr("x", -innerHeight / 2)
      .attr("transform", `rotate(-90)`)
      .attr("text-anchor", "middle")
      .text(yAxisLabel);

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    xAxisG.select(".domain").remove();

    xAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", 70)
      .attr("x", innerWidth / 2)
      .text(xAxisLabel);

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", circleRadius);

    g.append("text").attr("class", "title").attr("y", -10).text(title);
  };

  csv(require("./assets/deaths-cases.csv")).then((data) => {
    data = data.filter((d) => d.deaths < 500 && d.deaths > 20);
    data.forEach((d) => {
      d.deaths = +d.deaths;
      d.cases = +d.cases;
    });

    render(data);
  });
};
