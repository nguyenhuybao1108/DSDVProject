var RowConverter = function(d) {
  return {
    brand: d.make,
    model: d.model,
    price: +d.price,

  };
}
function drawChart(data, selectedBrand) {
    var filteredData = data.filter(function(d) {
        return d.brand === selectedBrand;
    });
    var brandCounts = filteredData.reduce(function(counts, item) {
        var brand = item.brand;
        counts[brand] = (counts[brand] || 0) + 1;
        return counts;
      }, {});

    
}
var dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        var selectedBrand = this.getAttribute('data-value');
        document.getElementById('dropdownMenuButton').textContent = selectedBrand;

        d3.csv("https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarsMockData.csv", RowConverter).then( data => {
            
            drawChart(data,selectedBrand);
        });
    });
});