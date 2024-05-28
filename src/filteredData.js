
var parseTime = d3.timeParse("%dd-%mm-%yyyy");
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
        age: +d["Age"],
        year: +d["Year"]
    };
}

export async function getFilteredData(features) {
    const data = await d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter);
    var newdata = data.filter(function(item) {
        return (!features.brands || features.brands.includes(item.brand)) &&
               (!features.models || features.models.includes(item.model)) &&
               (!features.colors || features.colors.includes(item.color)) &&
               (!features.newCars || features.newCars.includes(item.newCar)) &&
               (!features.age || features.age.includes(item.age)) &&
               (!features.buyerGender || features.buyerGender.includes)&&
               (!features.year || features.year.includes(item.year)); 
    });
    return newdata;
}
