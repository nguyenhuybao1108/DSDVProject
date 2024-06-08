import loadFilteredData from './filter.js';
import 
// Initialize the chart with an empty dataset
const initDonutChart = () => {
    const svg = d3.select('#donutChart').append('svg')
        .attr('width', 400)
        .attr('height', 400);

    const g = svg.append('g')
        .attr('transform', 'translate(200, 200)');

    g.append('g').attr('class', 'slices');

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    return { svg, g, tooltip };
};

// Call the initialization function
const { svg, g, tooltip } = initDonutChart();

const updateDonutChart = (data) => {
    // Group by model and calculate total sales
    const modelSales = d3.rollup(data, v => d3.sum(v, d => d.Sale), d => d.Model);
    const salesData = Array.from(modelSales, ([Model, Sale]) => ({ Model, Sale }));

    // Create a pie layout
    const pie = d3.pie().value(d => d.Sale);
    const pieData = pie(salesData);

    // Create an arc generator
    const arc = d3.arc().innerRadius(100).outerRadius(200);

    // Define your own color scale
    const color = d3.scaleSequential()
        .domain([0, d3.max(salesData, d => d.Sale)])
        .interpolator(d3.interpolatePurples);

    // Bind data to paths (slices)
    const path = g.select('.slices').selectAll('path')
        .data(pieData);

    // Update existing slices
    path.attr('d', arc)
        .attr('fill', d => color(d.data.Sale));

    // Enter new slices
    path.enter().append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.Sale))
        .on('mouseover', function(event, d) {
            tooltip.select('.tooltiptext')
                .html(`${d.data.Model}: ${d.data.Sale}`);
            d3.select(this)
                .attr('fill', d3.color(color(d.data.Sale)).brighter(1));
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`${d.data.Model}: ${d.data.Sale}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('fill', color(d.data.Sale));
            tooltip.transition()
                .duration(100)
                .style('opacity', 0);
        });

    // Remove old slices
    path.exit().remove();
};

// Load initial data
loadFilteredData().then(data => {
    updateDonutChart(data);
}).catch(error => {
    console.error('Error loading the filtered data:', error);
});
