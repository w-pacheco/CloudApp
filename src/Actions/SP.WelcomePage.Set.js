/**
 * SP.WelcomePage.Set.js
 * @description Changes the current landing page to the Microsoft Sharepoint Site Collection;
 * @reference https://sharepoint.stackexchange.com/questions/271996/set-make-homepage-rest-api
 * @author Wilfredo Pacheco
 */

import { service, web } from "../Biome.js";

/**
 * SetWelcomePage
 * @param {String} LandingPage String where the new landing page is located: SitePages/Home.aspx
 * @returns REST api call to rootfolder;
 */
export default async function SetWelcomePage(WelcomePage){

    /** TODO: This should check if the new landing page exists, else it should fail; */

    const Url = `${web.Url}/_api/Web/rootfolder`;
    const CurrentRootFolder = await service.Get(Url)
    .then(data => data.d);
    
    const { __metadata } = CurrentRootFolder;

    return service.Patch(Url, {
        WelcomePage,
        __metadata: {
            type: __metadata.type,
        }
    });
    
}