const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;
let xAxis;
let yAxis;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => {
        return item["Year"];
      }) - 1,
      d3.max(values, (item) => {
        return item["Year"];
      }) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => {
        return new Date(item["Seconds"] * 1000);
      }),
      d3.max(values, (item) => {
        return new Date(item["Seconds"] * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

const drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

const drawPoints = () => {
  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (item) => {
      return item["Year"];
    })
    .attr("data-yvalue", (item) => {
      return new Date(item["Seconds"] * 1000);
    })
    .attr("cx", (item) => {
      return xScale(item["Year"]);
    })
    .attr("cy", (item) => {
      return yScale(new Date(item["Seconds"] * 1000));
    })
    .attr("fill", (item) => {
      if (item["URL"] === "") {
        return "green";
      } else {
        return "blue";
      }
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");

      if (item["Doping"] != "") {
        tooltip.text(
          item["Name"] +
            ": " +
            item["Nationality"] +
            " - " +
            item["Year"] +
            ", " +
            item["Time"] +
            "; " +
            item["Doping"]
        );
      } else {
        tooltip.text(
          item["Name"] +
            ": " +
            item["Nationality"] +
            " - " +
            item["Year"] +
            ", " +
            item["Time"]
        );
      }

      tooltip.attr("data-year", item["Year"]);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  console.log(values);
  drawCanvas();
  generateScales();
  drawPoints();
  generateAxes();
};
req.send();
