// js/filterController.js
import { getFilteredData } from './dataLoader.js';
import { drawBarChart } from './charts/barChart.js';
import { drawGaugeChart } from './charts/gaugeChart.js';

let filters = {
    brands: [],
    newCars: [],
    age: null,
    buyerGender: [],
    year: null
};
function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        dropdown.add(optionElement);
    });

async function populateFilters() {
    const data = await getFilteredData({});
    const brands = [...new Set(data.map(item => item.brand))];
    const newCars = [...new Set(data.map(item => item.newCar))];
    const buyerGenders = [...new Set(data.map(item => item.buyerGender))];
    const years = [...new Set(data.map(item => item.year))];

    populateDropdown('brandDropdown', brands);
    populateDropdown('newCarDropdown', newCars);
    populateDropdown('buyerGenderDropdown', buyerGenders);
    populateDropdown('yearDropdown', years);
}



    dropdown.addEventListener('change', () => {
        const selectedOptions = Array.from(dropdown.selectedOptions).map(option => option.value);
        filters[dropdownId.replace('Dropdown', '').toLowerCase()] = selectedOptions;
        updateVisualizations();
    });
}

async function updateVisualizations() {
    await drawBarChart(filters);
    await drawGaugeChart(filters);
}

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    updateVisualizations();
});
