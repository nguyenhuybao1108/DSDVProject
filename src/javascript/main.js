import { getFilteredData } from './filterData.js';
import { drawCountrySalesGraph } from './drawCountrySalesGraph.js';
import { drawGaugeChart } from './gaugeChart.js';
import { drawPieChart } from './colorPieChart.js';
import { loadAndDrawChart as drawDepreciationChart } from './depreciation.js';
import { drawDonutChart } from './model.js';




const globalFilter = {}; // Declare the globalFilter object
// Populate the brand dropdown with unique values
async function populateBrandDropdown() {
    const data = await getFilteredData({});
    const brands = [...new Set(data.map(item => item.brand))];

    const dropdown = document.getElementById('brandDropdown');
    brands.forEach(brand => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${brand}" id="${brand}">
                <label class="form-check-label" for="${brand}">
                    ${brand}
                </label>
            </div>
        `;
        dropdown.appendChild(li);

        li.querySelector('input').addEventListener('change', () => {
            const selectedBrands = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
            globalFilter.brands = selectedBrands.length ? selectedBrands : null;
            console.log(globalFilter);
            applyFilters();
        });
    });
}
// Populate the new car dropdown with unique values
async function populateNewCarDropdown() {
    const data = await getFilteredData({});
    const newCarValues = [...new Set(data.map(item => item.newCar))];

    const dropdown = document.getElementById('newCarDropdown');
    newCarValues.forEach(option => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="newCar" value="${option}" id="${option}">
                <label class="form-check-label" for="${option}">
                    ${option}
                </label>
            </div>
        `;
        dropdown.appendChild(li);
        
        let lastChecked = null;

        li.querySelector('input').addEventListener('click', function() {
            let radio = document.querySelector('input[name="newCar"]:checked');
            if (radio === lastChecked) {
                this.checked = false;
                lastChecked = null;
                globalFilter.newCar = null; // Or whatever value you want when no option is selected
            } else {
                lastChecked = radio;
                globalFilter.newCar = this.value;
            }
            applyFilters();
        });
    });
}
// Populate the buyer gender dropdown with unique values
async function populateBuyerGenderDropdown() {

    const data = await getFilteredData({});
    const buyerGenderValues = [...new Set(data.map(item => item.buyerGender))];

    const dropdown = document.getElementById('dropdownGender');
    buyerGenderValues.forEach(option => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="gender" value="${option}" id="${option}">
                <label class="form-check-label" for="${option}">
                    ${option}
                </label>
            </div>
        `;

        dropdown.appendChild(li);
        
        let lastChecked = null;

        li.querySelector('input').addEventListener('click', function(){
            let radio = document.querySelector('input[name="gender"]:checked');
            if(radio === lastChecked){
                this.checked = false;
                lastChecked = null;
                globalFilter.buyerGender = null;
            }
            else{
                lastChecked = radio;
                globalFilter.buyerGender = this.value;
            }
            applyFilters();
        });
    });
}

// Apply filters when the user interacts with the filters
function applyFilters() {
    drawCountrySalesGraph(globalFilter);
    drawGaugeChart(globalFilter);
    drawPieChart(globalFilter);
    drawDepreciationChart(globalFilter);
    drawDonutChart(globalFilter);
}
document.getElementById('brandSearch').addEventListener('input', function(e) {
    var input = e.target.value.toLowerCase();
    var brands = document.querySelectorAll('#brandDropdown li:not(:first-child)'); // Select all brands except the search bar

    brands.forEach(function(brand) {
        var text = brand.textContent.toLowerCase();
        if (text.indexOf(input) > -1) {
            brand.style.display = ''; // Show brand
        } else {
            brand.style.display = 'none'; // Hide brand
        }
    });
});
// Age Slider
const rangeInputs = document.querySelectorAll(".range-input input");
const ageInputs = document.querySelectorAll(".age-input input");
let progress = document.querySelector(".ageSlider .progress");
progress.style.left = (0/ rangeInputs[0].max) *100+"%";
progress.style.right = 100-(150/ rangeInputs[1].max) *100+"%";
rangeInputs.forEach(input =>{
    input.addEventListener("input", function(){
        // Get the min and max values
        let minAge = parseInt(rangeInputs[0].value),
        maxAge = parseInt(rangeInputs[1].value);
        // Update the progress bar
        if(minAge > maxAge){
            let temp = maxAge;
            maxAge = minAge;
            minAge = temp;
        }
        ageInputs[0].value = minAge;
        ageInputs[1].value = maxAge;
        progress.style.left = (minAge/ rangeInputs[0].max) *100+"%";
        progress.style.right = 100-(maxAge/ rangeInputs[1].max) *100+"%";

        globalFilter.age = { min: parseInt(minAge, 10), max: parseInt(maxAge, 10)};
        applyFilters();
    });
});
ageInputs.forEach(input => {
    input.addEventListener("input", () => {
        // Parse the input values
        let minAge = parseInt(ageInputs[0].value),
            maxAge = parseInt(ageInputs[1].value);

        // Check if both inputs are valid numbers before updating
        if (!isNaN(minAge) && !isNaN(maxAge)) {
            // Ensure minAge and maxAge are within allowed range
            minAge = Math.max(0, Math.min(minAge, 150));
            maxAge = Math.max(0, Math.min(maxAge, 150));

            // Swap values if minAge is greater than maxAge
            if (minAge > maxAge) {
                [minAge, maxAge] = [maxAge, minAge];
            }

            // Update the range inputs and progress bar
            rangeInputs[0].value = minAge;
            rangeInputs[1].value = maxAge;
            progress.style.left = (minAge / ageInputs[0].max) * 100 + "%";
            progress.style.right = 100 - (maxAge / ageInputs[1].max) * 100 + "%";

            globalFilter.age = { min: parseInt(minAge, 10), max: parseInt(maxAge, 10) };
            applyFilters();
        }
    });
});
// Year Slider
const yearRangeInputs = document.querySelectorAll(".year-range-input input");
const yearInputs = document.querySelectorAll(".year-input .field input");
let yearProgress = document.querySelector(".yearSlider .progress");

// Initialize progress bar position
yearProgress.style.left = ((2000 - 2000) / (2024 - 2000)) * 100 + "%";
yearProgress.style.right = 100 - ((2024 - 2000) / (2024 - 2000)) * 100 + "%";

yearRangeInputs.forEach(input => {
    input.addEventListener("input", function() {
        // Get the min and max year values
        let minYear = parseInt(yearRangeInputs[0].value),
            maxYear = parseInt(yearRangeInputs[1].value);

        // Update the progress bar
        if (minYear > maxYear) {
            [minYear, maxYear] = [maxYear, minYear]; // Swap values if minYear is greater than maxYear
        }
        yearInputs[0].value = minYear;
        yearInputs[1].value = maxYear;
        yearProgress.style.left = ((minYear - 2000) / (2024 - 2000)) * 100 + "%";
        yearProgress.style.right = 100 - ((maxYear - 2000) / (2024 - 2000)) * 100 + "%";

        globalFilter.year = { min: minYear, max: maxYear };
        console.log(globalFilter);
        applyFilters();
    });
});

yearInputs.forEach(input => {
    input.addEventListener("input", () => {
        // Parse the input values
        let minYear = parseInt(yearInputs[0].value),
            maxYear = parseInt(yearInputs[1].value);

        // Check if both inputs are valid numbers before updating
        if (!isNaN(minYear) && !isNaN(maxYear)) {
            // Ensure minYear and maxYear are within allowed range
            minYear = Math.max(2000, Math.min(minYear, 2024));
            maxYear = Math.max(2000, Math.min(maxYear, 2024));

            // Swap values if minYear is greater than maxYear
            if (minYear > maxYear) {
                [minYear, maxYear] = [maxYear, minYear];
            }

            // Update the range inputs and progress bar
            yearRangeInputs[0].value = minYear;
            yearRangeInputs[1].value = maxYear;
            yearProgress.style.left = ((minYear - 2000) / (2024 - 2000)) * 100 + "%";
            yearProgress.style.right = 100 - ((maxYear - 2000) / (2024 - 2000)) * 100 + "%";

            globalFilter.year = { min: minYear, max: maxYear };
            console.log(globalFilter);
            applyFilters();
        }
    });
});
populateBrandDropdown();
populateNewCarDropdown();
populateBuyerGenderDropdown();

window.onload = function() {
    drawCountrySalesGraph({});
    drawGaugeChart({});
    drawPieChart({});
    drawDepreciationChart({});
    drawDonutChart({});
};



