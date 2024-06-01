// js/charts/barChart.js
import * as d3 from 'd3';
import { getFilteredData } from '../dataLoader.js';

const margin = { top: 10, right: 30, bottom: 90, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

export async function drawBarChart(filters) {
    const data = await getFilteredData(filters);
    console.log(data);

    d3.select("#barChart").selectAll("*").remove();

    const svg = d3.select("#barChart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d.model))
                .padding(0.2);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.price)])
                .range([height, 0]);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    svg.append("g")
       .call(d3.axisLeft(y));

    svg.append("text")
       .attr("transform", `translate(${width / 2},${height + margin.top + 40})`)
       .style("text-anchor", "middle")
       .text("Model");

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Price");

    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.model))
       .attr("y", d => y(d.price))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d.price))
       .attr("fill", "#69b3a2");
}
