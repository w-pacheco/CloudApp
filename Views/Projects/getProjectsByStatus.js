/**
 * getProjectsByStatus.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function getProjectsByStatus(status){
    const list = web.getListDetails(Title);
    return service.get(`${list.__metadata.uri}/Items`, {
        $select: 'Id,Project,GUID',
        $filter: `Status eq '${status}'`,
    })
    .then(data => data.d)
    .then(data => data.results);
}