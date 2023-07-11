/**
 * User.js
 * @description collection of user actions for this application;
 * @author Wilfredo Pacheco
 */

import { web as Web, service as Route, user as User } from "../Biome.js";
import { Title as UserSettingsTitle } from "../Schema/UserSettings.js"
import { Title as UserListTitle } from "../Views/Users/List.js";

var SettingsURL;

export function CustomSettings(){
    this.DarkMode = false;
    this.Theme = null;
    return this;
}

export function getRoles(){

    const { Url } = Web;
    const $filter = User.KeyChain.map(function(hash){
        return `(Hash eq '${hash}')`;
    }).join(' or ');

    return Route.Get(`${Url}/_api/Web/Lists/getByTitle('${UserListTitle}')/Items`, {
        $select: 'Role',
        $filter,
    })
    .then(data => data.d)
    .then(data => data.results)
    .catch(e => {
        console.info(e); 
        return [];
    });

}

export function UpdateSettings(CurrentUserSettings){
    const List = Web.getListDetails(UserSettingsTitle);
    return Route.Patch(SettingsURL, {
        UserKey: User.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName },
    });
}

export async function CreateUserSettings(CurrentUserSettings){
    const List = Web.getListDetails(UserSettingsTitle);
    return Route.Post(`${List.__metadata.uri}/Items`, {
        UserKey: User.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName }
    }).then(data => {
        SettingsURL = data.d.__metadata.uri;
    });
}

export function getSettings(){

    const { Url } = Web;
    const ListUrl = `${Url}/_api/Web/Lists/getByTitle('${UserSettingsTitle}')`;
    
    return Route.Get(`${ListUrl}/Items`, {
        $select: '*',
        $top: 1,
        $filter: `UserKey eq '${User.KeyChain[0]}'`,
    })
    .then(data => data.d)
    .then(data => {
        
        let CurrentUserSettings;

        if (data.results.length) 
        { /** If a result is found, that item is assigned; */
            const SettingsValue = Object.assign(new CustomSettings(), data.results[0]);
            SettingsURL = SettingsValue.__metadata.uri;
            CurrentUserSettings = JSON.parse(SettingsValue.Settings);
        }

        else 
        { /** An item for this user is created; */
            CurrentUserSettings = new CustomSettings();
            CreateUserSettings(CurrentUserSettings);
        }

        /** @returns CurrentUserSettings with proxy that will update the list item when updated; */
        return new Proxy(CurrentUserSettings, {
            
            /** Track changes to the current user's custom settings; */
            set: function(target, key, value){

                // console.info(target, key, value);
                /** The timeout allows the method to run, and update the new value on the list; */
                setTimeout(function(){
                    UpdateSettings(CurrentUserSettings);
                }, 200);
                
                target[key] = value;
                return true;
            }

        });
        
    })
    .catch(e => {
        console.info(e); 
        return {};
    });

}