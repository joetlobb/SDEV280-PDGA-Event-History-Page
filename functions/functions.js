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

export const customOrder = [
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
  // Sort based on custom order
  return divisions.sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    // If division not in custom order, put it at the end
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