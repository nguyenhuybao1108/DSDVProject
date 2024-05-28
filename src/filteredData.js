import * as d3 from 'd3';
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
    };
}


export function getFilteredDataByBrand(brands) {
    return d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter).then( data => {
        var newdata = data.filter(function(item) {
            return brands.includes(item.brand);
        });
        return newdata;
    });
}
export function getFilteredDataByModel(models) {
    return d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter).then( data => {
        var newdata = data.filter(function(item) {
            return models.includes(item.model)
        });
        return newdata;
    });
}
export function getFilteredDataByStatus() {
    return d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter).then( data => {
        var newdata = data.filter(function(item) {
            return newCars.includes(item.newCar)
        });
        return newdata;
    });
}
export function getFilteredDataByAge(ages) {
    return d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter).then( data => {
        var newdata = data.filter(function(item) {
            return ages.includes(item.age)
        });
        return newdata;
    });
}
export function getFilteredDataByGender(gender) {
    return d3.csv("https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv", RowConverter).then( data => {
        var newdata = data.filter(function(item) {
            return item.buyerGender == gender;
        });
        return newdata;
    });
}


