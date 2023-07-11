/**
 * settings.js
 * @description Settings for index.js
 * @author Wilfredo Pacheco
 */

import Component from "../../src/Classes/Component.js";
import CreateStyleSheetElement from '../../src/Actions/StyleSheet.Create.js';
import Icons from '../../src/Components/Icons.js';
import SetTheme from '../../src/Actions/Theme.Set.js';
import { isReload } from "./index.js";
import { Name, favicon } from '../../app.details.js';

export const theme = {
    defaultColor: 'darkslategray',
    darkColor: '#343A40',
    primaryColor: '#6C757D',
    secondaryColor: 'aliceblue',
    darkHighlightColor: 'gold',
    lightHighlightColor: 'lightyellow',
}

export const WebOptions = new Object();
WebOptions.$select = '*';
WebOptions.$expand = [
    'AllProperties',
    'CurrentUser',
    'Folders',
    'RootFolder',
    'Lists',
    'Lists/DefaultView',
    'Lists/Fields',
    'Lists/InformationRightsManagementSettings',
    'Lists/WorkflowAssociations',
    'RegionalSettings',
    'RegionalSettings/TimeZone',
    'RegionalSettings/TimeZones',
    'UserCustomActions',
    'WebInfos',
].join(',');


/** Handle CSS; */
export const DOMStyleSheets = [
    './src/CSS/colors.css',
    // './src/css/dark.css',
    // './src/css/style.css',
    './Views/index/index.css',
    './src/css/custom.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/jquery-ui/dist/themes/base/jquery-ui.css',
    // './src/Libraries/DataTables/dataTables.css',
    // './src/Libraries/progress-bar/css/main.css',
];

/** Handle scripts that don't support imports; */
export const DOMScripts = [
    // './node_modules/jszip/dist/jszip.js',
    // './node_modules/pdfmake/build/vfs_fonts.js',
    './node_modules/moment/moment.js',
    // './src/Libraries/xlsx.full.min.js',
    // './src/Libraries/aes.js',
    // './src/Libraries/progress-bar/js/progress-bar.js',
    './src/Libraries/sweetalert.min.js',
];

export const storedLists = [
    // NotificationTypes,
    // Offices,
    // Locations,
    // Branches,
    // EventTypes,
    // Ranks,
];

export default async function init(App){

    await Icons();
    SetTheme(theme);

    /** Load all the libraries and CSS that we can't import; */
    DOMStyleSheets.forEach(href => {
        /** If the SessionId is missing then the application init method was triggered by a role update; */
        if (isReload) return;
        else return CreateStyleSheetElement({
            href,
            parent: document.head,
        }).render();
    });

    /** Dynamically load script files that do not have module exports; */
    await Promise.all(DOMScripts.map(file => {
        const value = file.split('/').pop().replace('.js', '');
        /** If the SessionId is missing then the application init method was triggered by a role update; */
        if (isReload) return;
        return fetch(file)
        .then(data => data.text())
        .then(content => {
            new Component({
                tag: 'script',
                attributes: [
                    { name: 'type', value: 'text/javascript' },
                    { name: 'data-file', value },
                ],
                parent: document.body,
                innerHTML: content,
            }).render();
        });
    }));

    /** Listens for POST and GET calls for progress bar; */
    Pace.options.ajax.trackMethods = ['GET', 'POST'];
    // Pace.on("done", function(){ $(".cover").fadeOut(2000); });

    /** Set page title; */
    document.title = Name;
    document.Title = Name;

    /** Sets browser tab icon; */
    document.head.prepend(new Component({
        tag: 'link',
        attributes: [
            { name: 'rel', value: 'shortcut icon' },

            /** Sets browser tab icon to an svg; */
            // { name: 'href', value: `data:image/svg+xml;utf8,${Logo.replace('currentColor', 'dodgerblue')}` },

            /** Sets browser favicon image; */
            { name: 'href', value: favicon },
            { name: 'type', value: 'image/vnd.microsoft.icon' },
            { name: 'id', value: 'favicon' },
        ],
    }).get());

}