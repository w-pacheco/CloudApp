/**
 * getRequestByDCIR.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../src/Biome.js";
import { Title } from "./List.js";

export default function getRequestByDCIR(dcir){
    const list = web.getListDetails(Title);
    return service.Get(`${list.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `DCIRNumber eq '${dcir}'`,
    }).then(data => data.d.results[0]);
}