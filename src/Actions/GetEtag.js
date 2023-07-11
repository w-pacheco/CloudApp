/**
 * GetEtag.js
 * @author Wilfredo Pacheco
 */

import { service, name as biome } from '../Biome.js';

export function GetEtagByURI(uri){
    return service.get(uri, {
        select: 'Id',
    })
    .then(data => data.d)
    .then(data => data.__metadata.etag);
}

export default function GetEtag(arg){

    if (!arg) throw new Error(`${biome} | The argument passed is invalid!`); 
    
    else if (typeof arg === 'string') return GetEtagByURI(arg, {
        select: 'Id',
    });

    else if (typeof arg === 'object' && arg?.__metadata?.uri) return GetEtagByURI(arg.__metadata.uri, {
        select: 'Id',
    });

}