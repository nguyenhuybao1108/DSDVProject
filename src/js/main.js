
import '/filterController.js';

// import { fetchData, populateCheckboxes, filterData, getFilters } from './filter_func.js';
// import { drawBarChart } from './bar_chart.js';
// import { drawGaugeChart } from './gauge_chart.js';
// const url = "https://raw.githubusercontent.com/giahuy1310/dsdv-lab/main/Cars%20Mock%20Data%20(add%20year).csv";

// async function initializeDashboard() {
//     const data = await fetchData(url);

//     if (data.length > 0) {
//         populateCheckboxes(data);

//         d3.selectAll(".form-check-input").on("change", () => {
//             const filters = getFilters();
//             const filteredData = filterData(data, filters);
//             // Render your charts with filteredData
//             // renderCharts(filteredData);
//             console.log("Filtered Data:", filteredData);
//         });

//         // Initial rendering
//         // renderCharts(data);
//         console.log("Initial Data:", data);
//     } else {
//         console.log("No data available");
//     }
// }

// initializeDashboard();
