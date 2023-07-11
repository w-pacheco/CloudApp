/**
 * getLocationById.js
 * @author Wilfredo Pacheco
 */

import { web, service } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function getLocationById(id){
    const list = web.getListDetails(Title);
    return service.Get(`${list.__metadata.uri}/Items(${id})`, {
        $select: '*',
    }).then(data => data.d);
}