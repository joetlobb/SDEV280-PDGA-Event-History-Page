// Code for participants trend viz

async function getContinualId(continualId) {
    try {
        const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualId&continualId=${continualId}`;     
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const listOfContinualEvents = [];
getContinualId(1).then(data => {
    data.forEach(item => {
        listOfContinualEvents.push(item.pdga_event_id);
    });
    listOfContinualEvents.sort((a, b) => a - b);
    console.log(listOfContinualEvents);
});

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
button1.addEventListener("click", function() {
    getDataFromDatabase().then(data => {
        alert("Total Players: " + data[0]["Total Players"]);
    })
});

// Initialize the echarts instance based on the prepared dom
      var myChart = echarts.init(document.getElementById('viz'));

      // Specify the configuration items and data for the chart
      var option = {
        title: {
          text: 'ECharts Getting Started Example'
        },
        tooltip: {},
        legend: {
          data: ['sales']
        },
        xAxis: {
          data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
        },
        yAxis: {},
        series: [
          {
            name: 'sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };

      // Display the chart using the configuration items and data just specified.
      myChart.setOption(option);


