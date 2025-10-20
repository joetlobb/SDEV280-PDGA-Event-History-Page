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
    console.log(data)

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


