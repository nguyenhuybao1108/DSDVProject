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

// Define the gauge chart function
function createGauge(initialSpeed) {
    const min = 100, max = 250;

    // Create a scale for the gauge
    const arcScale = d3.scaleLinear()
        .domain([min, max])
        .range([-Math.PI / 2, Math.PI / 2]);

    // Draw the arcs for each range
    ranges.forEach((range) => {
        const arc = d3.arc()
            .innerRadius(65)
            .outerRadius(100)
            .startAngle(arcScale(range.min))
            .endAngle(arcScale(range.max));

        svg.append("path")
            .attr("d", arc)
            .attr("fill", range.color)
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .on("click", () => handleRangeClick(range.min, range.max));
    });

    // Draw the initial needle
    needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2 + 80 * Math.cos(arcScale(initialSpeed) - Math.PI / 2))
        .attr("y2", height / 2 + 80 * Math.sin(arcScale(initialSpeed) - Math.PI / 2))
        .attr("stroke", "#000")
        .attr("stroke-width", 3);

    // Display the initial speed
    speedText = svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "#FF5733")
        .text(`Speed: ${initialSpeed}`);
}

// Function to update the needle and speed
function updateGauge(newSpeed) {
    const min = 100, max = 250;

    // Create a scale for the gauge
    const arcScale = d3.scaleLinear()
        .domain([min, max])
        .range([-Math.PI / 2, Math.PI / 2]);

    // Update the needle position
    needle.attr("x2", width / 2 + 80 * Math.cos(arcScale(newSpeed) - Math.PI / 2))
        .attr("y2", height / 2 + 80 * Math.sin(arcScale(newSpeed) - Math.PI / 2));

    // Update the speed text
    speedText.text(`Speed: ${newSpeed}`);
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

        console.log(`Total sale for range ${min}-${max}: $${salePrice}`);

        d3.select("#totalSale").remove();
        svg.append("text")
            .attr("id", "totalSale")
            .attr("x", width / 2)
            .attr("y", height / 2 + 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "#000")
            .text(`Total Sale: $${salePrice}`);

        // Calculate the midpoint of the range
        const midSpeed = (min + max) / 2;

        // Update the gauge with the midpoint speed
        updateGauge(midSpeed);
    }).catch(error => {
        console.error('Error fetching or parsing data:', error);
    });
}

// Read the data from the CSV file
d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv").then(data => {
    if (data.length > 0) {
        const initialSpeed = (ranges[0].min + ranges[0].max) / 2; // Use the midpoint of the first range as the initial speed
        createGauge(initialSpeed);
    } else {
        console.error('No data available');
    }
}).catch(error => {
    console.error('Error fetching or parsing data:', error);
});
