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