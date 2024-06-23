import { getFilteredData } from './filterData.js';

const margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

export async function drawGaugeChart(features) {
    const data = await getFilteredData(features);

    // Clear the existing chart
    d3.select("#gaugeChart").selectAll("*").remove();

    // Append an SVG element for the chart
    const svg = d3.select("#gaugeChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${(width + margin.left + margin.right) / 3},${(height + margin.top + margin.bottom) / 2})`);

    // Add tooltip element to the DOM if it doesn't exist
    let tooltip = d3.select("body").select("#tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", "auto")
            .style("height", "auto")
            .style("padding", "8px")
            .style("font", "12px NATS")
            .style("background", "lightsteelblue")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("opacity", 0);
    }

    // Define the ranges for the gauge chart
    const ranges = [
        { min: 100, max: 149, color: "#10818c" },
        { min: 150, max: 199, color: "#45c4d1" },
        { min: 200, max: 250, color: "#94dde4" }
    ];

    // Calculate sales data based on the provided data
    function calculateSales(data) {
        return ranges.map(range => {
            const totalSale = data
                .filter(d => d.topSpeed >= range.min && d.topSpeed <= range.max)
                .reduce((total, d) => total + d.price, 0);
            return { ...range, totalSale };
        });
    }

    const salesData = calculateSales(data);
    createGauge(salesData);

    // Create the gauge chart
    function createGauge(salesData) {
        svg.selectAll("*").remove(); // Clear the SVG element before re-rendering

        const totalSales = salesData.reduce((total, d) => total + d.totalSale, 0);

        const arcScale = d3.scaleLinear()
            .domain([0, totalSales])
            .range([-Math.PI / 2, Math.PI / 2]);

        let cumulativeSales = 0;

        salesData.forEach(range => {
            const startAngle = arcScale(cumulativeSales);
            const endAngle = arcScale(cumulativeSales + range.totalSale);
            cumulativeSales += range.totalSale;

            const arc = d3.arc()
                .innerRadius(90)
                .outerRadius(135)
                .startAngle(startAngle)
                .endAngle(endAngle);

            const path = svg.append("path")
                .attr("d", arc)
                .attr("fill", range.color);

            const baseColor = range.color;
            const lightenedColor = d3.color(baseColor).brighter(2);

            path.on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill", lightenedColor);

                const tooltipText = `Range: ${range.min}-${range.max}<br>Total Sale: $${Math.round(range.totalSale)}`;
                tooltip
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .style("font-size", "15px")
                    .style("opacity", 1)
                    .html(tooltipText);

                const midAngle = (startAngle + endAngle) / 2;
                updateNeedle(midAngle);
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY + 5}px`);
            })
            .on("mouseout", function() {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill", baseColor);

                tooltip.style("opacity", 0);

                updateNeedle(-Math.PI / 2); // Reset the needle position when not hovering
            });

            svg.append("text")
                .attr("id", "totalSale")
                .attr("x", 0)
                .attr("y", 60)
                .attr("text-anchor", "middle")
                .attr("font-size", "18px")
                .attr("fill", "white")
                .text(`Total Sale: $${Math.round(totalSales)}`);

            svg.append("text")
                .attr("x",  0)
                .attr("y", height / 2 - 539 )
                .attr("text-anchor", "middle")
                .attr("font-size", "25px")
        
                .attr("fill", "white")
                .text("Total Sales by Speed Range");
        });

        // Add legends
        salesData.forEach((range, i) => {
            svg.append("text")
                .attr("x", -width / 2 + 120)
                .attr("y", -height / 2 + 80 + i * 20)
                .attr("fill", "white")
                .text(`${range.min}-${range.max}`);

            svg.append("rect")
                .attr("x", -width / 2 + 95)
                .attr("y", -height / 2 + 65 + i * 20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", range.color);
        });

        // Create the needle
        const needle = svg.append("line")
            .attr("class", "needle")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -112)
            .attr("stroke", "red")
            .attr("stroke-width", 2.4)
            .attr("transform", `rotate(${-90})`);

        // Update the needle position
        function updateNeedle(angle) {
            needle.transition()
                .duration(200)
                .attr("transform", `rotate(${(angle * 180 / Math.PI)})`);
        }
    }
}

drawGaugeChart({});
