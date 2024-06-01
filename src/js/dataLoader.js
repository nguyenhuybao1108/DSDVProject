// js/dataLoader.js
import * as d3 from 'd3';

var parseTime = d3.timeParse("%d-%m-%Y");

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
};

export async function getFilteredData(filters) {
    const data = await d3.csv("/data/CarsMockData(add_year).csv", RowConverter);
    return data.filter(item => {
        return (!filters.brands || filters.brands.includes(item.brand)) &&
               (!filters.newCars || filters.newCars.includes(item.newCar)) &&
               (!filters.age || (item.age >= filters.age[0] && item.age <= filters.age[1])) &&
               (!filters.buyerGender || filters.buyerGender.includes(item.buyerGender)) &&
               (!filters.year || (item.year >= filters.year[0] && item.year <= filters.year[1]));
    });
}
