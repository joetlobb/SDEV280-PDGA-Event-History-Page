import { getRecurringEventCountOnContinualEvent, getPlayerCountOnContinualEvent, getAvgPlayerCountOnContinualEvent, getTotalPrizeOnContinualEvent } from "./queries.js";

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
  document.getElementById('stat-detail-total-event').textContent = `Since ${statData['start_year']}`;
  document.getElementById('stat-total-players').textContent = statData['players_count'].toLocaleString();
  document.getElementById('stat-avg-players').textContent = statData['avg_players_count'].toLocaleString();

  if (statData['total_prize'] > 1000000) {
    document.getElementById('stat-total-prize').textContent = '$' + (statData['total_prize'] / 1000000).toFixed(1) + 'M';
  } else {
    document.getElementById('stat-total-prize').textContent = '$' + statData['total_prize'].toLocaleString();
  }
}
