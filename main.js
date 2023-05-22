import * as d3 from "d3";
import geoJson from "./gb-1948.json";
import laptimes from "./laptimes.json";

const driverTimings = laptimes.MRData.RaceTable.Races[0].Laps[0].Timings;
const width = 1000;
const height = 2000;

const svg = d3
  .select("div#track")
  .append("svg")
  .attr("width", width)
  .attr("transfrom", "translate(800 400)") // apply width,height to svg
  .attr("height", height);

const projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);

projection.fitHeight(1800, geoJson); // adjust the projection to the features
projection.fitWidth(1000, geoJson); // adjust the projection to the features
const track = svg
  .append("path")
  .style("stroke", "black")
  .attr("stroke-width", 15)
  .style("padding", 20)
  .attr("id", "map")
  .style("fill", "none")

  .attr("d", path(geoJson)); // draw the features

const colors = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#000000",
];

const startPoint = pathStartPoint(track);

const entries = driverTimings.map((driverTiming) => {
  return [
    colors[parseInt(driverTiming.position) - 1],
    getMillis(driverTiming.time),
    driverTiming.driverId,
  ];
});
const main = () => {
  [entries[0]].forEach((entry) => {
    const marker = svg.append("circle");
    marker
      .attr("r", 8)
      .style("stroke", entry[0])
      .style("fill", entry[0])
      .attr("transform", "translate(" + startPoint[0] + ")");

    const name = svg
      .append("text")
      .attr("stroke", entry[0])
      .style("font-size", 20)
      .text(entry[2]);

    transition(marker, entry[1] - 20000);
    transition(name, entry[1] - 20000);
  });
};

function getMillis(timeInMmssmmm) {
  const [min, seconds] = timeInMmssmmm.split(":");
  const [sec, millis] = seconds.split(".");
  const time = (parseInt(min) * 60 + parseInt(sec)) * 1000 + parseInt(millis);
  return time;
}
function pathStartPoint(path1) {
  const d = path1.attr("d"),
    dsplitted = d.split(" ");
  return dsplitted.length > 1 ? dsplitted[1].split(",") : dsplitted;
}

function transition(marker, duration) {
  marker
    .transition()
    .delay(function (d, i) {
      return 200;
    })
    .duration(duration)
    .attrTween("transform", translateAlong(track.node()));
}

function translateAlong(path2) {
  const l = path2.getTotalLength();
  return function (d) {
    return function (t) {
      const p = path2.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")"; //Move marker
    };
  };
}

main()