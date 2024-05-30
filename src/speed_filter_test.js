const width = 400;
const height = 300;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

const svg = d3.select("#gaugeChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const ranges = [
  { min: 100, max: 149, color: "#FF5733" },
  { min: 150, max: 199, color: "#FFC300" },
  { min: 200, max: 250, color: "#DAF7A6" }
];


function populateDropdowns(data) {
  const yearDropdown = d3.select("#yearDropdown");
  const makeDropdown = d3.select("#makeDropdown");
  const newCarDropdown = d3.select("#newCarDropdown");
  const ageDropdown = d3.select("#ageDropdown");
  const genderDropdown = d3.select("#genderDropdown");

  const years = ["Any",...new Set(data.map(d => d.Year))];
  const makes = ["Any",...new Set(data.map(d => d.Make))];
  const newCarOptions = ["Any",...new Set(data.map(d => d["New Car"]))];
  const ages = ["Any",...new Set(data.map(d => d["Buyer Age"]))];
  const genders = ["Any",...new Set(data.map(d => d["Buyer Gender"]))];

  yearDropdown.selectAll("option")
  .data(years).enter()
  .append("option")
  .attr("value", d => d === "Any" ? "" : d)
  .text(d => d);

makeDropdown.selectAll("option")
  .data(makes).enter()
  .append("option")
  .attr("value", d => d === "Any" ? "" : d)
  .text(d => d);

newCarDropdown.selectAll("option")
  .data(newCarOptions).enter()
  .append("option")
  .attr("value", d => d === "Any" ? "" : d)
  .text(d => d);

ageDropdown.selectAll("option")
  .data(ages).enter()
  .append("option")
  .attr("value", d => d === "Any" ? "" : d)
  .text(d => d);

genderDropdown.selectAll("option")
  .data(genders).enter()
  .append("option")
  .attr("value", d => d === "Any" ? "" : d)
  .text(d => d);

}
// calculate total sales for each range
function calculateSales(data) {
  return ranges.map(range => {
    const totalSale = data
      .filter(d => {
        const topSpeed = +d["Top Speed"];
        return topSpeed >= range.min && topSpeed <= range.max;
      })
      .reduce((total, d) => total + parseFloat(d["Sale Price"]), 0);
    return { ...range, totalSale };
  });
}

function filterData(data) {
  const selectedYear = d3.select("#yearDropdown").property("value");
  const selectedMake = d3.select("#makeDropdown").property("value");
  const selectedNewCar = d3.select("#newCarDropdown").property("value");
  const selectedAge = d3.select("#ageDropdown").property("value");
  const selectedGender = d3.select("#genderDropdown").property("value");

  return data.filter(d => {
    return (selectedYear === "" || d.Year === selectedYear) &&
      (selectedMake === "" || d.Make === selectedMake) &&
      (selectedNewCar === "" || d["New Car"] === selectedNewCar) &&
      (selectedAge === "" || d["Buyer Age"] === selectedAge) &&
      (selectedGender === "" || d["Buyer Gender"] === selectedGender);
  });
}

//initial needle
const needle = svg.append("line")
    .attr("class", "needle")
    .attr("x1", width / 2)
    .attr("y1", height / 2)
    .attr("x2", width / 2)
    .attr("y2", height / 2 - 80)
    .attr("stroke", "#000")
    .attr("stroke-width", 3);

//create initial gauge    
function createGauge(salesData) {
    svg.selectAll("*").remove(); // Clear the SVG element before re-rendering
  
    const totalSales = salesData.reduce((total, d) => total + d.totalSale, 0);
  
    const arcScale = d3.scaleLinear()
      .domain([0, totalSales])
      .range([-Math.PI / 2, Math.PI / 2]);
  
    let cumulativeSales = 0;
  
   
    salesData.forEach((range, i) => {
    const startAngle = arcScale(cumulativeSales);
    const endAngle = arcScale(cumulativeSales + range.totalSale);
    cumulativeSales += range.totalSale;

    const arc = d3.arc()
        .innerRadius(65)
        .outerRadius(100)
        .startAngle(startAngle)
        .endAngle(endAngle);

    svg.append("path")
        .attr("d", arc)
        .attr("fill", range.color)
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .on("click", () => handleRangeClick(range.min, range.max))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            const tooltipX = x + 15;
            const tooltipY = y - 15;
            const tooltipText = `Range: ${range.min}-${range.max}<br>Total Sale: $${Math.round(range.totalSale)}`;
    
            d3.select("#tooltip")
              .style("left", `${tooltipX}px`)
              .style("top", `${tooltipY}px`)
              .style("opacity", 1)
              .html(tooltipText);
          })
          .on("mouseout", function() {
            d3.select("#tooltip")
              .style("opacity", 0);
          });

    // Add legends
    salesData.forEach((range, i) => {
      svg.append("text")
        .attr("x", 30) 
        .attr("y", 30 + i * 20) 
        .attr("fill", "00000")
        .text(` ${range.min}-${range.max}`);
  
      svg.append("rect")
        .attr("x", 10)
        .attr("y", 15 + i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", range.color);
    });
  
    const initialRange = salesData[0];
    updateText(totalSales)
    updateGauge(initialRange);
    
  });
}

//update gauge when click on range
function updateGauge(newSpeedRange) {
  
  const { min, max } = newSpeedRange;

  const arcScale = d3.scaleLinear()
    .domain([100, 250])
    .range([-Math.PI / 2, Math.PI / 2]);

  const midSpeed = (min + max) / 2;

  //update needle
  needle
    .attr("x2", width / 2 + 80 * Math.cos(arcScale(midSpeed) - Math.PI / 2))
    .attr("y2", height / 2 + 80 * Math.sin(arcScale(midSpeed) - Math.PI / 2));

}

//function to handle click on range
function handleRangeClick(min, max) {
    newSpeedRange = { min, max };
    d3.csv("https://raw.githubusercontent.com/GLinhNguyen/Lowtechdolphin/main/Cars%20Mock%20Data%20(add%20year).csv").then(data => {
      const salePrice = data
        .filter(d => {
          const topSpeed = +d["Top Speed"];
          return topSpeed >= min && topSpeed <= max;
        })
        .reduce((total, d) => total + parseFloat(d["Sale Price"]), 0);
  
        updateText(salePrice);
  
      updateGauge({ min, max });
    }).catch(error => {
      console.error('Error fetching or parsing data:', error);
    });
  }
  function updateText(salePrice){
    d3.select("#totalSale").remove();
      svg.append("text")
        .attr("id", "totalSale")
        .attr("x", width / 2)
        .attr("y", height / 2 + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "#000")
        .text(`Total Sale: $${Math.round(salePrice)}`);
  }

  
//fetch data and create gauge
d3.csv("https://raw.githubusercontent.com/GLinhNguyen/Lowtechdolphin/main/Cars%20Mock%20Data%20(add%20year).csv").then(data => {
if (data.length > 0) {
    populateDropdowns(data);

    d3.selectAll("select").on("change", () => {
    const filteredData = filterData(data);
    const salesData = calculateSales(filteredData);
    createGauge(salesData);
    

    });

    const initialSalesData = calculateSales(data);
    createGauge(initialSalesData);
} else {
    console.log("No data available");
}
}).catch(error => {
console.error('Error fetching or parsing data:', error);
});

