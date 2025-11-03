import {
  getAllRecentEventsContinualList,
  getContinualEventsParticipants,
  getContinualEventsWithPrizes,
  getContinualEventsAverageRatingByDivision,
  getContinualEventsDiffRating,
} from "./functions/queries.js";
import { updateStatCards, updateEventDateRange } from "./functions/domHandler.js";

let allData = [];
let selectedEvent;
let continualId;

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR INITIAL LOAD UP
//
// --------------------------------------------------------------------------------------------------------------------------

(async function onPageLoad() {
  let data = await getAllRecentEventsContinualList();
  allData = data;
  renderTable();
})();

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               FUNCTION AFTER EVENT SELECTED
//
// --------------------------------------------------------------------------------------------------------------------------

function renderEvent() {
  processFilterEvent();
  updateEventDateRange(continualId);
  updateStatCards(continualId);
  renderSelectedVizButton();
  document.getElementById("event-section").style.display = "block";
  document.getElementById("event-name").textContent = selectedEvent.event_name;
  document.getElementById("event-dates").textContent =
    "Date " + selectedEvent.start_date;
  const tierBadge = getTierBadge(selectedEvent.tier);
  document.getElementById("event-tier").innerHTML = tierBadge;
  const websiteLink = document.getElementById("event-website");
  if (selectedEvent.website_url) {
    websiteLink.href = selectedEvent.website_url;
    websiteLink.style.display = "flex";
  } else {
    websiteLink.style.display = "none";
  }
  document.getElementById("event-city").textContent = selectedEvent.city;
  document.getElementById("event-state").textContent = selectedEvent.state;
  document.getElementById("event-country").textContent = selectedEvent.country;
  document.getElementById("event-director").textContent =
    selectedEvent.tournament_director || "N/A";

  const targetElement = document.getElementById("event-section");

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth", // For a smooth animated scroll
      block: "start", // Aligns the top of the element to the top of the viewport
    });
  }
}

function getTierBadge(tier) {
  let tierClass = "";
  let tierLabel = tier;

  switch (tier) {
    case "Major":
      tierClass = "tier-m";
      tierLabel = "Major";
      break;
    case "Elite":
      tierClass = "tier-es";
      tierLabel = "Elite Series";
      break;
    case "Tier-A":
      tierClass = "tier-a";
      tierLabel = "A-Tier";
      break;
    case "Tier-B":
      tierClass = "tier-b";
      tierLabel = "B-Tier";
      break;
    case "Tier-C":
      tierClass = "tier-c";
      tierLabel = "C-Tier";
      break;
    case "Tier-XA":
      tierClass = "tier-xa";
      tierLabel = "XA-Tier";
      break;
    case "Tier-XB":
      tierClass = "tier-xb";
      tierLabel = "XB-Tier";
      break;
    case "Tier-XC":
      tierClass = "tier-xc";
      tierLabel = "XC-Tier";
      break;
    case "Tier-XM":
      tierClass = "tier-xm";
      tierLabel = "XM-Tier";
      break;
    default:
      tierLabel = tier || "Unknown";
  }

  return `<span class="tier-badge ${tierClass}">${tierLabel}</span>`;
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               PAGINATION EVENT LISTS
//
// --------------------------------------------------------------------------------------------------------------------------

let currentPage = 1;
let pageSize = 10;

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, allData.length);

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add rows for current page
  for (let i = startIndex; i < endIndex; i++) {
    const item = allData[i];

    switch (item.tier) {
      case "M":
        item.tierCode = "tier-m";
        item.tier = "Major";
        break;
      case "NT":
        item.tierCode = "tier-es";
        item.tier = "Elite";
        break;
      case "A":
        item.tierCode = "tier-a";
        item.tier = "Tier-A";
        break;
      case "B":
        item.tierCode = "tier-b";
        item.tier = "Tier-B";
        break;
      case "C":
        item.tierCode = "tier-c";
        item.tier = "Tier-C";
        break;
      case "XA":
        item.tierCode = "tier-xa";
        item.tier = "Tier-XA";
        break;
      case "XB":
        item.tierCode = "tier-xb";
        item.tier = "Tier-XB";
        break;
      case "XC":
        item.tierCode = "tier-xc";
        item.tier = "Tier-XC";
        break;
      case "XM":
        item.tierCode = "tier-xm";
        item.tier = "Tier-XM";
        break;
      default:
        break;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.start_date}</td>
            <td><span class="tier-badge ${item.tierCode}">${item.tier}</span></td>
            <td>${item.city}</td>
            <td>${item.state}</td>
            <td>${item.country}</td>
        `;

    row.addEventListener("click", () => {
      selectedEvent = item;
      continualId = item.id;
      renderEvent();
    });

    tableBody.appendChild(row);
  }

  const rowsToFill = pageSize - (endIndex - startIndex);
  for (let i = 0; i < rowsToFill; i++) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";
    emptyRow.innerHTML = `
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
    `;
    tableBody.appendChild(emptyRow);
  }

  updatePaginationInfo();
  updatePaginationControls();
}

function updatePaginationInfo() {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, allData.length);

  document.getElementById("startEntry").textContent = startEntry;
  document.getElementById("endEntry").textContent = endEntry;
  document.getElementById("totalEntries").textContent = allData.length;
}

function updatePaginationControls() {
  const totalPages = Math.ceil(allData.length / pageSize);

  // Update button states
  document.getElementById("firstBtn").disabled = currentPage === 1;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
  document.getElementById("lastBtn").disabled = currentPage === totalPages;

  // Generate page numbers
  const pageNumbersDiv = document.getElementById("pageNumbers");
  pageNumbersDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "pagination-btn" + (i === currentPage ? " active" : "");
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pageNumbersDiv.appendChild(pageBtn);
  }
}

// Event listeners
document.getElementById("firstBtn").addEventListener("click", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(allData.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

document.getElementById("lastBtn").addEventListener("click", () => {
  currentPage = Math.ceil(allData.length / pageSize);
  renderTable();
});

// Initial render
renderTable();

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR FILTERING SECTION
//
// --------------------------------------------------------------------------------------------------------------------------

// Code for adding item to the filter
async function getContinualEventYears(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventYears&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getContinualEventsDivisions(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsDivisions&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function sortDivisions(divisions) {
  // Define custom order
  const customOrder = [
    "MPO",
    "MPG",
    "FPO",
    "FPG",
    "MA40",
    "MP40",
    "FA40",
    "FP40",
    "MA50",
    "MP50",
    "FA50",
    "FP50",
    "MA55",
    "MP55",
    "FA55",
    "FP55",
    "MA60",
    "MP60",
    "FA60",
    "FP60",
    "MA65",
    "MP65",
    "FA65",
    "FP65",
    "MA70",
    "MP70",
    "FA70",
    "FP70",
    "MA75",
    "MP75",
    "FA75",
    "FP75",
    "MA80",
    "MP80",
    "FA80",
    "FP80",
    "MJ18",
    "FJ18",
    "MJ15",
    "FJ15",
    "MJ12",
    "FJ12",
    "MJ10",
    "FJ10",
    "MJ08",
    "FJ08",
    "MJ06",
    "FJ06",
  ];

  // Sort based on custom order
  return divisions.sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    // If division not in custom order, put it at the end
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

async function processFilterEvent() {
  const years = await getContinualEventYears(continualId);
  const yearList = years.map((item) => item.year);
  const yearNumbers = years.map((item) => parseInt(item.year));
  addYearList(yearNumbers);

  const eventDivisions = await getContinualEventsDivisions(continualId);
  const allDivisions = eventDivisions.flatMap((event) => event.divisions);
  const uniqueDivisions = [...new Set(allDivisions)];
  const sortedDivisions = sortDivisions(uniqueDivisions);

  addDivisionList(sortedDivisions);
}

// Call it
processFilterEvent();

// Add list of years in that continual event to the filter option
function addYearList(availableYears) {
  availableYears.reverse();
  const yearSelect = document.getElementById("year");
  yearSelect.innerHTML = "";
  const newOption = document.createElement("option");
  newOption.textContent = "All Years";
  newOption.value = "All Years";
  yearSelect.appendChild(newOption);
  availableYears.forEach((year) => {
    const newOption = document.createElement("option");
    newOption.textContent = year;
    newOption.value = year;
    yearSelect.appendChild(newOption);
  });
}

// Add list of divisions in that continual event to the filter option
function addDivisionList(divisions) {
  const divisionSelect = document.getElementById("division");
  divisionSelect.innerHTML = "";
  const newOption = document.createElement("option");
  newOption.textContent = "All Divisions";
  newOption.value = "All Divisions";
  divisionSelect.appendChild(newOption);
  divisions.forEach((division) => {
    const newOption = document.createElement("option");
    newOption.textContent = division;
    newOption.value = division;
    divisionSelect.appendChild(newOption);
  });
}

// When Year Filter is selected-----------------------------
const yearSelect = document.getElementById("year");

yearSelect.addEventListener("change", function () {
  const selectedYear = yearSelect.value;
  console.log("The currently selected year is:", selectedYear);
  if (selectedYear === "All Years") {
    console.log("Showing data for all years.");
  } else {
    console.log(`Filtering data for the year ${selectedYear}.`);
  }
});

console.log(yearSelect.value);

// When Division Filter is selected-----------------------------
const divisionSelect = document.getElementById("division");

divisionSelect.addEventListener("change", function () {
  const selectedDivision = divisionSelect.value;
  console.log("The currently selected division is:", selectedDivision);
  if (selectedDivision === "All Divisions") {
    console.log("Showing data for all divisions.");
  } else {
    console.log(`Filtering data for the division ${selectedDivision}.`);
  }
});

console.log(divisionSelect.value);

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR VISUALIZATION BUTTON CLICKED
//
// --------------------------------------------------------------------------------------------------------------------------

// Manage current active button for viz section
// --- Placeholder Visualization Functions ---
// These functions will contain the actual ECharts rendering logic.
function renderParticipantsTrend() {
  getContinualEventsParticipants(continualId).then((data) => {
    const title = {
      text:
        "Participants Trend " +
        data[0].year +
        " - " +
        data[data.length - 1].year,
    };
    const legend = {
      data: ["Participants"],
    };
    const yearList = data.map((event) => {
      return event.year;
    });
    const xAxis = {
      data: yearList,
      name: "Year",
    };
    const yAxis = {
      name: "Total Participants", // Set your Y-axis label here
      nameLocation: "middle", // Position the label in the middle of the axis
      nameGap: 50, // Adjust the distance between the label and the axis line
      axisLabel: {
        formatter: "{value}", // Optional: Format the individual axis tick labels
      },
    };
    const playerCounts = data.map((event) => {
      return event.player_count;
    });
    const series = [
      {
        name: "Participants",
        data: playerCounts,
        type: "line",
      },
    ];
    const tooltip = {
      // Formats the value for all series
      valueFormatter: (value) => {
        if (value === null || value === undefined) {
          return "-";
        }
        return value.toLocaleString() + " players";
      },
    };
    createChart(title, legend, xAxis, yAxis, series, tooltip);
  });
}

function renderPrizeMoneyAnalysis() {
  getContinualEventsWithPrizes(continualId).then((data) => {
    const title = {
      text: "Total Prize " + data[0].year + " - " + data[data.length - 1].year,
    };
    const legend = {
      data: ["Total Prize"],
    };
    const yearList = data.map((event) => {
      return event.year;
    });
    const xAxis = {
      data: yearList,
      name: "Year",
    };
    const yAxis = {
      type: "value",
      name: "Total Prize Money", // Set your Y-axis label here
      nameLocation: "middle", // Position the label in the middle of the axis
      nameGap: 50, // Adjust the distance between the label and the axis line
      axisLabel: {
        formatter: "$ {value}", // Optional: Format the individual axis tick labels
      },
    };
    const totalPrize = data.map((event) => {
      return event.total_prize;
    });
    const series = [
      {
        name: "Total Prize",
        data: totalPrize,
        type: "line",
      },
    ];
    const tooltip = {
      // Formats the value for all series
      valueFormatter: (value) => {
        if (value === null || value === undefined) {
          return "-";
        }
        return "$" + value.toLocaleString();
      },
    };
    createChart(title, legend, xAxis, yAxis, series, tooltip);
  });
}

function renderAverageRatings() {
  getContinualEventsAverageRatingByDivision(continualId).then((data) => {
    if (!data || data.length === 0) {
      console.error("No rating data available");
      return;
    }

    // Sort divisions using your existing sortDivisions function
    const sortedData = data.sort((a, b) => {
      const customOrder = [
        "MPO",
        "MPG",
        "FPO",
        "FPG",
        "MA40",
        "MP40",
        "FA40",
        "FP40",
        "MA50",
        "MP50",
        "FA50",
        "FP50",
        "MA55",
        "MP55",
        "FA55",
        "FP55",
        "MA60",
        "MP60",
        "FA60",
        "FP60",
        "MA65",
        "MP65",
        "FA65",
        "FP65",
        "MA70",
        "MP70",
        "FA70",
        "FP70",
        "MA75",
        "MP75",
        "FA75",
        "FP75",
        "MA80",
        "MP80",
        "FA80",
        "FP80",
        "MJ18",
        "FJ18",
        "MJ15",
        "FJ15",
        "MJ12",
        "FJ12",
        "MJ10",
        "FJ10",
        "MJ08",
        "FJ08",
        "MJ06",
        "FJ06",
      ];
      const indexA = customOrder.indexOf(a.division);
      const indexB = customOrder.indexOf(b.division);
      if (indexA === -1 && indexB === -1)
        return a.division.localeCompare(b.division);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const title = {
      text: "Average Event Rating by Division",
    };

    const legend = {
      data: ["Average Rating"],
    };

    const divisionList = sortedData.map((item) => item.division);

    const xAxis = {
      type: "category",
      data: divisionList,
      name: "Division",
      axisLabel: {
        rotate: 45, // Rotate labels if there are many divisions
      },
    };

    const yAxis = {
      type: "value",
      name: "Average Rating",
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: {
        formatter: "{value}",
      },
    };

    const avgRatings = sortedData.map((item) => item.avg_rating);

    const series = [
      {
        name: "Average Rating",
        data: avgRatings,
        type: "bar",
        itemStyle: {
          color: "#5470c6",
        },
      },
    ];

    const tooltip = {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const dataIndex = params[0].dataIndex;
        const item = sortedData[dataIndex];
        return (
          `<strong>${item.division}</strong><br/>` +
          `Average Rating: ${item.avg_rating}<br/>` +
          `Total Players: ${item.player_count.toLocaleString()}`
        );
      },
    };

    createChart(title, legend, xAxis, yAxis, series, tooltip);
  });
}

function renderDiffRating() {
  getContinualEventsDiffRating(continualId).then((data) => {
    if (!data || data.length === 0) {
      console.error("No rating difference data available");
      return;
    }

    const title = {
      text:
        "Difference in Rating " +
        data[0].year +
        " - " +
        data[data.length - 1].year,
    };

    const legend = {
      data: ["Average Rating Difference"],
    };

    const yearList = data.map((event) => {
      return event.year;
    });

    const xAxis = {
      data: yearList,
      name: "Year",
    };

    const yAxis = {
      type: "value",
      name: "Average Rating Difference",
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: {
        formatter: "{value}",
      },
    };

    const ratingDifferences = data.map((event) => {
      return event.avg_diff_rating;
    });

    const series = [
      {
        name: "Average Rating Difference",
        data: ratingDifferences,
        type: "line",
      },
    ];

    const tooltip = {
      trigger: "axis",
      axisPointer: {},
      formatter: null,
      valueFormatter: (value) => {
        if (value === null || value === undefined) {
          return "-";
        }
        return value.toFixed(2) + " points";
      },
    };

    createChart(title, legend, xAxis, yAxis, series, tooltip);
  });
}

// --- Main Handler Function ---
function handleVizButtonClick(buttonText) {
  // The 'buttonText' determines which specific visualization function to call.
  switch (buttonText) {
    case "Participants Trend":
      renderParticipantsTrend();
      break;

    case "Prize Money Analysis":
      renderPrizeMoneyAnalysis();
      break;

    case "Average Ratings":
      renderAverageRatings();
      break;

    case "Difference in Rating":
      renderDiffRating();
      break;

    default:
      console.error("Unknown visualization button:", buttonText);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const vizButtons = document.querySelectorAll(".viz-button");

  // 1. Add click handlers for interaction
  vizButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all
      vizButtons.forEach((btn) => btn.classList.remove("active"));

      // Set the clicked button as active
      this.classList.add("active");

      // Get the text and execute the handler
      const buttonText = this.textContent.trim();
      handleVizButtonClick(buttonText);
    });
  });
});

function renderSelectedVizButton() {
  const initialActiveButton = document.querySelector(".viz-button.active");

  if (initialActiveButton) {
    const initialButtonText = initialActiveButton.textContent.trim();
    handleVizButtonClick(initialButtonText);
  } else if (vizButtons.length > 0) {
    // If no button has 'active' set in HTML, activate the first one by default
    const firstButton = vizButtons[0];
    firstButton.classList.add("active");
    console.log(
      `No active button found. Defaulting to: ${firstButton.textContent.trim()}`
    );
    handleVizButtonClick(firstButton.textContent.trim());
  }
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR ECHART CREATION
//
// --------------------------------------------------------------------------------------------------------------------------

function createChart(title, legend, xAxis, yAxis, series, tooltip) {
  // Initialize the echarts instance based on the prepared dom
  var myChart = echarts.init(document.getElementById("viz"));

  myChart.clear();

  // Specify the configuration items and data for the chart
  var option = {
    title: title,
    tooltip: tooltip,
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series,
  };

  // Display the chart using the configuration items and data just specified.
  myChart.setOption(option);
}
