import * as d3 from "d3";

// Helpful resources
// https://stackoverflow.com/questions/43098812/adding-variable-amount-of-tspan-elements-to-text-depending-on-d-attribute-in-d3

d3.json(
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
).then(data => {
  console.log(data);
  drawTreeMap(data);
});

const svg = d3.select("svg");

// CONSTANTS
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 40, left: 20, right: 20, bottom: 20 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// SCALES
const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

function drawTreeMap(data) {
  colorScale.domain(data.children.map(obj => obj.name));

  const treemap = d3
    .treemap()
    .size([innerWidth, innerHeight])
    .padding(2)
    .round(true);

  // console.log(treemap);

  let root = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value); // .sum() is a must for treemap layout
  console.log(root);
  treemap(root);

  const g = svg
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  g.append("rect")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", "green")
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .attr("opacity", 0.5)
    .attr("fill", d => colorScale(d.data.category));

  let textNode = g
    .append("text")
    .attr("class", "label")
    .attr("y", 0);

  console.log(textNode);

  textNode.each(function(d, i) {
    let split = d.data.name.split(" ").filter(v => v);
    console.log(this, d, i, split);
    if (d.depth === 2) {
      d3.select(this)
        .selectAll("tspan")
        .data(split)
        .enter()
        .append("tspan")
        .attr("y", (d, i) => i * 10 + 10)
        .attr("x", 2)
        .text(d => d);
    }
  });
}
