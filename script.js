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

async function processYears() {
    const years = await getContinualEventYears(1);
    const yearList = years.map(item => item.year);
    const yearNumbers = years.map(item => parseInt(item.year));
    addYearList(yearNumbers);
}

// Call it
processYears();


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

getContinualEventsComplete(1).then(data => {
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

//---------------------------------------------

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

// Add list of year in that continual event to the filter option
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
