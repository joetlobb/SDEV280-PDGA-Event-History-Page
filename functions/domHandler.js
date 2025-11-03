import { getPlayerCountOnContinualEvent } from "./queries.js";

export async function updateStatCards(id) {
  let data = await getPlayerCountOnContinualEvent(id);
  console.log(data)
  document.getElementById('stat-total-players').textContent = data[0]['players_count'].toLocaleString();
}
