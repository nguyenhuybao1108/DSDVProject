import { getFilteredData } from "./filterData.js";

const margin = { top: 20, right: 30, bottom: 40, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

export async function drawDonutChart(features) {
    const data = await getFilteredData(features);
    const modelSales = d3.rollup(data, v => d3.sum(v, d => d.price), d => d.model);
    const salesData = Array.from(modelSales, ([model, sale]) => ({ model, sale }));
    salesData.sort((a, b) => b.sale - a.sale);
    const top10Models = salesData.slice(0, 20);

    d3.select("#donutChart").selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#donutChart')
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2 },${height / 2 + 26})`)
        .attr('class', 'slices');

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const pie = d3.pie().value(d => d.sale);
    const pieData = pie(top10Models);

    const arc = d3.arc().innerRadius(radius * 0.48).outerRadius(radius * 0.74);
    const labelArc = d3.arc().outerRadius(radius * 0.83).innerRadius(radius * 0.83);

    const color = d3.scaleSequential()
        .domain([0, d3.max(top10Models, d => d.sale)])
        .interpolator(d3.interpolatePurples);

    const g = svg.selectAll('path')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');

    g.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.sale))
        .attr('stroke', 'none')
        .attr('stroke-width', '2px')
        .on('mouseover', function(event, d) {
            d3.select(this).transition()
                .duration(200)
                .style('fill', d3.color(color(d.data.sale)).brighter(2));

            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Model: ${d.data.model}<br>Sales: ${Math.round(d.data.sale)}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .style('width', 'auto')
                .style('max-width', '200px')
                .style('text-align', 'center');
        })
        .on('mouseout', function(event, d) {
            d3.select(this).transition()
                .duration(200)
                .style('fill', color(d.data.sale));

            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    g.append('text')
        .attr('transform', function(d) {
            const pos = labelArc.centroid(d);
            return `translate(${pos[0]+1.74}, ${pos[1]-2})`;
        })
        .attr('dy', '.35em')
        .style('fill', 'white')
        .style('font-size', '13.5px')
        .style('text-anchor', 'middle')
        .text(d => d.data.model);

    g.on('mouseover', function(event, d) {
        const [x, y] = arc.centroid(d);
        const translateX = x * 0.08;
        const translateY = y * 0.08;
        d3.select(this).transition()
            .duration(200)
            .attr("transform", `translate(${translateX},${translateY})`);
    })
    .on('mouseout', function() {
        d3.select(this).transition()
            .duration(200)
            .attr("transform", "translate(0,0)");
    });

    svg.append("text")
        .attr("x", (width / 2) - 200)
        .attr("y", height / 2 -390)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("stroke", "bold")
        .style("fill", "white")
        .text("Top Models with Highest Sales");
}
