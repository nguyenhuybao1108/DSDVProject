// js/charts/gaugeChart.js
import * as d3 from 'd3';
import { getFilteredData } from '../dataLoader.js';

const width = 400;
const height = 300;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

const ranges = [
    { min: 100, max: 149, color: "#FF5733" },
    { min: 150, max: 199, color: "#FFC300" },
    { min: 200, max: 250, color: "#DAF7A6" }
];

let needle, speedText;

export async function drawGaugeChart(filters) {
    const data = await getFilteredData(filters);
    console.log(data);

    d3.select("#gaugeChart").selectAll("*").remove();

    const svg = d3.select("#gaugeChart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const salesData = calculateSales(data);

    createGauge(svg, salesData);
}

function calculateSales(data) {
    return ranges.map(range => {
        const totalSale = data
            .filter(d => {
                const topSpeed = +d["Top Speed"];
                return topSpeed >= range.min && topSpeed <= range.max;
            })
            .reduce((total, d) => total + parseFloat(d.price), 0);
        return { ...range, totalSale };
    });
}

function createGauge(svg, salesData) {
    const totalSales = salesData.reduce((total, d) => total + d.totalSale, 0);

    const arcScale = d3.scaleLinear()
        .domain([0, totalSales])
        .range([-Math.PI / 2, Math.PI / 2]);

    let cumulativeSales = 0;

    salesData.forEach((range, i) => {
        const startAngle = arcScale(cumulativeSales);
        const endAngle = arcScale(cumulativeSales + range.totalSale);
        cumulativeSales += range.totalSale;

        const arc = d3.arc()
            .innerRadius(65)
            .outerRadius(100)
            .startAngle(startAngle)
            .endAngle(endAngle);

        svg.append("path")
            .attr("d", arc)
            .attr("fill", range.color)
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .on("click", () => handleRangeClick(range.min, range.max));
    });

    const initialRange = salesData[0];
    needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2)
        .attr("y2", height / 2 - 80)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    speedText = svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(totalSales);
}
