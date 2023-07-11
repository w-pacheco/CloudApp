/**
 * createLocationRequest.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../../src/Biome.js";
import { Title } from "./List.js";

export default async function createLocationRequest({ DCIRNumber, MarketName, LocationName }){

    /** TODO: Get the administrators or developers; */
    console.info('Get the administrators or developers for notification;');
    const List = web.getListDetails(Title);

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = `${__metadata.uri}/Items`;

    const request = {
        DCIRNumber,
        MarketName,
        LocationName,
        __metadata: {
            type: ListItemEntityTypeFullName,
        },
    }

    return service.Post(Url, request)
    .done(function(data, textStatus, xhr){
        if (xhr.status >= 200 && xhr.status < 300) console.info(`Facility Request successful!`);
        return data;
    });

}