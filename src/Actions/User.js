/**
 * User.js
 * @description collection of user actions for this application;
 * @author Wilfredo Pacheco
 */

import { web, service, user } from "../Biome.js";
import { Title as UserSettingsTitle } from "../Schema/UserSettings.js"
import { Title as UserListTitle } from "../Views/Users/List.js";

var SettingsURL;

/** Bootstrap v5 has darkmode features, this is where that is handled; */
export function setBSTheme(darkmode){
    const bs_theme = darkmode ? 'dark' : 'light';
    document.querySelector('html').setAttribute('data-bs-theme', bs_theme);
    return bs_theme;
}

export function CustomSettings(){
    this.DarkMode = false;
    this.Theme = null;
    return this;
}

export function getRoles(){

    const { Url } = web;
    const $filter = user.KeyChain.map(function(hash){
        return `(Hash eq '${hash}')`;
    }).join(' or ');

    return service.get(`${Url}/_api/Web/Lists/getByTitle('${UserListTitle}')/Items`, {
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
    const List = web.getListDetails(UserSettingsTitle);
    return service.patch(SettingsURL, {
        UserKey: user.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName },
    });
}

export async function CreateUserSettings(CurrentUserSettings){
    const List = web.getListDetails(UserSettingsTitle);
    return service.post(`${List.__metadata.uri}/Items`, {
        UserKey: user.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName },
    }).then(data => {
        SettingsURL = data.d.__metadata.uri;
    });
}

export function getSettings(){

    const { Url } = web;
    const ListUrl = `${Url}/_api/Web/Lists/getByTitle('${UserSettingsTitle}')`;
    
    return service.get(`${ListUrl}/Items`, {
        $select: '*',
        $top: 1,
        $filter: `UserKey eq '${user.KeyChain[0]}'`,
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

        if (CurrentUserSettings) setBSTheme(CurrentUserSettings.DarkMode)
        /** @returns CurrentUserSettings with proxy that will update the list item when updated; */
        return new Proxy(CurrentUserSettings, {
            
            /** Track changes to the current user's custom settings; */
            set: function(target, key, value){

                // console.info(target, key, value);
                /** The timeout allows the method to run, and update the new value on the list; */
                setTimeout(function(){
                    setBSTheme(CurrentUserSettings.DarkMode);
                    UpdateSettings(CurrentUserSettings);
                }, 200);
                
                target[key] = value;
                return true;
            },

        });
        
    })
    .catch(e => {
        console.info(e); 
        return {};
    });

}