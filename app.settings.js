/**
 * app.settings.js
 * @author Wilfredo Pacheco
 */

import { BootstrapIconURL, iCenter, localhost } from './src/Biome.js';
import { isReload } from './app.js';

import AddMetaTags from './src/Actions/Metatags.Add.js';
import PerformanceMonitor, { FileRoster } from './src/Components/PerformanceMonitor.js';
import CreateStyleSheetElement from './src/Actions/StyleSheet.Create.js';
import Download from './src/Actions/Download.js';
import Uninstall from './src/Actions/Uninstall.js';
import Component from './src/Classes/Component.js';
import Icons from './src/Components/Icons.js';
import SetTheme from './src/Actions/Theme.Set.js';
import { ReplaceLocation } from './src/Actions/History.Set.js';

/** Default List Schema; */
import Errors from './src/Views/Errors/List.js';
import Users from './src/Views/Users/List.js';
import Roles from './src/Views/Roles/List.js';
import Log from './src/Views/Log/List.js';
import TicketTracker from './src/Views/TicketTracker/List.js';
import AssignedRoles from './src/Schema/AssignedRoles.js';
import UserSettings from './src/Schema/UserSettings.js';
import Comments from './src/Schema/Comments.js';
import EmailNotifications from './src/Schema/EmailNotifications.js';
import SettingsList from './src/Schema/Settings.js';

/** AdminViews; */
import { UsersTab } from './src/Views/Users/View.js';
import { RolesTab } from './src/Views/Roles/View.js';
import { ErrorsTab } from './src/Views/Errors/View.js';
import { LogTab } from './src/Views/Log/View.js';
import { SPListManagerTab } from './src/Views/SPListManager.js';
import { SPCustomActionsTab } from './src/Views/SPCustomActions.js';
import { Copyright, Name, Version, favicon } from './app.details.js';

const { origin } = location;

/**
 * GitHubLink {String}
 * @description When working on a project, this link should point to the github repository if it is available.
 */
// export const GitHubLink = 'https://github.com/Biome-js/Biome-js-v2';
export const GitHubLink = 'https://github.com/w-pacheco/CloudApp';

/**
 * theme {Object}
 * @description This defines the overall color scheme for the application.
 * NOTE: primaryColor & darkColor are the most heavily used CSS classes out of the box.
 */
export const theme = {
    defaultColor: 'darkslategray',
    darkColor: '#343A40',
    primaryColor: '#6C757D',
    secondaryColor: 'aliceblue',
    darkHighlightColor: 'gold',
    lightHighlightColor: 'lightyellow',
    // darkColor: '#172a3a',
    // primaryColor: '#09bc8a',
}

/**
 * TrackUser {Boolean}
 * @description Tracking user navigation can help identify user specific issues within the application.
 * This is triggered everytime the URL is manipulted within the single page application.
 */
export const TrackUser = true;

/**
 * Verbose {Boolean}
 * @description Most helpful during development, when true the application logs details in the console.
 */
export const Verbose = false;
export const VerboseColor = 'color: dodgerblue;';

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

export const SiteCollectionLists = [
    /** These Lists have default data defined; */
    Roles,          /** Default list used to define roles for user accounts within the application; */
    
    /** The following lists DO NOT have default data defined; */
    AssignedRoles,  /** Default - Handles assigned roles within the application; */
    Users,          /** Default - Handles user accounts within the application; */
    Errors,         /** Default - Handles errors reported by the application; */
    Log,            /** Default - Handles logs from the UI with details on user views; */
    UserSettings,   /** Default - Handles user custom settings such as DarkMode, Theme, etc...; */
    SettingsList,
    TicketTracker,

    /** Comments is a default list used when list items require a comment, FK is GUID; */
    Comments,

    /** NOTE: EmailNotifications is a list that should be used if the environment does NOT allow emails via the REST Api; */
    EmailNotifications,
];

export const storedLists = [
    SettingsList,
];

/** Handle CSS; */
export const DOMStyleSheets = [
    './src/css/colors.css',
    './src/css/dark.css',
    './src/css/style.css',
    './src/css/sidebar.css',
    './src/css/pace-flash.css',
    './src/css/pace-simple-custom.css',
    './src/css/custom.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/jquery-ui/dist/themes/base/jquery-ui.css',
    './src/Libraries/DataTables/dataTables.css',
    './src/Libraries/progress-bar/css/main.css',
    './src/Libraries/smart_wizard.min.css',
];

/** Handle scripts that don't support imports; */
export const DOMScripts = [
    './node_modules/jszip/dist/jszip.js',
    './node_modules/pdfmake/build/vfs_fonts.js',
    './node_modules/moment/moment.js',
    './src/Libraries/xlsx.full.min.js',
    './src/Libraries/aes.js',
    './src/Libraries/progress-bar/js/progress-bar.js',
    './src/Libraries/sweetalert.min.js',
    // './node_modules/chart-js/dist/chart.js',
    // './src/Libraries/charts-js/dist/chart.js',
    './node_modules/fullcalendar/index.global.js',
];

export const SupportingFiles = [
    DOMStyleSheets,
    DOMScripts,
    [
        './app.aspx',
        './app.html',
        './dev.aspx',
        './dev.html',
        './index.aspx',
        './index.html',
        './README.md',
        './src/Actions/UnsupportedBrowser.js',
        './src/Components/ErrorLog-config.js',
        // './src/Pages/ContentEditable.html',
        './src/Pages/Document.html',
        './src/Pages/Document.aspx',
        './src/Pages/ErrorReport.aspx',
        './src/Pages/ErrorReport.js',
        './src/Pages/ExcelFileImport.aspx',
        './src/Pages/MapMySite.html',
        './src/core.js',
        './src/images/SAIC/4_White/SAIC-Logo-RGB-White-sm.png',
        './src/Libraries/chart-js/dist/chart.umd.js',

        /** Views; */
        './Views/index/index.css',
        './Views/index/index.js',
        './Views/index/settings.js',
        './custom-actions/tracker.js',

        /** Images */
        BootstrapIconURL,
        favicon,
        './images/DHA/DefenseHealthAgencyDHALogowhitetransp.png',
        './images/DHA/DefenseHealthAgencyDHALogo2.png',
        './images/boarding-lg.jpg',
        './images/helicopter-package.jpg',
        './images/mountain-lg.jpg',
        './images/soldier-walk-lg.jpg',
        './images/soldier-woods.jpg',
        './images/soldier.jpg',
    ],
].flat();

/** Handle localhost - Used in Download.js */
if (localhost) SupportingFiles
.map(url => url.replace('.', origin))
.map(url => `== Resource[0] - ${url}`)
.forEach(fakeLog => performanceLog.push(fakeLog));

export const CustomAdminViews = [
    UsersTab,
    RolesTab,
    SPListManagerTab,
    SPCustomActionsTab,
    ErrorsTab,
    LogTab,
];

export default async function Settings(App){

    /** Add Meta Tags to the head Element; */
    AddMetaTags(Name, Version, Copyright);

    /** Helps identify modules loaded when app runs; */
    PerformanceMonitor({ printToConsole: false, saveToDom: true });

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

    /** Waits for the content element to load on the page before the loading bar disappears - used for center loading bar; */
    // Pace.options.elements = { selectors: ['content'] };

    /** Sets browser tab icon; */
    const BrowserIcon = new Component({
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
    });

    /** Set page title; */
    document.title = Name;
    document.Title = Name;
    document.head.prepend(BrowserIcon.get());

    const getApplicationFileRoster = function getApplicationFileRoster() {
        return new FileRoster(App);
    }
    window.getApplicationFileRoster = getApplicationFileRoster;

    /** Properties explicitly added to the App instance; */
    App.set('getApplicationFileRoster', getApplicationFileRoster);
    App.set('Download', Download);
    App.set('Uninstall', Uninstall);
    App.set('SiteCollectionLists', SiteCollectionLists);
    App.set('prefers-color-scheme-dark', window?.matchMedia('(prefers-color-scheme: dark)')?.matches);
    // App.set('ecrypted', true);
    /** TODO: Make sure this method is still getting used; */
    // App.set('convertToSiteTime', function convertToSiteTime(dateStr) {
    //     // https://sharepoint.stackexchange.com/questions/121633/sharepoint-designer-how-to-get-current-server-datetime-through-javascript-rest
    //     return Route.Get(`${SiteData.Url}/_api/web/RegionalSettings/TimeZone/utcToLocalTime(@date)?@date='${new Date(dateStr).toUTCString()
    //         }'`).then(data => data.UTCToLocalTime);
    // });

    if (iCenter) {
        /** List of URL properties to remove; */
        const tokens = ['authToken', 'client-request-id'];

        /** Create a new URL Object based on the location; */
        const url = new URL(location);

        /** Iterate over the tokens and if the token if found, call the delete method from the new URL */
        tokens.forEach(token => {
            if (url.searchParams.get(token)) url.searchParams.delete(token);
        });

        /** Replace the location with the removed parameters; */
        ReplaceLocation(url);
    }
}