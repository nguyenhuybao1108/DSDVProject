const filters = {
    "Year": [2005, 2007],
    "Make": ['Toyota'],
    "New_car": [true, false],
    "Age": [20, 30],
    "Gender": ["Male"]
};

function rowConverter(d) {
    return {
        Year: new Date(d['Year']),
        Make: String(d['Make']),
        New_car: d['New Car'] === 'true', // Adjusted to handle string conversion correctly
        Age: parseInt(d['Buyer Age']),
        Gender: String(d['Buyer Gender']),
        Depreciation: parseFloat(d['5-yr Depreciation']),
        Model: String(d['Model']), // Assuming there is a 'Model' field in the dataset
        Color: String(d['Color']) // Assuming there is a 'Color' field in the dataset
    };
}

function loadFilteredData() {
    return d3.csv("./data/Cars Mock Data (add year).csv", rowConverter)
        .then(data => {
            const filteredData = data.filter(d =>
                filters['Age'][0] <= d.Age && d.Age <= filters['Age'][1] && // Age filter
                filters['New_car'].includes(d.New_car) && // New_car filter
                filters['Year'][0] <= d.Year.getFullYear() && d.Year.getFullYear() <= filters['Year'][1] && // Year filter
                filters['Make'].includes(d.Make) && // Make filter
                filters['Gender'].includes(d.Gender) // Gender filter
            );
            console.log('Filtered Data:', filteredData); // Log the filtered data
            return filteredData;
        })
        .catch(error => {
            console.error('Error loading the CSV file:', error);
            return [];
        });
}

export default loadFilteredData;
