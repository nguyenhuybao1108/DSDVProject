const filters = {
    "Year": [2005, 2007],
    "Make": ['Suzuki', 'Honda', 'BMW', 'Toyota', 'Ford', 'Buick', 'Infiniti',
        'Ram', 'GMC', 'Nissan', 'Scion', 'Porsche', 'Lexus', 'Mitsubishi',
        'Dodge', 'Mazda', 'Land Rover', 'Isuzu', 'Acura', 'Pontiac',
        'Audi', 'Citroën', 'Saab', 'Mercury', 'Plymouth', 'Maserati',
        'Cadillac', 'Chevrolet', 'Subaru', 'Mercedes-Benz', 'Volkswagen',
        'Volvo', 'Lincoln', 'Kia', 'Oldsmobile', 'Hyundai', 'Jeep',
        'Lamborghini', 'Saturn'],
    "New_car": [true, false],
    "Age": [20, 30],
    "Gender": ["Male"]
};

function rowConverter(d) {
    return {
        Year: new Date(d['Year']),
        Make: String(d['Make']),
        New_car: Boolean(d['New Car']),
        Age: parseInt(d['Buyer Age']),
        Gender: String(d['Buyer Gender']),
        Color: String(d['Color']),

    };
}

d3.csv("./datasets/Cars Mock Data (add year).csv", rowConverter)
    .then(data => {
        // Filter the data based on the specified filters
        const filteredData = data.filter(d =>
            filters['Age'][0] <= d.Age && d.Age <= filters['Age'][1] && // Age filter
            filters['New_car'].includes(d.New_car) && // New_car filter
            filters['Year'][0] <= d.Year.getFullYear() && d.Year.getFullYear() <= filters['Year'][1] && // Year filter
            filters['Make'].includes(d.Make) && // Make filter
            filters['Gender'].includes(d.Gender) // Gender filter
        );

        // Group by color and count occurrences
        const colorCounts = d3.rollup(filteredData, v => v.length, d => d.Color);
        const colorData = Array.from(colorCounts, ([Color, Count]) => ({ Color, Count }));

        // Sort the color data by count in descending order
        colorData.sort((a, b) => b.Count - a.Count);

        // Select the top 6 colors
        const topColors = colorData.slice(0, 6);

        drawChart(topColors);
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
    });
function drawChart(data) {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const labelArc = d3.arc()
        .outerRadius(radius - 100)
        .innerRadius(radius - 50);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.Count);

    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    const baseColor = "cornflowerblue";
    const lightenedColor = d3.color(baseColor).brighter(2);

    g.append("path")
        .attr("d", arc)
        .style("fill", baseColor)
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
            d3.select(this).transition()
                .duration(200)
                .style("fill", lightenedColor);

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Color: ${d.data.Color}<br>Count: ${d.data.Count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("width", "auto")
                .style("max-width", "200px")
                .style("text-align", "center");
        })
        .on("mouseout", function (d) {
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
        .style('fill', "black")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text(d => d.data.Color);

    g.on("mouseover", function (event, d) {
        const [x, y] = arc.centroid(d);
        const translateX = x * 0.08;
        const translateY = y * 0.08;
        d3.select(this).transition()
            .duration(200)
            .attr("transform", `translate(${translateX},${translateY})`);
    })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration(200)
                .attr("transform", "translate(0,0)");
        });

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}
