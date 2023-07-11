/**
 * getUsersByRole.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../Biome.js";
import { Title } from "./List.js";

export default function getUsersByRole(role){
    const List = web.getListDetails(Title);
    return service.get(`${List.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `Role eq '${role}'`,
    })
    .then(data => data.d)
    .then(data => data.results);
}