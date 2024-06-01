// js/filter_func.js

export function populateCheckboxes(data) {
  const filters = {
      Year: "#yearFilter",
      Make: "#makeFilter",
      NewCar: "#newCarFilter",
      Age: "#ageFilter",
      Gender: "#genderFilter"
      // Add other filters here
  };

  Object.entries(filters).forEach(([category, containerId]) => {
      const values = [...new Set(data.map(d => d[category.toLowerCase()]))];
      const filterContainer = d3.select(containerId);

      filterContainer.append("h4").text(category);
      
      values.forEach(value => {
          filterContainer.append("div")
              .attr("class", "form-check")
              .html(`
                  <input class="form-check-input" type="checkbox" value="${value}" id="${value}">
                  <label class="form-check-label" for="${value}">
                      ${value}
                  </label>
              `);
      });
  });
}

export function getFilters() {
  const filters = {};
  d3.selectAll(".filter").each(function() {
      const category = this.id.replace("Filter", "");
      filters[category] = [];
      d3.selectAll(`#${this.id} .form-check-input:checked`).each(function() {
          filters[category].push(this.value);
      });
  });
  return filters;
}
