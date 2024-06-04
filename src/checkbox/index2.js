import { drawGraph } from './testchart.js';
            import { getFilteredData } from './filteredData.js';
        
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
    
                    // Add an event listener to the checkbox
                    li.querySelector('input').addEventListener('change', () => {
                        // Get all selected brands
                        const selectedBrands = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
                        // Redraw the graph with the selected brands
                        drawGraph(selectedBrands);
                        drawGaugeChart(selectedBrands);
                    });
                });
            }
    
            populateBrandDropdown();

            //newCar
            async function populatenewCarDropdown() {
                const data = await getFilteredData({});
                const newCars = [...new Set(data.map(item => item.newCar))];
        
                const dropdown = document.getElementById('newCarDropdown');
                newCars.forEach(newCar => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${newCar}" id="${newCar}">
                            <label class="form-check-label" for="${newCar}">
                                ${newCar}
                            </label>
                        </div>
                    `;
                    dropdown.appendChild(li);
    
                    // Add an event listener to the checkbox
                    li.querySelector('input').addEventListener('change', () => {
                        // Get all selected brands
                        const selectednewCar = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
                        // Redraw the graph with the selected brands
                        drawGraph(selectednewCar); 
                        drawGaugeChart(selectednewCar);
                    });
                });
            }
    
            populatenewCarDropdown();

            //age
            async function populateAgeDropdown() {
                const data = await getFilteredData({});
                const age = [...new Set(data.map(item => item.age))];
        
                const dropdown = document.getElementById('ageDropdown');
                age.forEach(age => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${age}" id="${age}">
                            <label class="form-check-label" for="${age}">
                                ${age}
                            </label>
                        </div>
                    `;
                    dropdown.appendChild(li);
    
                    // Add an event listener to the checkbox
                    li.querySelector('input').addEventListener('change', () => {
                        // Get all selected brands
                        const selectedAge = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
                        // Redraw the graph with the selected brands
                        drawGraph(selectedAge); 
                        drawGaugeChart(selectedAge);
                    });
                });
            }
            populateAgeDropdown();


            //gender
            async function populateGenderDropdown() {
                const data = await getFilteredData({});
                const gender = [...new Set(data.map(item => item.buyerGender))];
        
                const dropdown = document.getElementById('genderDropdown');
                gender.forEach(buyerGender => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${buyerGender}" id="${buyerGender}">
                            <label class="form-check-label" for="${buyerGender}">
                                ${buyerGender}
                            </label>
                        </div>
                    `;
                    dropdown.appendChild(li);
    
                    // Add an event listener to the checkbox
                    li.querySelector('input').addEventListener('change', () => {
                        // Get all selected brands
                        const selectedGender = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
                        // Redraw the graph with the selected brands
                        drawGraph(selectedGender); 
                        drawGaugeChart(selectedGender);
                    });
                });
            }
    
            populateGenderDropdown();


            //gender
            async function populateYearDropdown() {
                const data = await getFilteredData({});
                const year = [...new Set(data.map(item => item.year))];
        
                const dropdown = document.getElementById('yearDropdown');
                year.forEach(year => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${year}" id="${year}">
                            <label class="form-check-label" for="${year}">
                                ${year}
                            </label>
                        </div>
                    `;
                    dropdown.appendChild(li);
    
                    // Add an event listener to the checkbox
                    li.querySelector('input').addEventListener('change', () => {
                        // Get all selected brands
                        const selectedYear = Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value);
                        // Redraw the graph with the selected brands
                        drawGraph(selectedYear); 
                        drawGaugeChart(selectedYear);
                    });
                });
            }
    
            populateYearDropdown();