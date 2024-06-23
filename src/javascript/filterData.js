// filterData.js
var parseTime = d3.timeParse("%d/%m/%Y");

var RowConverter = function(d) {
    return {
        brand: d.Make,
        model: d.Model,
        price: +d["Sale Price"],
        carGender: d["Car Gender"],
        buyerGender: d["Buyer Gender"],
        country: d["Country"],
        city: d["City"],
        lat: +d["Dealer Latitude"],
        long: +d["Dealer Longitude"],
        color: d.Color,
        date: parseTime(d["Purchase Date"]),
        topSpeed: +d["Top Speed"],
        newCar: d["New Car"],
        age: +d["Buyer Age"],
        year: +d["Year"],
        Depreciation: parseFloat(d['5-yr Depreciation']),
    };
}

export async function getFilteredData(features) {
    // Validate features to ensure correct types
    const isValidBrands = Array.isArray(features.brands) && features.brands.every(brand => typeof brand === 'string');
    const isValidAge = Array.isArray(features.age) && features.age.length === 2 && features.age.every(age => typeof age === 'number');
    if(!features.length === 0){
        if(!isValidBrands || !isValidAge) {
            throw new Error('Invalid features provided');
        }
    }
    const data = await d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter);
    return data.filter(item => {
    
        return (!features.brands || features.brands.includes(item.brand)) &&
               (!features.newCar || item.newCar === features.newCar) && // Update this line
               (!features.age || (item.age >= features.age.min && item.age <= features.age.max)) &&
               (!features.buyerGender || item.buyerGender === features.buyerGender) &&
               (!features.year || (item.year >= features.year.min && item.year <= features.year.max));
    });
}

