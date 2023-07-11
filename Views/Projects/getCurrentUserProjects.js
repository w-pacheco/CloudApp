/**
 * getCurrentUserProjects.js
 * @author Wilfredo Pacheco
 */

import { service, web, user } from "../../src/Biome.js";
import { Title } from "./List.js";

/**
 *  getCurrentUserProjects
 * 
 * @description This is a CAML call that is used to search multiline text fields,
 * the REST API does not allow the use of: substringof('string', Members)
 * 
 * @refernce https://sharepoint.stackexchange.com/questions/209051/multi-line-text-field-in-rest-api-filter-url 
 * @refernce https://www.c-sharpcorner.com/article/get-items-from-multiple-line-of-text-column-using-caml-query-with-sharepoint-res/
 * @returns Array of Projects;
 */
export default function getCurrentUserProjects(Field = 'Members'){

    const list = web.getListDetails(Title);

    /** Handles missing list on install; */
    if (!list) return;
    
    const queryViewXml = /*xml*/`
    <View>
        <Query>
            <Where>
                <Contains>
                    <FieldRef Name='${Field}'/>
                    <Value Type='Note'>${user.Email}</Value>
                </Contains>
            </Where>
        </Query>
    </View>`
    .split('\n')
    .map(str => str.trim())
    .join('');

    /** @example for multiple; */
    // const queryViewXml = /*xml*/`
    // <View>
    //     <Query>
    //         <Where>
    //             <Contains>
    //                 <FieldRef Name='${Field}'/>
    //                 <Value Type='Note'>${user.Email}</Value>
    //             </Contains>
    //             <Contains>
    //                 <FieldRef Name='${Field}'/>
    //                 <Value Type='Note'>${user.Key}</Value>
    //             </Contains>
    //         </Where>
    //     </Query>
    // </View>`
    // .split('\n')
    // .map(str => str.trim())
    // .join('');

    return service.post(`${list.__metadata.uri}/getitems`, { 
        query: { 
            __metadata: { type: 'SP.CamlQuery' },
            ViewXml: queryViewXml,
        },
    })
    .then(data => data.d)
    .then(data => data.results)
    .then(results => {
        return results.map(function({
            __metadata,
            Project,
            GUID,
            Id,
        }){
            return {
                Project,
                GUID,
                Id,
                __metadata,
            };
        });
    });

}