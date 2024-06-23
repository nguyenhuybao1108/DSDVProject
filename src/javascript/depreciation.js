import { getFilteredData } from './filterData.js';

export async function loadAndDrawChart(features) {
     await getFilteredData(features).then(filteredData => {
        if (!filteredData.length) {
            console.error('No data available after filtering.');
            return;
        }
        const uniqueMakes = new Set(filteredData.map(d => d.Make));

        // Check the number of unique makes to decide the grouping key
        const groupingKey = uniqueMakes.size > 1 ? 'make' : 'model';
        // Group by the determined key and calculate the average "5-yr Depreciation"
        const groupedData = d3.groups(filteredData, d => d[groupingKey])
            .map(([key, values]) => {
                const avgDepreciation = d3.mean(values, d => d.Depreciation);
                return { [groupingKey]: key, AverageDepreciation: avgDepreciation };
            });

        // Sort the grouped data by AverageDepreciation in ascending order
        groupedData.sort((a, b) => a.AverageDepreciation - b.AverageDepreciation);
        const newData = groupedData.slice(0, 10);

        // Draw the horizontal bar chart
        drawChart(newData, groupingKey);
    }).catch(error => {
        console.error('Error loading the filtered data:', error);
    });
}
function drawChart(data, groupingKey) {
    const margin = { top: 70, right: 50, bottom: 40, left: 100 },
        width = 600 - margin.left - margin.right,  // Reduced width
        height = 400 - margin.top - margin.bottom; // Reduced height

    // Clear existing chart
    d3.select("#depreciationChart").selectAll("*").remove();

    const svg = d3.select("#depreciationChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .style("font-family", "NATS")
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
        .attr("fill", "#10818c");
      
        

    // Add the x Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .style("color", "white")
        .style("font-size", "13px")
        .style("font-family", "NATS")
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .attr("class", "y-axis")
        .style("color", "white")
        .style("font-size", "15px")
        .style("font-family", "NATS")
        .call(d3.axisLeft(y));
        
    svg.select(".x-axis")
    .selectAll("text")
    .style("font-family", "NATS")
    .style("fill", "white");

    svg.select(".y-axis")
    .selectAll("text")
    .style("fill", "white");

    // Add the text labels
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.AverageDepreciation) + 5)
        .attr("y", d => y(d[groupingKey]) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("fill", "white")
        .text(d => d.AverageDepreciation.toFixed(2))
        .style("font-size", "15px")
        .style("font-family", "NATS");

    // Add the x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text("Average Depreciation");

    // Add the y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("margin-left", "10px")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(groupingKey.charAt(0).toUpperCase() + groupingKey.slice(1));

    // Add the chart title
    svg.append("text")
        .attr("x", width / 2 -28)
        .attr("y", 0 - (margin.top / 2)+10)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("fill", "white")
   
        .text("Top Models with the Lowest Depreciation");
}
