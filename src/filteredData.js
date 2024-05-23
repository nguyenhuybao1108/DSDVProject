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
    };

}




export function getFilteredData(brand) {
    return d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv", RowConverter).then( data => {
        return data.filter(function(item) {
            return item.brand === brand;
        });
    });
}