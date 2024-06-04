// graph.js
// graph.js
import { getFilteredData } from './filteredData.js';


const margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


export async function drawGraph(filters) {
    const data = await getFilteredData(filters);
    console.log(data);

    d3.select("#my_dataviz").selectAll("*").remove();

    let svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Define the x scale
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.model))
        .padding(0.2);

    // Define the y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);

        // Add the x-axis to the chart
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add the y-axis to the chart
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add label for the x-axis
    svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Model");

    // Add label for the y-axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Price");

    // Bind the data to the graph
    const update = svg.selectAll("rect")
        .data(data);

    // Enter new elements
    update.enter()
        .append("rect")
        .attr("x", d => x(d.model))
        .attr("y", d => y(d.price))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.price))
        .attr("fill", "#69b3a2");

    // Update existing elements
    update
        .attr("x", d => x(d.model))
        .attr("y", d => y(d.price))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.price));

    // Remove old elements
    update.exit().remove();
}
drawGraph({});