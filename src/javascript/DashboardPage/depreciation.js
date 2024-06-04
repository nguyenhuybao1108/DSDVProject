import loadFilteredData from './filter.js';

loadFilteredData().then(filteredData => {
    if (!filteredData.length) {
        console.error('No data available after filtering.');
        return;
    }
    const uniqueMakes = new Set(filteredData.map(d => d.Make));

    // Check the number of unique makes to decide the grouping key
    const groupingKey = uniqueMakes.size > 1 ? 'Make' : 'Model';
    // Group by the determined key and calculate the average "5-yr Depreciation"
    const groupedData = d3.groups(filteredData, d => d[groupingKey])
        .map(([key, values]) => {
            const avgDepreciation = d3.mean(values, d => d.Depreciation);
            return { [groupingKey]: key, AverageDepreciation: avgDepreciation };
        });

    // Sort the grouped data by AverageDepreciation in ascending order
    groupedData.sort((a, b) => a.AverageDepreciation - b.AverageDepreciation);

    // Draw the horizontal bar chart
    drawChart(groupedData, groupingKey);
}).catch(error => {
    console.error('Error loading the filtered data:', error);
});

function drawChart(data, groupingKey) {
    const margin = { top: 20, right: 70, bottom: 40, left: 90 },
        width = 600 - margin.left - margin.right,  // Reduced width
        height = 300 - margin.top - margin.bottom; // Reduced height

    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the x scale
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AverageDepreciation)])
        .range([0, width]);

    // Create the y scale
    const y = d3.scaleBand()
        .domain(data.map(d => d[groupingKey]))
        .range([0, height])
        .padding(0.1);

    // Create the bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d[groupingKey]))
        .attr("width", d => x(d.AverageDepreciation))
        .attr("height", y.bandwidth())
        .attr("fill", "steelblue");

    // Add the x Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Add the text labels
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.AverageDepreciation) + 5)
        .attr("y", d => y(d[groupingKey]) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.AverageDepreciation.toFixed(2));
}
