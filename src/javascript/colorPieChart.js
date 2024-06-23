import { getFilteredData } from "./filterData.js";



export async function drawPieChart(features) {
    
    const data = await getFilteredData(features);
    // Group by color and count occurrences
    const colorCounts = d3.rollup(data, v => v.length, d => d.color);
    const colorData = Array.from(colorCounts, ([color, Count]) => ({ color, Count }));
    
        // Sort the color data by count in descending order
        colorData.sort((a, b) => b.Count - a.Count);
    
        // Select the top 6 colors
    const topColors = colorData.slice(0, 5);
    const margin = { top: 10, right: 150, bottom: 20, left: 10 }
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    

    const radius = Math.min(width, height) / 2;

    d3.select("#pieChart").selectAll("*").remove();

    const arc = d3.arc()
        .outerRadius(radius - 37)
        .innerRadius(0);

    const labelArc = d3.arc()
        .outerRadius(radius - 170)
        .innerRadius(radius - 10);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.Count);

    const svg = d3.select("#pieChart").append("svg")
        .attr("width", 500)
        .attr("height", 400)
        .append("g")
        .attr("transform", `translate(${width / 2 -30}, ${height / 2 + 24})`);

    const g = svg.selectAll(".arc")
        .data(pie(topColors))
        .enter().append("g")
        .attr("class", "arc");

    const baseColor = "#14A2B0";
    const lightenedColor = d3.color(baseColor).brighter(2);

    
    g.append("path")
        .attr("d", arc)
        .style("fill", baseColor)
        .style("stroke", "rgb(16, 129, 140)")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
            d3.select(this).transition()
                .duration(200)
                .style("fill", lightenedColor);

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Color: ${d.data.color}<br>Count: ${d.data.Count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("width", "auto")
                .style("max-width", "200px")
                .style("text-align", "center");
        })
        .on("mouseout", function () {
            d3.select(this).transition()
                .duration(200)
                .style("fill", baseColor);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
   

        
    g.append("text")
        .attr("transform", function (d) {
            const pos = labelArc.centroid(d);
            return `translate(${pos[0]}, ${pos[1]})`;
        })
        .attr("dy", ".35em")
        .style('fill', "white")
        .style("font-size", "15px")
        .style("text-anchor", "middle")
        .text(d => d.data.color);

    g.on("mouseover", function (event, d) {
        const [x, y] = arc.centroid(d);
        const translateX = x * 0.08;
        const translateY = y * 0.08;
        d3.select(this).transition()
            .duration(200)
            .attr("transform", `translate(${translateX},${translateY})`);
    })
        .on("mouseout", function () {
            d3.select(this).transition()
                .duration(200)
                .attr("transform", "translate(0,0)");
        });

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


        svg.append("text")
        .attr("x", (width / 2) - 220)
        .attr("y", -170)
        .attr("text-anchor", "middle")
        .attr("font-size", "25px")
        .attr("fill", "white")
        .text("Top Colors by Count");

        svg.append("text")
        .attr("x", (width / 2) - 220)
        .attr("y", -170)
        .attr("text-anchor", "middle")
        .attr("font-size", "25px")
        .attr("fill", "white")
        .text("Top Colors by Count");
}

