// drawCountrySalesGraph.js
import { getFilteredData } from './filterData.js';

const margin = { top: 35, right: 90, bottom: 90, left: 30 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

export async function drawCountrySalesGraph(features) {
    const data = await getFilteredData(features);
    console.log(data);
    // Aggregate sales data by country
    const salesData = d3.rollup(data, v => v.length, d => d.country);
    const salesArray = Array.from(salesData, ([country, count]) => ({ country, count }));

    // Sort and take the top 5 countries
    salesArray.sort((a, b) => b.count - a.count);
    const top5Sales = salesArray.slice(0, 11);

    d3.select("#countrySalesChart").selectAll("*").remove();

    const svg = d3.select("#countrySalesChart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", "translate(" + (margin.left+55) + "," + (margin.top+38) + ")");

    const y = d3.scaleBand()
        .range([0, height])
        .domain(top5Sales.map(d => d.country))
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(top5Sales, d => d.count)])
        .range([0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .style("font-family", "NATS");

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-family", "NATS")
        .style("font-size", "14px")
        


    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .attr("fill","white")
        .style("font-family", "NATS");
       

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 47)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill","white")
        .text("Country");

    svg.selectAll("rect")
        .data(top5Sales)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", "#E02FFD")
        .attr("opacity", "0.5")

    svg.selectAll("text.salesLabel")
        .data(top5Sales)
        .enter()
        .append("text")
        .attr("class", "salesLabel") // Assign a class for styling if needed
        .attr("x", d => x(d.count) + 5) // Position text at the end of the bar + 5px offset
        .attr("y", d => y(d.country) + y.bandwidth() / 2) // Vertically center text in the bar
        .attr("dy", ".35em") // Adjust vertical alignment
        .attr("text-anchor", "start") // Anchor text at the start (right side of the bar)
        .style("font-size", "15px") // Set text font size
        .style("fill", "white") // Set text color
        .text(d => d.count) // Set text content to sales number
        .style("font-family", "NATS");


    svg.append("text")
        .attr("x", width/2 -30)
        .attr("y", -25 )
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("fill","white")
        .text("Top Countries by Sales");
}
