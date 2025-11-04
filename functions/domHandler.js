import {
  getRecurringEventCountOnContinualEvent,
  getPlayerCountOnContinualEvent, getAvgPlayerCountOnContinualEvent,
  getTotalPrizeOnContinualEvent, getEventDateRange, getPastEvents, getPlayersByPdgaNumbers
} from "./queries.js";

export function clearTable(element) {
  if (element) {
    element.innerHTML = "";
  }
}

export function createClickableRow(content, clickHandler) {
  const row = document.createElement("tr");
  row.innerHTML = content;
  row.addEventListener("click", clickHandler);
  return row;
}

export function fillEmptyRows(tableBody, currentRowCount, pageSize, columnCount) {
  const rowsToFill = pageSize - currentRowCount;

  for (let i = 0; i < rowsToFill; i++) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";
    emptyRow.innerHTML = '<td>&nbsp;</td>'.repeat(columnCount);
    tableBody.appendChild(emptyRow);
  }
}

export async function updateStatCards(id) {
  const statData = {};

  const [eventsData, playersData, avgPlayersData, prizeData] =
    await Promise.all([
      getRecurringEventCountOnContinualEvent(id),
      getPlayerCountOnContinualEvent(id),
      getAvgPlayerCountOnContinualEvent(id),
      getTotalPrizeOnContinualEvent(id),
    ]);

  statData.events_count = (eventsData?.[0] || {})["events_count"];
  statData.start_year = (eventsData?.[0] || {})["start_year"];
  statData.players_count = (playersData?.[0] || {})["players_count"];
  statData.avg_players_count = +(avgPlayersData?.[0] || {})["avg_players_count"];
  statData.total_prize = +(prizeData?.[0] || {})["total_prize"];

  document.getElementById('stat-total-events').textContent = statData['events_count'].toLocaleString();
  document.getElementById('stat-detail-total-event').textContent = `Running Since ${statData['start_year']}`;
  document.getElementById('stat-total-players').textContent = statData['players_count'].toLocaleString();
  document.getElementById('stat-avg-players').textContent = statData['avg_players_count'].toLocaleString();

  if (statData['total_prize'] > 1000000) {
    document.getElementById('stat-total-prize').textContent = '$' + (statData['total_prize'] / 1000000).toFixed(1) + 'M';
  } else {
    document.getElementById('stat-total-prize').textContent = '$' + statData['total_prize'].toLocaleString();
  }
}

export async function updateEventDateRange(id) {
  const dateData = await getEventDateRange(id);
  if (dateData && dateData.length > 0) {
    const start_year = dateData[0]['start_year'];
    const end_year = dateData[0]['end_year'];

    document.getElementById('event-dates').textContent = `${start_year} - ${end_year}`;
  }
}

// Update Past Events List with Player Names
export async function updatePastEventsList(id) {
  const pastEvents = await getPastEvents(id);

  const pdgaNumbers = [];

  pastEvents.forEach(event => {
    pdgaNumbers.push(event.pdga_number);
  })

  const playersData = await getPlayersByPdgaNumbers(pdgaNumbers);

  pastEvents.forEach(event => {
    const player = playersData.find(p => String(p.pdga_number) === String(event.pdga_number));
    event.player_name = player ? `${player.first_name} ${player.last_name}` : "N/A";
  });

  console.log(pastEvents);
  updatePastEventsTableHeaders();
  return pastEvents;
}

// Update Table Headers for Past Events
export function updatePastEventsTableHeaders() {
  document.getElementById("tableName").textContent = "Past Events";

  const tableHead = document.getElementById("tableHead");
  clearTable(tableHead);
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
      <th>Event Name</th>
      <th>Date</th>
      <th>Division</th>
      <th>Winner</th>
    `;
  tableHead.appendChild(headerRow);
}

export function renderPastEventsTable(pastEvents) {
  const tableBody = document.getElementById("tableBody");
  clearTable(tableBody);

  pastEvents.forEach((event) => {
    const rowContent = `
      <td>${event.event_name}</td>
      <td>${event.start_date}</td>
      <td>${event.division}</td>
      <td>${event.player_name}</td>
    `;

    const row = createClickableRow(rowContent, () => {
      const webSiteLink = event.website_url;
      window.open(webSiteLink, '_blank');
    });

    tableBody.appendChild(row);
  });

  fillEmptyRows(tableBody, pageData.length, pageSize, 4);

  // Update pagination UI
  updatePaginationInfo();
  updatePaginationControls();
}
// Render Past Events Table
