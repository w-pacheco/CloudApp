/**
 * getQuestionsByFK.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function getQuestionsByFK(series_fk){

    if (!series_fk) return [];

    const list = web.getListDetails(Title);
    return service.get(`${list.__metadata.uri}/Items`, {
        $select: 'Id,Question,Response,GUID,Modified,Editor/Title',
        $filter: `Series_FK eq '${series_fk}'`,
        $expand: 'Editor/Id',
    })
    .then(data => data.d)
    .then(data => data.results);
    
}