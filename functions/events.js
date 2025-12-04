import { deepCopyMapOfObjects } from "./functions.js";
import { getEventsResultByPdgaEventIds } from "./queries.js";

export async function processWinterTimeOpenEvents(allEventsMap) {
    const map = deepCopyMapOfObjects(allEventsMap);
    const wintertimeEvents = map.get(28);
    const eventIds = wintertimeEvents.map(e => e.pdga_event_id);
    const data = await getEventsResultByPdgaEventIds(eventIds);
    const proEventIds = data.filter(e => e.division === 'MPO').map(e => e.pdga_event_id);
    const amEventIds = data.filter(e => e.division === 'MA1').map(e => e.pdga_event_id);
    wintertimeEvents.forEach(event => {
        if (proEventIds.includes(event.pdga_event_id)) {
            event.id = 2801;
            event.name = 'Wintertime Open Professional';
        } else if (amEventIds.includes(event.pdga_event_id)) {
            event.id = 2802;
            event.name = 'Wintertime Open Amateur';
        };
        if (!map.get(event.id)) {
            map.set(event.id, []);
        };
        map.get(event.id).push(event);
    });
    map.delete(28);
    return map;
};