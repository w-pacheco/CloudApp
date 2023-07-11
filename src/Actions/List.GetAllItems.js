/**
 * List.GetAllItems.js
 * @author Wilfredo Pacheco
 */

import { web as Web, service as Route } from "../Biome.js";

/**
 * GetAllItems
 * @param {String} list is the title of the list.
 * @param {Object} options additional options passed to the get call for the REST API.
 * @returns promise
 */
export function GetAllItems(list, options){

    const List = Web.getListDetails(list);
    const { uri } = List.__metadata;
    
    return Route.Get(`${
        uri
    }/ItemCount`)
    .then(data => data.d)
    .then(data => data.ItemCount)
    .then(ItemCount => {

        if (options) Object.assign(options, {
            $top: ItemCount,
        });

        else options = {
            $select: '*',
            $top: ItemCount,
        }

        return Route.Get(`${List.__metadata.uri}/Items`, options)
        .then(data => data.d)
        .then(data => data.results);
    })
    .catch(response => {
        console.info(response);
        return response;
    });
}