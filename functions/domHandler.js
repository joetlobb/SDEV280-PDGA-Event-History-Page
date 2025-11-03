import { getRecurringEventCountOnContinualEvent, getPlayerCountOnContinualEvent } from "./queries.js";

export async function updateStatCards(id) {
  const statData = {};

  const [eventsData, playersData] =
    await Promise.all([
      getRecurringEventCountOnContinualEvent(id),
      getPlayerCountOnContinualEvent(id),
    ]);

  statData.events_count = (eventsData?.[0] || {})["events_count"];
  statData.start_year = (eventsData?.[0] || {})["start_year"];
  statData.players_count = (playersData?.[0] || {})["players_count"];
  console.log("Stat Data:", statData);
  document.getElementById('stat-total-events').textContent = statData['events_count'].toLocaleString();
  document.getElementById('stat-detail-total-event').textContent = `Since ${statData['start_year']}`;
  document.getElementById('stat-total-players').textContent = statData['players_count'].toLocaleString();
  //   statData.avg_players_per_event = +(avgPlayersData?.[0] || {})[
  //     "avg_players_count"
  //   ];
  //   statData.total_prize = (prizeData?.[0] || {})["total_prize"];
  //   updateStatCards();
}
