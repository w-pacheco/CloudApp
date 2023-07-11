/**
 * Uninstall.js
 * @author Wilfredo Pacheco
 */

import { SiteCollectionLists } from "../../app.settings.js";
import { service, web, name as biome } from "../Biome.js";

/** Sweetalert definition; */
const icon = 'warning';
const text = `Are you sure you want to DELETE ALL lists, columns, & data created by this application?`;
const buttons = {
    cancel: {
        text: "Cancel",
        value: false,
        visible: true,
    },
    confirm: {
        text: "Confirm",
        value: true,
        visible: true,
    },
}

export default async function Uninstall(){

    const response = await swal({
        icon,
        text,
        buttons,
    });

    if (response)
    {
        for (const ListDefinition of SiteCollectionLists)
        {
            const { List } = ListDefinition;
            const InstalledList = web.getListDetails(List.Title);
            await service.Delete(InstalledList.__metadata.uri);
        }
        alert('Your application successfully uninstalled! Redirecting to Site Contents!');
        return location.replace(`${web.Url}/_layouts/15/viewlsts.aspx`);
    }

    else console.info(`%c${biome} | Uninstall was cancelled!`, 'color: gold');

}