import { getFilteredDataByBrand, getFilteredDataByModel } from './filteredData.js';
var dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        var selectedBrand = this.getAttribute('data-value');
        document.getElementById('dropdownMenuButton').textContent = selectedBrand;
        getFilteredDataByBrand(selectedBrand).then(data => {
            drawChart(data, selectedBrand);
        });
    });
});
function filterFunction() {
    var input, filter, div, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        var txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
