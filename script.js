let continualId = 1;

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


// Code for participants trend viz
async function getContinualEventsComplete(continualId) {
    try {
        const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsComplete&continualId=${continualId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

getContinualEventsComplete(continualId).then(data => {
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
        data: yearList
    }
    const yAxis = {}
    const playerCounts = data.map(event => {
        return event.player_count;
    });
    const series = [{
        name: 'Participants',
        data: playerCounts,
        type: 'line'
    }]
    createChart(title, legend, xAxis, yAxis, series);
})




// Manage current active button for viz section
document.addEventListener('DOMContentLoaded', function() {
    const vizButtons = document.querySelectorAll('.viz-button');
    vizButtons.forEach(button => {
        button.addEventListener('click', function() {
            vizButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});


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


function createChart(title, legend, xAxis, yAxis, series) {
    // Initialize the echarts instance based on the prepared dom
    var myChart = echarts.init(document.getElementById('viz'));

    // Specify the configuration items and data for the chart
    var option = {
        title: title,
        tooltip: {},
        legend: legend,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    };

    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);
}

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
