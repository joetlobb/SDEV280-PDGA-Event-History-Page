// --------------------------------------------------------------------------------------------------------------------------
//
//                                               VISUALIZATION SECTION QUERIES
//
// --------------------------------------------------------------------------------------------------------------------------
export async function getContinualEventsParticipants(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsParticipants&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getContinualEventsWithPrizes(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsWithPrizes&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getContinualEventsAverageRatingByDivision(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getContinualEventsAverageRatingByDivision&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

//difference in rating visulization
export async function getContinualEventsDiffRating(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/diffRatingQuery.php?queryType=getContinualEventsDiffRating&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching rating difference data:", error);
    return [];
  }
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               ALL EVENTS STATS QUERIES
//
// --------------------------------------------------------------------------------------------------------------------------

export async function getTotalEvents() {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getTotalEvents`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getTotalPlayers() {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getTotalPlayers`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getAvgPlayersPerEvent() {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getAvgPlayersPerEvent`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getTotalPrize() {
  try {
    const url = `https://coderelic.greenriverdev.com/query.php?queryType=getTotalPrize`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// export function updateStatCards(statData) {
//   document.getElementById("stat-total-events").textContent =
//     statData["total_events"];
//   document.getElementById("stat-total-players").textContent =
//     statData["total_players"].toLocaleString();
//   document.getElementById("stat-avg-players").textContent =
//     statData["avg_players_per_event"];
//   document.getElementById("stat-total-prize").textContent =
//     "$" + Math.round(statData["total_prize"] / 1000000, 1) + "M";
// }

export async function getPlayerCountOnContinualEvent(continualId) {
  try {
    const url = `https://coderelic.greenriverdev.com/query_sprint3.php?queryType=getPlayerCountOnContinualEvent&continualId=${continualId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}
