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


const ranges = [{min: 100, max: 149, color: "#FF5733"},
                {min: 150, max: 199, color: "#FFC300"}, 
                {min: 200, max: 250, color: "#DAF7A6"}];   

// Define the gauge chart function
function createGauge(value) {
    const min = 100, max = 250;
    const range = max - min;


    // Create a scale for the gauge
    const arcScale = d3.scaleLinear()
        .domain([min, max])
        .range([-Math.PI / 2, Math.PI / 2]);

    // Draw the arcs for each range
    ranges.forEach((range, i) => {
        const arc = d3.arc()
            .innerRadius(70)
            .outerRadius(100)
            .startAngle(arcScale(range.min))
            .endAngle(arcScale(range.max));

        svg.append("path")
            .attr("d", arc)
            .attr("fill", range.color)
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .on("click", () => handleRangeClick(range.min, range.max));
    });


    // Draw the arc
    svg.append("path")
        .attr("d", arc)
        .attr("fill", "#FF5733")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw the needle
    const needle = svg.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2 + 80 * Math.cos(arcScale(value) - Math.PI / 2))
        .attr("y2", height / 2 + 80 * Math.sin(arcScale(value) - Math.PI / 2))
        .attr("stroke", "#000")
        .attr("stroke-width", 3);
    
    // Display the value
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "#FF5733")
        .text(`${value} km/h`);
}
// Handle range click to display total sale price
function handleRangeClick(min, max) {
    d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv").then(data => {
        const totalSale = data
            .filter(d => +d["Top speed"] >= min && +d["Top speed"] <= max)
            .reduce((acc, d) => acc + parseFloat(d["Sale Price"]), 0);
        
        d3.select("#totalSale").remove();
        svg.append("text")
            .attr("id", "totalSale")
            .attr("x", width / 2)
            .attr("y", height / 2 + 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("fill", "#000")
            .text(`Total Sale: $${totalSale}`);
    }).catch(error => {
        console.error('Error fetching or parsing data:', error);
    });
}
// Read the data from the CSV file
d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv").then(data => {
    const speed = +data[0]["Top speed"];
    createGauge(speed);
}).catch(error => {
    console.error('Error fetching or parsing data:', error);
});


