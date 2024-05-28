// graph.js
import { getFilteredData } from './filteredData.js';

const margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

async function drawGraph(brand) {
    const features = { brands: [brand] };
    const data = await getFilteredData(features);
    console.log(data);

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.model))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.model))
        .attr("y", d => y(d.price))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.price))
        .attr("fill", "#69b3a2");
}

drawGraph("Volvo");