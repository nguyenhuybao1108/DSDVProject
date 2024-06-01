const filters = {
    "Year": [2005, 2007],
    "Make": ['Suzuki', 'Honda', 'BMW', 'Toyota', 'Ford', 'Buick', 'Infiniti',
        'Ram', 'GMC', 'Nissan', 'Scion', 'Porsche', 'Lexus', 'Mitsubishi',
        'Dodge', 'Mazda', 'Land Rover', 'Isuzu', 'Acura', 'Pontiac',
        'Audi', 'Citroën', 'Saab', 'Mercury', 'Plymouth', 'Maserati',
        'Cadillac', 'Chevrolet'],
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
        Depreciation: parseFloat(d['5-yr Depreciation']),
        Model: String(d['Model']) // Assuming there is a 'Model' field in the dataset
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

        // Check the length of the Make filter to decide the grouping
        const groupingKey = filters['Make'].length > 1 ? 'Make' : 'Model';

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
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
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
