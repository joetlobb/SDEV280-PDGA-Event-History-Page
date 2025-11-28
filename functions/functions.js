export function processTierData(item) {
  // Process tier data
  switch (item.tier) {
    case "M":
      item.tierCode = "tier-m";
      item.tier = "Major";
      break;
    case "NT":
      item.tierCode = "tier-es";
      item.tier = "Elite";
      break;
    case "A":
      item.tierCode = "tier-a";
      item.tier = "Tier-A";
      break;
    case "B":
      item.tierCode = "tier-b";
      item.tier = "Tier-B";
      break;
    case "C":
      item.tierCode = "tier-c";
      item.tier = "Tier-C";
      break;
    case "XA":
      item.tierCode = "tier-xa";
      item.tier = "Tier-XA";
      break;
    case "XB":
      item.tierCode = "tier-xb";
      item.tier = "Tier-XB";
      break;
    case "XC":
      item.tierCode = "tier-xc";
      item.tier = "Tier-XC";
      break;
    case "XM":
      item.tierCode = "tier-xm";
      item.tier = "Tier-XM";
      break;
    default:
      break;
  }

  return item;
}

export const customDivisionOrder = [
  "MPO",
  "FPO",
  "MPG",
  "FPG",
  "MA40",
  "MP40",
  "FA40",
  "FP40",
  "MA50",
  "MP50",
  "FA50",
  "FP50",
  "MA55",
  "MP55",
  "FA55",
  "FP55",
  "MA60",
  "MP60",
  "FA60",
  "FP60",
  "MA65",
  "MP65",
  "FA65",
  "FP65",
  "MA70",
  "MP70",
  "FA70",
  "FP70",
  "MA75",
  "MP75",
  "FA75",
  "FP75",
  "MA80",
  "MP80",
  "FA80",
  "FP80",
  "MJ18",
  "FJ18",
  "MJ15",
  "FJ15",
  "MJ12",
  "FJ12",
  "MJ10",
  "FJ10",
  "MJ08",
  "FJ08",
  "MJ06",
  "FJ06",
];

export function sortDivisions(divisions) {
  // Sort based on custom Division Order
  return divisions.sort((a, b) => {
    const indexA = customDivisionOrder.indexOf(a);
    const indexB = customDivisionOrder.indexOf(b);

    // If division not in custom Division order, put it at the end
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

export function sortingEventsByDate(events) {
  return events.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA;
  });
}

export const customTierOrder = [
  "Major",
  "Elite",
  "Tier-A",
  "Tier-B",
  "Tier-C",
  "Tier-XA",
  "Tier-XB",
  "Tier-XC",
  "Tier-XD",
];

export function sortTiers(tiers) {
  // Sort based on custom tier Order
  return tiers.sort((a, b) => {
    const indexA = customTierOrder.indexOf(a);
    const indexB = customTierOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

export function deepCopyMapOfObjects(originalMap) {
  // 1. Convert the Map entries into an array of [key, value] pairs.
  // 2. Map over this array.
  // 3. For each pair [key, value], create a new pair:
  //    - The key remains the same (assuming keys are primitives or safe to copy by reference).
  //    - The value (the object) is deep-copied using JSON methods (or structuredClone for modern environments).

  return new Map(
    Array.from(originalMap, ([key, value]) => {
      // Create a new, independent copy of the object
      const clonedValue = JSON.parse(JSON.stringify(value));

      // Return the new [key, clonedValue] pair
      return [key, clonedValue];
    })
  );
};

export function mergeEventResultAndDetail(eventsResult, pastEventsList) {
  return eventsResult.map((result) => {
    const eventDetail = pastEventsList.find(
      (event) => event.pdga_event_id === result.pdga_event_id
    );
    return {
      ...result,
      ...eventDetail,
    };
  });
  /* [{}, {}, ...]
      { cash,
        city,
        country,
        division,
        end_date,
        event_name,
        evt_rating,
        id,
        name,
        num_rounds,
        pdga_event_id,
        pdga_number,
        place,
        player_name,
        players_count,
        pre_rating,
        start_date,
        state,
        tier,
        total_prize,
        total_score,
        tournament_director,
        website_url,
        year }
  */
};