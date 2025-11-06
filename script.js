import {
  getContinualEventsParticipants,
  getContinualEventsWithPrizes,
  getContinualEventsAverageRatingByDivision,
  getContinualEventsDiffRating,
  getAllEventsID,
  getAllEventsDetails,
  getPastEvents,
  getPlayersByPdgaNumbers,
  getParticipantsAndPrizesPerYearByPdgaEventIds,
} from "./functions/queries.js";
import {
  clearTable,
  createClickableRow,
  fillEmptyRows,
  updateStatCards,
  updateEventDateRange,
  relocatePaginationControls,
  activateBackToAllEventsBtn,
} from "./functions/domHandler.js";
import {
  initPagination,
  getPaginationInfo,
  getCurrentPageData,
  updatePaginationInfo,
  updatePaginationControls,
} from "./functions/pagination.js";
import { processTierData } from "./functions/functions.js";

const allEventsData = [];
let recentEventsList = [];
let pastEventsList = [];
let selectedEvent;
let continualId;

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR INITIAL LOAD UP
//
// --------------------------------------------------------------------------------------------------------------------------

(async function processAllEventsData() {
  const allEventsId = await getAllEventsID();
  const allEventsDetails = await getAllEventsDetails();
  allEventsDetails.forEach((event) => {
    const newId =
      allEventsId.find((e) => e.pdga_event_id === event.pdga_event_id)?.id ||
      null;
    const newName =
      allEventsId.find((e) => e.pdga_event_id === event.pdga_event_id)?.name ||
      null;
    allEventsData.push({
      ...event,
      id: newId,
      name: newName,
    });
  });

  const latestEventsMap = allEventsData.reduce((accumulator, currentEvent) => {
    const currentId = currentEvent.id;
    if (
      !accumulator[currentId] ||
      currentEvent.year > accumulator[currentId].year
    ) {
      accumulator[currentId] = currentEvent;
    }
    return accumulator;
  }, {});
  const latestEventsArray = Object.values(latestEventsMap);

  const sortedLatestEvents = sortingEventsByDate(latestEventsArray);

  recentEventsList = sortedLatestEvents;
  initPagination(recentEventsList, renderTable);
  activateBackToAllEventsBtn()
})();

function sortingEventsByDate(events) {
  return events.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA;
  });
}

// async function updatePastEventsList(id) {
//   const pastEvents = await getPastEvents(id);

//   const pdgaNumbers = [];

//   pastEvents.forEach(event => {
//     pdgaNumbers.push(event.pdga_number);
//   })

//   const playersData = await getPlayersByPdgaNumbers(pdgaNumbers);

//   pastEvents.forEach(event => {
//     const player = playersData.find(p => String(p.pdga_number) === String(event.pdga_number));
//     event.player_name = player ? `${player.first_name} ${player.last_name}` : "N/A";
//   });

//   pastEventsData = pastEvents;
//   console.log(pastEvents);
//   initPagination(pastEventsData, renderPastEventsTable);
// }

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               SEARCH FUNCTIONALITY
//
// --------------------------------------------------------------------------------------------------------------------------

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

// Handle search form submission (works on both pages)
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Redirect to search page with search query
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  });
}

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
  document.getElementById("event-city").textContent = selectedEvent.city;
  document.getElementById("event-state").textContent = selectedEvent.state;
  document.getElementById("event-country").textContent = selectedEvent.country;
  document.getElementById("event-director").textContent =
    selectedEvent.tournament_director || "N/A";

  renderPastEventsTable();

  // Smooth scroll to the event section
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
      tierLabel = "PDGA Major";
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
//                                               RENDER TABLE
//
// --------------------------------------------------------------------------------------------------------------------------

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  const { data: pageData } = getCurrentPageData();
  const { pageSize } = getPaginationInfo();

  // Clear table
  clearTable("tableBody");

  // Add data rows
  pageData.forEach((item) => {
    item = processTierData(item);

    const rowContent = `
      <td>${item.name}</td>
      <td>${item.start_date}</td>
      <td><span class="tier-badge ${item.tierCode}">${item.tier}</span></td>
      <td>${item.city}</td>
      <td>${item.state}</td>
      <td>${item.country}</td>
    `;

    const row = createClickableRow(rowContent, async () => {
      selectedEvent = item;
      continualId = item.id;
      const unsortedSelectedEvent = allEventsData.filter(
        (event) => event.id === continualId
      );
      const pdgaEventIds = [];
      unsortedSelectedEvent.forEach((event) => {
        pdgaEventIds.push(event.pdga_event_id);
      });
      const additionalData =
        await getParticipantsAndPrizesPerYearByPdgaEventIds(pdgaEventIds);
      console.log(additionalData);

      const newUnsortedSelectedEvent = [];
      unsortedSelectedEvent.forEach((event) => {
        const playersCount =
          additionalData.find((e) => e.pdga_event_id === event.pdga_event_id)
            ?.players_count || "N/A";
        const totalPrize =
          additionalData.find((e) => e.pdga_event_id === event.pdga_event_id)
            ?.total_prize || "N/A";
        newUnsortedSelectedEvent.push({
          ...event,
          players_count: playersCount,
          total_prize: totalPrize,
        });
      });

      pastEventsList = sortingEventsByDate(newUnsortedSelectedEvent);
      console.log(pastEventsList);
      renderEvent();

      // move pagination button to the past events table
      const paginationContainer = document.getElementById(
        "pagination-container"
      );
      // const buttonContainer = document.getElementById('btn-container');
      // const parentOfButtonContainer = buttonContainer ? buttonContainer.parentElement : null;
      const newParent = document.getElementById('past-events-table')
      relocatePaginationControls(paginationContainer, newParent);
      document.getElementById("past-events-table").style.display = 'block';
      document.getElementById('btn-container').style.display = 'flex';
      document.getElementById("events-table").style.display = "none";

      initPagination(pastEventsList, renderPastEventsTable);
    });

    tableBody.appendChild(row);
  });

  // Fill empty rows
  fillEmptyRows(tableBody, pageData.length, pageSize, 6);

  // Update pagination UI
  updatePaginationInfo();
  updatePaginationControls();
}

function renderPastEventsTable() {
  const tableBody = document.getElementById("past-events-body");
  const { data: pageData } = getCurrentPageData();
  const { pageSize } = getPaginationInfo();

  // Clear table
  clearTable("past-events-body");

  // Add data rows
  pageData.forEach((item) => {
    const total_prize =
      item.total_prize === "N/A"
        ? "N/A"
        : `$${(+item.total_prize).toLocaleString()}`;

    const rowContent = `
      <td>${item.year}</td>
      <td>${item.event_name}</td>
      <td>${item.start_date}</td>
      <td>${item.players_count}</td>
      <td>${total_prize}</td>
    `;

    const row = createClickableRow(rowContent, () => {
      window.open(item.website_url, "_blank");
    });
    tableBody.appendChild(row);
  });

  // Fill empty rows
  fillEmptyRows(tableBody, pageData.length, pageSize, 5);

  // Update pagination UI
  updatePaginationInfo();
  updatePaginationControls();
}

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
