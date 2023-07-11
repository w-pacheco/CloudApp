/**
 * createQuestion.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function createQuestion(request){

    const list = web.getListDetails(Title);
    const type = list.ListItemEntityTypeFullName;

    request = Object.assign(request, {
        __metadata: {
            type,
        },
    });

    return service.post(`${list.__metadata.uri}/Items`, request)
    .then(data => data.d)
    .then(data => data.results);
    
}