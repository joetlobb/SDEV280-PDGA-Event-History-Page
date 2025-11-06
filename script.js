import {
  getAllEventsID,
  getAllEventsDetails,
  getParticipantsAndPrizesPerYearByPdgaEventIds,
  clearTable,
  createClickableRow,
  fillEmptyRows,
  relocatePaginationControls,
  activateBackToAllEventsBtn,
  initPagination,
  getPaginationInfo,
  getCurrentPageData,
  updatePaginationInfo,
  updatePaginationControls,
  processTierData,
  sortingEventsByDate,
  renderPastEventsTable,
  renderEventDetails,
  renderParticipantsTrend,
  renderPrizeMoneyAnalysis,
  renderAverageRatings,
  renderDiffRating,
  activateVizSelectionBtn,
  renderSelectedVizButton,
} from "./functions/index.js";

const allEventsData = [];
let recentEventsList = [];
let selectedEvent;
let pastEventsList = [];
let continualId;

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               Initialization Code
//
// --------------------------------------------------------------------------------------------------------------------------

(async () => {
  const [allEventsId, allEventsDetails] = await Promise.all([
    getAllEventsID(),
    getAllEventsDetails(),
  ]);

  // map all events with continualId
  allEventsDetails.forEach((event) => {
    // continualId = newId
    const newId =
      allEventsId.find((e) => e.pdga_event_id === event.pdga_event_id)?.id ||
      null;

    // name = eventgeneric name
    const newName =
      allEventsId.find((e) => e.pdga_event_id === event.pdga_event_id)?.name ||
      null;

    // now assign to allEventsData
    allEventsData.push({
      ...event,
      id: newId,
      name: newName,
    });
  });

  // use reduce to get out only the lastest year of that continual event
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

  // convert obj to array
  const latestEventsArray = Object.values(latestEventsMap);

  // sort by date
  const sortedLatestEvents = sortingEventsByDate(latestEventsArray);

  // assign to recentEventsList
  recentEventsList = sortedLatestEvents;

  // initialize pagination in recent events table
  initPagination(recentEventsList, renderTable);

  activateVizSelectionBtn();
  activateBackToAllEventsBtn();  
})();

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
//                                               EVENT SELECTED HANDLER
//
// --------------------------------------------------------------------------------------------------------------------------

function renderEvent() {
  // processFilterEvent();
  renderEventDetails(selectedEvent, pastEventsList);
  renderSelectedVizButton();
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

    // Add event listener to the row
    const row = createClickableRow(rowContent, async () => {
      // Assign selectedEvent
      selectedEvent = item;

      // Assign selectedEvent continualId
      continualId = item.id;

      // Get selectedEvent data from allEventsData
      const unsortedSelectedEvent = allEventsData.filter(
        (event) => event.id === continualId
      );

      // Gather all pdga_event_id for query additional data (players count and total prize)
      const pdgaEventIds = [];
      unsortedSelectedEvent.forEach((event) => {
        pdgaEventIds.push(event.pdga_event_id);
      });
      const additionalData =
        await getParticipantsAndPrizesPerYearByPdgaEventIds(pdgaEventIds);

      // Map to new array
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
      renderEvent();

      // move pagination button to the past events table
      const paginationContainer = document.getElementById(
        "pagination-container"
      );
      const newParent = document.getElementById("past-events-table");
      relocatePaginationControls(paginationContainer, newParent);

      // Adjust CSS accordingly
      document.getElementById("past-events-table").style.display = "block";
      document.getElementById("btn-container").style.display = "flex";
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

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR VISUALIZATION BUTTON CLICKED
//
// --------------------------------------------------------------------------------------------------------------------------

export function handleVizButtonClick(buttonText) {
  // The 'buttonText' determines which specific visualization function to call.
  switch (buttonText) {
    case "Participants Trend":
      renderParticipantsTrend(pastEventsList);
      break;

    case "Prize Money Analysis":
      renderPrizeMoneyAnalysis(pastEventsList);
      break;

    case "Average Ratings":
      renderAverageRatings(continualId);
      break;

    case "Difference in Rating":
      renderDiffRating(continualId);
      break;

    default:
      console.error("Unknown visualization button:", buttonText);
  }
}