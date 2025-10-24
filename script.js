let continualId = 1;
let allData = [];

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR INITIAL LOAD UP 
//
// --------------------------------------------------------------------------------------------------------------------------

async function getAllRecentEventsContinualList() {
    try {
        const url = `https://coderelic.greenriverdev.com/query2.php?queryType=getAllRecentEventsContinualList`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

(async function onPageLoad() {
    let data = await getAllRecentEventsContinualList();
    console.log(data)
    allData = data;
    renderTable()
})();

// --------------------------------------------------------------------------------------------------------------------------
// Pagination

let currentPage = 1;
let pageSize = 5;

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, allData.length);

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const item = allData[i];

        switch (item.tier) {
            case 'M':
                item.tierCode = 'tier-m'
                break;
            case 'NT':
                item.tierCode = 'tier-es'
                item.tier = 'ES'
                break;
            case 'A':
                item.tierCode = 'tier-a'
                break;
            case 'B':
                item.tierCode = 'tier-b'
                break;
            case 'C':
                item.tierCode = 'tier-c'
                break;
            case 'XA':
                item.tierCode = 'tier-xa'
                break;
            case 'XB':
                item.tierCode = 'tier-xb'
                break;
            case 'XC':
                item.tierCode = 'tier-xc'
                break;
            case 'XM':
                item.tierCode = 'tier-xm'
                break;
            default:
                break;
        }

        const row = `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.start_date}</td>
                        <td><span class="tier-badge ${item.tierCode}">${item.tier}</span></td>
                        <td>${item.city}</td>
                        <td>${item.state}</td>
                        <td>${item.country}</td>
                    </tr>
                `;
        tableBody.innerHTML += row;
    }

    const rowsToFill = pageSize - (endIndex - startIndex);
    for (let i = 0; i < rowsToFill; i++) {
        const emptyRow = `
            <tr class="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
        `;
        tableBody.innerHTML += emptyRow;
    }

    updatePaginationInfo();
    updatePaginationControls();
}

function updatePaginationInfo() {
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, allData.length);

    document.getElementById('startEntry').textContent = startEntry;
    document.getElementById('endEntry').textContent = endEntry;
    document.getElementById('totalEntries').textContent = allData.length;
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allData.length / pageSize);

    // Update button states
    document.getElementById('firstBtn').disabled = currentPage === 1;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    document.getElementById('lastBtn').disabled = currentPage === totalPages;

    // Generate page numbers
    const pageNumbersDiv = document.getElementById('pageNumbers');
    pageNumbersDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pageNumbersDiv.appendChild(pageBtn);
    }
}

// Event listeners
document.getElementById('firstBtn').addEventListener('click', () => {
    currentPage = 1;
    renderTable();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(allData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

document.getElementById('lastBtn').addEventListener('click', () => {
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
        console.error('Error:', error);
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
        console.error('Error:', error);
    }
}

function sortDivisions(divisions) {
    // Define custom order
    const customOrder = [
        'MPO', 'MPG', 'FPO', 'FPG',
        'MA40', 'MP40', 'FA40', 'FP40',
        'MA50', 'MP50', 'FA50', 'FP50',
        'MA55', 'MP55', 'FA55', 'FP55',
        'MA60', 'MP60', 'FA60', 'FP60',
        'MA65', 'MP65', 'FA65', 'FP65',
        'MA70', 'MP70', 'FA70', 'FP70',
        'MA75', 'MP75', 'FA75', 'FP75',
        'MA80', 'MP80', 'FA80', 'FP80',
        'MJ18', 'FJ18',
        'MJ15', 'FJ15',
        'MJ12', 'FJ12',
        'MJ10', 'FJ10',
        'MJ08', 'FJ08',
        'MJ06', 'FJ06'
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
    const years = await getContinualEventYears(1);
    const yearList = years.map(item => item.year);
    const yearNumbers = years.map(item => parseInt(item.year));
    addYearList(yearNumbers);

    const eventDivisions = await getContinualEventsDivisions(1);
    const allDivisions = eventDivisions.flatMap(event => event.divisions);
    const uniqueDivisions = [...new Set(allDivisions)];
    const sortedDivisions = sortDivisions(uniqueDivisions)

    addDivisionList(sortedDivisions)
}

// Call it
processFilterEvent();

// Add list of years in that continual event to the filter option
function addYearList(availableYears) {
    availableYears.reverse();
    const yearSelect = document.getElementById('year');
    availableYears.forEach(year => {
        const newOption = document.createElement('option');
        newOption.textContent = year;
        newOption.value = year;
        yearSelect.appendChild(newOption);
    });
}

// Add list of divisions in that continual event to the filter option
function addDivisionList(divisions) {
    const divisionSelect = document.getElementById('division');
    divisions.forEach(division => {
        const newOption = document.createElement('option');
        newOption.textContent = division;
        newOption.value = division;
        divisionSelect.appendChild(newOption);
    });
}


// When Year Filter is selected-----------------------------
const yearSelect = document.getElementById('year');

yearSelect.addEventListener('change', function () {
    const selectedYear = yearSelect.value;
    console.log("The currently selected year is:", selectedYear);
    if (selectedYear === "All Years") {
        console.log("Showing data for all years.");
    } else {
        console.log(`Filtering data for the year ${selectedYear}.`);
    }
});

console.log(yearSelect.value)

// When Division Filter is selected-----------------------------
const divisionSelect = document.getElementById('division');

divisionSelect.addEventListener('change', function () {
    const selectedDivision = divisionSelect.value;
    console.log("The currently selected division is:", selectedDivision);
    if (selectedDivision === "All Divisions") {
        console.log("Showing data for all divisions.");
    } else {
        console.log(`Filtering data for the division ${selectedDivision}.`);
    }
});

console.log(divisionSelect.value)

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR VISUALIZATION SECTION 
//
// --------------------------------------------------------------------------------------------------------------------------
// Code for participants trend viz
async function getContinualEventsParticipants(continualId) {
    try {
        const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsParticipants&continualId=${continualId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Code for total prize trend viz
async function getContinualEventsWithPrizes(continualId) {
    try {
        const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsWithPrizes&continualId=${continualId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR VISUALIZATION BUTTON CLICKED 
//
// --------------------------------------------------------------------------------------------------------------------------

// Manage current active button for viz section
// --- Placeholder Visualization Functions ---
// These functions will contain the actual ECharts rendering logic.
function renderParticipantsTrend() {
    getContinualEventsParticipants(continualId).then(data => {
        const title = {
            text: "Participants Trend " + data[0].year + " - " + data[data.length - 1].year
        };
        const legend = {
            data: ['Participants']
        }
        const yearList = data.map(event => {
            return event.year;
        });
        const xAxis = {
            data: yearList,
            name: 'Year',
        }
        const yAxis = {
            name: 'Total Participants', // Set your Y-axis label here
            nameLocation: 'middle', // Position the label in the middle of the axis
            nameGap: 50, // Adjust the distance between the label and the axis line
            axisLabel: {
                formatter: '{value}' // Optional: Format the individual axis tick labels
            }
        }
        const playerCounts = data.map(event => {
            return event.player_count;
        });
        const series = [{
            name: 'Participants',
            data: playerCounts,
            type: 'line'
        }]
        const tooltip = {
            // Formats the value for all series
            valueFormatter: (value) => {
                if (value === null || value === undefined) {
                    return '-';
                }
                return value.toLocaleString() + ' players';
            }
        }
        createChart(title, legend, xAxis, yAxis, series, tooltip);
    })
}

function renderEventTrendsOverTime() {
    console.log('Rendering: Event Trends Over Time (Tier Distribution)');
    // Logic to fetch data and render a Stacked Bar/Pie chart of Tiers per Year
}

function renderTierDistribution() {
    console.log('Rendering: Tier Distribution (Bar Chart)');
}

function renderGeographicDistribution() {
    console.log('Rendering: Geographic Distribution (Map)');
}

function renderPrizeMoneyAnalysis() {
    getContinualEventsWithPrizes(continualId).then(data => {
        const title = {
            text: "Total Prize " + data[0].year + " - " + data[data.length - 1].year
        };
        const legend = {
            data: ['Total Prize']
        }
        const yearList = data.map(event => {
            return event.year;
        });
        const xAxis = {
            data: yearList,
            name: 'Year',
        }
        const yAxis = {
            type: 'value',
            name: 'Total Prize Money', // Set your Y-axis label here
            nameLocation: 'middle', // Position the label in the middle of the axis
            nameGap: 50, // Adjust the distance between the label and the axis line
            axisLabel: {
                formatter: '$ {value}' // Optional: Format the individual axis tick labels
            }
        }
        const totalPrize = data.map(event => {
            return event.total_prize;
        });
        const series = [{
            name: 'Total Prize',
            data: totalPrize,
            type: 'line'
        }]
        const tooltip = {
            // Formats the value for all series
            valueFormatter: (value) => {
                if (value === null || value === undefined) {
                    return '-';
                }
                return '$' + value.toLocaleString();
            }
        }
        createChart(title, legend, xAxis, yAxis, series, tooltip);
    })
}

function renderAverageRatings() {
    console.log('Rendering: Average Ratings');
}

function renderCourseDifficulty() {
    console.log('Rendering: Course Difficulty');
}

// --- Main Handler Function ---
function handleVizButtonClick(buttonText) {
    // The 'buttonText' determines which specific visualization function to call.
    switch (buttonText) {
        case 'Participants Trend':
            renderParticipantsTrend();
            break;

        case 'Event Trends Over Time':
            renderEventTrendsOverTime();
            break;

        // Assuming 'CLICK ME' is now 'Tier Distribution' or similar
        case 'Tier Distribution':
            renderTierDistribution();
            break;

        case 'Geographic Distribution':
            renderGeographicDistribution();
            break;

        case 'Prize Money Analysis':
            renderPrizeMoneyAnalysis();
            break;

        case 'Average Ratings':
            renderAverageRatings();
            break;

        case 'Course Difficulty':
            renderCourseDifficulty();
            break;

        default:
            console.error('Unknown visualization button:', buttonText);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const vizButtons = document.querySelectorAll('.viz-button');

    // 1. Add click handlers for interaction
    vizButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all
            vizButtons.forEach(btn => btn.classList.remove('active'));

            // Set the clicked button as active
            this.classList.add('active');

            // Get the text and execute the handler
            const buttonText = this.textContent.trim();
            handleVizButtonClick(buttonText);
        });
    });


    // 2. Initial Page Load Logic (To render the first chart)
    // Find the button that is already marked 'active' in the HTML and run its handler.
    const initialActiveButton = document.querySelector('.viz-button.active');

    if (initialActiveButton) {
        const initialButtonText = initialActiveButton.textContent.trim();
        console.log(`Running initial visualization: ${initialButtonText}`);
        handleVizButtonClick(initialButtonText);
    } else if (vizButtons.length > 0) {
        // If no button has 'active' set in HTML, activate the first one by default
        const firstButton = vizButtons[0];
        firstButton.classList.add('active');
        console.log(`No active button found. Defaulting to: ${firstButton.textContent.trim()}`);
        handleVizButtonClick(firstButton.textContent.trim());
    }
});


// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR QUERY TESTING
//
// --------------------------------------------------------------------------------------------------------------------------

// Using fetch API
async function getDataFromDatabase() {
    try {
        const response = await fetch('https://coderelic.greenriverdev.com/query.php?action=countAllPlayers');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function


let button1 = document.getElementById("button1");
button1.addEventListener("click", function () {
    getDataFromDatabase().then(data => {
        alert("Total Players: " + data[0]["Total Players"]);
    })
});

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               CODES FOR ECHART CREATION 
//
// --------------------------------------------------------------------------------------------------------------------------

function createChart(title, legend, xAxis, yAxis, series, tooltip) {
    // Initialize the echarts instance based on the prepared dom
    var myChart = echarts.init(document.getElementById('viz'));

    // Specify the configuration items and data for the chart
    var option = {
        title: title,
        tooltip: tooltip,
        legend: legend,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    };

    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);
}


