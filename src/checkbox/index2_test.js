// Assuming you have a function drawGaugeChart(filters) similar to drawGraph(filters)
import { drawGraph } from './graph.js';
import { getFilteredData } from './filteredData.js';

async function populateDropdown(dropdownId, dataKey, filterKey, drawFunction) {
    const data = await getFilteredData({});
    const values = [...new Set(data.map(item => item[dataKey]))];

    const dropdown = document.getElementById(dropdownId);
    values.forEach(value => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${value}" id="${value}">
                <label class="form-check-label" for="${value}">
                    ${value}
                </label>
            </div>
        `;
        dropdown.appendChild(li);

        // Add an event listener to the checkbox
        li.querySelector('input').addEventListener('change', () => {
            // Get all selected values
            const selectedValues = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
            // Create filters object
            const filters = {};
            filters[filterKey] = selectedValues;
            // Redraw the graph and gauge chart with the selected filters
            drawFunction(filters);
        });
    });
}

async function populateAllDropdowns() {
    await populateDropdown('brandDropdown', 'brand', 'brands', applyFilters);
    await populateDropdown('newCarDropdown', 'newCar', 'newCars', applyFilters);
    await populateDropdown('ageDropdown', 'age', 'ages', applyFilters);
    await populateDropdown('genderDropdown', 'buyerGender', 'genders', applyFilters);
    await populateDropdown('yearDropdown', 'year', 'years', applyFilters);
}

populateAllDropdowns();

let currentFilters = {
    brands: [],
    newCars: [],
    ages: [],
    genders: [],
    years: []
};

function applyFilters(newFilters) {
    // Update the current filters
    currentFilters = { ...currentFilters, ...newFilters };
    // Redraw the graph and gauge chart with the updated filters
    drawGraph(currentFilters);
    drawGaugeChart(currentFilters);
}