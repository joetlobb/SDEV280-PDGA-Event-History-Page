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