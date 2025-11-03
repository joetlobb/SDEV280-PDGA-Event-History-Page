import { getPlayerCountOnContinualEvent } from "./queries.js";

export async function updateStatCards(id) {
  let data = await getPlayerCountOnContinualEvent(id);
  document.getElementById('stat-total-players').textContent = data[0]['players_count'].toLocaleString();
}
