
import { getFilteredData } from './filteredData.js';

const margin = { top: 20, right: 30, bottom: 40, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

export async function drawGaugeChart(price) {
    const data = await getFilteredData({ price: price });
    console.log(data);

    // Clear the existing chart
    d3.select("#gaugeChart").selectAll("*").remove();

    // Append an SVG element for the chart
    const svg = d3.select("#gaugeChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the ranges for the gauge chart
    const ranges = [
        { min: 100, max: 149, color: "#FF5733" },
        { min: 150, max: 199, color: "#FFC300" },
        { min: 200, max: 250, color: "#DAF7A6" }
    ];

    // Calculate sales data based on the provided data
    function calculateSales(data) {
        return ranges.map(range => {
            const totalSale = data
                .filter(d => {
                    const topSpeed = +d["Top Speed"];
                    return topSpeed >= range.min && topSpeed <= range.max;
                })
                .reduce((total, d) => total + parseFloat(d["Sale Price"]), 0);
            return { ...range, totalSale };
        });
    }

    // Create the gauge chart
    function createGauge(salesData) {
        svg.selectAll("*").remove(); // Clear the SVG element before re-rendering
  
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
        .on("click", () => handleRangeClick(range.min, range.max))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            const tooltipX = x + 15;
            const tooltipY = y - 15;
            const tooltipText = `Range: ${range.min}-${range.max}<br>Total Sale: $${Math.round(range.totalSale)}`;
    
            d3.select("#tooltip")
              .style("left", `${tooltipX}px`)
              .style("top", `${tooltipY}px`)
              .style("opacity", 1)
              .html(tooltipText);
          })
          .on("mouseout", function() {
            d3.select("#tooltip")
              .style("opacity", 0);
          });

    // Add legends
    salesData.forEach((range, i) => {
      svg.append("text")
        .attr("x", 30) 
        .attr("y", 30 + i * 20) 
        .attr("fill", "00000")
        .text(` ${range.min}-${range.max}`);
  
      svg.append("rect")
        .attr("x", 10)
        .attr("y", 15 + i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", range.color);
    });
  
    const initialRange = salesData[0];
    updateText(totalSales)
    updateGauge(initialRange);});
    }

    // Update the gauge chart based on new speed range
    function updateGauge(newSpeedRange) {
        const { min, max } = newSpeedRange;

        const arcScale = d3.scaleLinear()
            .domain([100, 250])
            .range([-Math.PI / 2, Math.PI / 2]);

    }

    // Update text information for the gauge chart
    function updateText(salePrice) {
        d3.select("#totalSale").remove();
      svg.append("text")
        .attr("id", "totalSale")
        .attr("x", width / 2)
        .attr("y", height / 2 + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "#000")
        .text(`Total Sale: $${Math.round(salePrice)}`);
    }
    function handleRangeClick(min, max) {
        newSpeedRange = { min, max };
        d3.csv("https://raw.githubusercontent.com/GLinhNguyen/Lowtechdolphin/main/Cars%20Mock%20Data%20(add%20year).csv").then(data => {
          const salePrice = data
            .filter(d => {
              const topSpeed = +d["Top Speed"];
              return topSpeed >= min && topSpeed <= max;
            })
            .reduce((total, d) => total + parseFloat(d["Sale Price"]), 0);
      
            updateText(salePrice);
      
          updateGauge({ min, max });
        }).catch(error => {
          console.error('Error fetching or parsing data:', error);
        });
      }

      
      d3.selectAll("select").on("change", () => {
        const filteredData = filterData(data);
        const salesData = calculateSales(filteredData);
        createGauge(salesData);});
}
drawGaugeChart({});
