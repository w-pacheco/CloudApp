/**
 * Schema.Check.js
 * @author Wilfredo Pacheco
 */

import { user as User, web as Web } from '../Biome.js';
import { SiteCollectionLists } from "../../app.settings.js";

import Factory from '../Components/Factory.js';
import { PredefinedData as UsersList } from '../Views/Users/List.js';

export default async function CheckSchema(){

    const SomeListsAreMissing = (Web.getAllLists().length - 6) < SiteCollectionLists.length;
    const MissingLists = SiteCollectionLists.filter(list => {
        const { Title } = list.List;
        if (!Web.getListDetails(Title)) return list;
    });

    const { Title, Account, LoginName, KeyChain } = User;
    /** Create account for the user installing the app; */
    UsersList.push({
        DisplayText: Title,
        Key: LoginName,
        Email: Account.EntityData.Email,
        Hash: KeyChain[0],
        Account: JSON.stringify(Account),
        Role: 'Developer',
    });

    if (MissingLists.length)
    {
        // App.NeedsInstall = true;
        // App.InstallSuccessful = false;
        const text = MissingLists.length === 1 ?
        `${MissingLists.length} List is missing, would you like to install it?` : 
        `${MissingLists.length} Lists are missing, would you like to install them?`;

        if (window?.swal) await swal({
            icon: 'warning',
            text,
            buttons: {
                cancel: {
                    text: 'Cancel',
                    value: null,
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: 'Ok',
                    value: true,
                    visible: true,
                    closeModal: true
                },
            },
        })
        .then(response => {
            /** The factory creates all required lists for this application; */
            if (response) return Factory();
        });

        else if (confirm(text))
        {
            /** The factory creates all required lists for this application; */
            await Factory();
            // App.InstallSuccessful = true;
        }
    }

}