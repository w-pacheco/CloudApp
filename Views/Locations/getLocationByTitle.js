/**
 * getLocationByTitle.js
 * @author Wilfredo Pacheco
 */

import { web, service } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function getLocationByTitle(locationTitle){
    const list = web.getListDetails(Title);
    return service.Get(`${list.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `LocationName eq '${locationTitle}'`,
    }).then(data => data.d.results[0]);
}