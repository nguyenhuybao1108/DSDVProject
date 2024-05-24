// Set up dimensions and margins for the gauge chart
const width = 400;
const height = 300;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

// Append an SVG element to the body
const svg = d3.select("#gaugeChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const ranges = [
    { min: 100, max: 149, color: "#FF5733" },
    { min: 150, max: 199, color: "#FFC300" },
    { min: 200, max: 250, color: "#DAF7A6" }
];

// Initialize the needle and speed elements
let needle, speedText;

// Function to calculate total sales for each range
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

// Function to create the gauge
function createGauge(salesData) {
    const totalSales = salesData.reduce((total, d) => total + d.totalSale, 0);

    // Create a scale for the gauge
    const arcScale = d3.scaleLinear()
        .domain([0, totalSales])
        .range([-Math.PI / 2, Math.PI / 2]);

    let cumulativeSales = 0;

    // Draw the arcs for each range
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

    // Draw the initial needle
    const initialRange = salesData[0];
    needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2 + 80 * Math.cos(arcScale(initialRange.totalSale / 2) - Math.PI / 2))
        .attr("y2", height / 2 + 80 * Math.sin(arcScale(initialRange.totalSale / 2) - Math.PI / 2))
        .attr("stroke", "#000")
        .attr("stroke-width", 3);

    // Display the initial speed range
    speedText = svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "#FF5733")
        .text(`Speed: ${initialRange.min}-${initialRange.max}`);
}

// Function to update the needle and speed range
function updateGauge(newSpeedRange) {
    const { min, max } = newSpeedRange;

    // Create a scale for the gauge
    const arcScale = d3.scaleLinear()
        .domain([100, 250])
        .range([-Math.PI / 2, Math.PI / 2]);

    // Calculate the midpoint of the range
    const midSpeed = (min + max) / 2;

    // Update the needle position
    needle.attr("x2", width / 2 + 80 * Math.cos(arcScale(midSpeed) - Math.PI / 2))
        .attr("y2", height / 2 + 80 * Math.sin(arcScale(midSpeed) - Math.PI / 2));

    // Update the speed text to show the range
    speedText.text(`Speed: ${min}-${max}`);
}

// Handle range click to display total sale price and update the gauge
function handleRangeClick(min, max) {
    console.log(`Range clicked: ${min} - ${max}`);
    d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv").then(data => {
        console.log("Data loaded:", data);
        const salePrice = data
            .filter(d => {
                const topSpeed = +d["Top Speed"];
                return topSpeed >= min && topSpeed <= max;
            })
            .reduce((total, d) => total + parseFloat(d["Sale Price"]), 0);

        console.log(`Total sale for range ${min}-${max}: $${Math.round(salePrice)}`);

        d3.select("#totalSale").remove();
        svg.append("text")
            .attr("id", "totalSale")
            .attr("x", width / 2)
            .attr("y", height / 2 + 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "#000")
            .text(`Total Sale: $${Math.round(salePrice)}`);

        // Update the gauge with the new range
        updateGauge({ min, max });
    }).catch(error => {
        console.error('Error fetching or parsing data:', error);
    });
}

// Read the data from the CSV file
d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv").then(data => {
    if (data.length > 0) {
        const salesData = calculateSales(data);
        createGauge(salesData);
    } else {
        console.error('No data available');
    }
}).catch(error => {
    console.error('Error fetching or parsing data:', error);
});
