/**
 * Administrator.js
 * @author Wilfredo Pacheco
 */

import App, { Layout } from "../../app.js";
import { user as User, web as Web } from "../Biome.js";
import { CustomAdminViews, GitHubLink } from "../../app.settings.js";
import SetWelcomePage from "../Actions/SP.WelcomePage.Set.js";
import Dropdown from "../Classes/Dropdown.js";
import Form from "../Classes/Form.js";
import OffCanvas from "../Classes/OffCanvas.js";
import Toast from "../Classes/Toast.js";
import View from "../Classes/View.js";

export const Icon = 'key';
export const Title = 'Administrator';

export let view;
export let button;
export let container;

/** setLocationHash is to handle the fact bootstrap 5 ignores the hash for a tags; */
export function setLocationHash(event){
    location.hash = this.getAttribute('href').replace('#', '');
}

export function RenderWelcomePageForm({ parent }){

    const WelcomePageContainer = new OffCanvas({
        title: 'Welcome Page',
        id: 'offcanvas',
        parent,
        remove: true,
        body: /*html*/`
        <p>Note: Updating this will change the landing for this site collection!</p>`,
    }).render();

    const WelcomePageForm = new Form({
        classList: 'row g-3 needs-validation',
        parent: WelcomePageContainer.getBody(),
        innerHTML: /*html*/`<!-- Landing Page Form -->
        <div class="mb-3">
            <label for="inputWelcomePage" class="form-label">Welcome Page</label>
            <input type="text" 
                   class="form-control form-control-sm" 
                   name="WelcomePage" 
                   id="inputWelcomePage" 
                   value="${Web.RootFolder.WelcomePage}" 
                   placeholder="URL" 
                   required />
        </div>
        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-sm btn-primary">Submit</button>
        </div>`,
    }).render();

    // Set the values
    // WelcomePageForm.Values.set(Web.RootFolder);
    // NOTE: if you set them this way then you can't reset the form......
    // If you want to provide that option;

    WelcomePageForm
    .get('button[type="submit"]')
    .addEventListener('click', function(event){

        event.preventDefault();
        event.stopPropagation();

        const Element = event.target;
        const valid = WelcomePageForm.Fields.validate();

        if (!valid) return null;

        $(Element)
        .attr('disabled', '') /** Disable button; */
        .html(/*html*/`<!-- Spinner Element -->
        <span class="spinner-border spinner-border-sm" 
              role="status" 
              aria-hidden="true">
        </span>&#160;Updating...`);

        const {
            WelcomePage,
        } = WelcomePageForm.Values.get();

        return SetWelcomePage(WelcomePage)
        .then(() => { // Close the OffCanvas element;
            WelcomePageContainer.hide();
        })
        .then(() => { // Notify the user the request was complete;
            return new Toast({
                type: 'success',
                message: 'The Welcome Page has been updated!',
            })
            .render()
            .show();
        });

    });

    return WelcomePageContainer;

}

export default function Administrator(){

    const { Menu, tabContent } = Layout;
    const { Download, Uninstall, ext } = App;
    // const displayTitle = 'DCIR Admin'

    view = new View({
        Title, 
        Icon, 
        Menu, 
        tabContent,
        // displayTitle,
        active: false,
        content: /*html*/`
        <ul class="nav nav-pills mb-3" id="pills-SiteAdminTab" role="tablist">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" 
                    id="resource-tab" 
                    data-bs-toggle="pill" 
                    href="#resource" 
                    role="tab" 
                    aria-controls="pills-resource" 
                    aria-selected="true">${
                        document.getIcon('diagram-3-fill').outerHTML
                    }&#160;Resources</a>
            </li>
        </ul>
        <div class="tab-content" id="pills-SiteAdminTabContent">
            <div class="tab-pane fade show active" id="resource" role="tabpanel" aria-labelledby="resource-tab">
                <div tab-header class="jumbotron jumbotron-fluid border bg-primaryColor text-white">
                    <div class="px-5">
                        <!-- <img class="ml-4" src="_layouts/15/images/siteIcon.png?rev=40" /><br> -->
                        <div class="d-inline-flex">
                            <h1 class="display-5">${Title}</h1>
                        </div>
                        <p class="lead">Microsoft SharePoint list maintenance for ${Web.Title}.</p>
                        <p class="text-white">Please use the tabs across the top to navigate between the lists used to construct the Reports form.</p>
                        <div class="mt-1 row admin-links" data-admin-links>
                            <!-- Link Container -->
                            <ul>
                                <li>
                                    <a class="text-white" target="_blank" href="${Web.__metadata.id.replace('/_api/Web', '')}/_layouts/15/viewlsts.aspx">Site Contents</a>
                                </li>
                                <li>
                                    <a class="text-white" target="_blank" href="${Web.__metadata.id.replace('/_api/Web', '')}/_layouts/15/settings.aspx">Site Settings</a>
                                </li>
                                <li>
                                    <a class="text-white" target="_blank" href="${Web.__metadata.id.replace('/_api/Web', '')}/_layouts/15/RecycleBin.aspx">Recycle Bin</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** Dynamically render views specific to this application; */
    const menu = container.get('ul#pills-SiteAdminTab');
    const tabcontent = container.get('div#pills-SiteAdminTabContent');
    CustomAdminViews.forEach(callback => {
        return callback(menu, tabcontent);
    });

    const TabList = container.get('ul.nav.nav-pills');

    let DeveloperTools;
    if (User.hasRole('Developer')) DeveloperTools = new Dropdown({
        tag: 'li',
        classList: 'nav-item',
        title: /*html*/`${document.getIcon('fingerprint').outerHTML}&#160;Developer`,
        buttonClassList: 'nav-link text-primaryColor',
        menuOptions: [{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: `${Web.Url}/SiteAssets/Forms/AllItems.aspx` },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            <img width="16" src="/_layouts/15/images/favicon.ico?rev=23">&#160;Site Assets`,
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: `${Web.Url}/Shared%20Documents/Forms/AllItems.aspx` },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            <img width="16" src="/_layouts/15/images/favicon.ico?rev=23">&#160;Documents`,
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2 strike',
            // classList: 'dropdown-item',
            attributes: [
                { name: 'href', value: `javascript:alert('Sorry, this link has been disabled.');` },
                // { name: 'href', value: `${Web.Url}/SiteAssets/App/dev.aspx` },
                // { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            <img width="16" src="/_layouts/15/images/favicon.ico?rev=23">&#160;DEV`,
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: 'javascript:;' },
                { name: 'role', value: 'tab' },
                { name: 'aria-selected', value: false },
            ],
            events:[{ 
                name: 'click', 
                action: function(event){
                    return RenderWelcomePageForm({
                        parent: container,
                    }).show();
                } 
            }],
            innerHTML: /*html*/`
            ${document.getIcon('file-earmark-code').outerHTML}&#160;Set Welcome Page`,
        },{
            tag: 'hr',
            classList: 'dropdown-divider',
        },{
            tag: 'a',
            // classList: 'dropdown-item strike',
            classList: 'dropdown-item rounded-2',
            attributes: [
                // { name: 'href', value: `javascript:alert('Sorry, this link has been disabled.');` },
                { name: 'href', value: `${Web.Url}/SiteAssets/DeployModule/DeployModule.aspx` },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            ${document.getIcon('plugin').outerHTML}&#160;Deploy Module`,
        },{
            tag: 'a',
            // classList: 'dropdown-item strike',
            classList: 'dropdown-item rounded-2',
            attributes: [
                // { name: 'href', value: `javascript:alert('Sorry, this link has been disabled.');` },
                { name: 'href', value: `${Web.Url}/SiteAssets/App/src/Pages/ExcelFileImport.aspx` },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            ${document.getIcon('plugin').outerHTML}&#160;ExcelFileImport`,
        },{
            tag: 'a',
            // classList: 'dropdown-item strike',
            classList: 'dropdown-item rounded-2',
            attributes: [
                // { name: 'href', value: `javascript:alert('Sorry, this link has been disabled.');` },
                { name: 'href', value: `./src/Pages/ErrorReport.${ext}` },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            ${document.getIcon('plugin').outerHTML}&#160;Error Report`,
        },{
            tag: 'hr',
            classList: 'dropdown-divider',
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: GitHubLink },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            ${document.getIcon('github').outerHTML}&#160;GitHub Repo`,
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: 'https://github.com/w-pacheco/DeployModule' },
                { name: 'target', value: '_blank' },
                { name: 'aria-selected', value: false },
            ],
            innerHTML: /*html*/`
            ${document.getIcon('github').outerHTML}&#160;DeployModule Repo`,
        },{
            tag: 'hr',
            classList: 'dropdown-divider',
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: '#Download' },
                { name: 'aria-selected', value: false },
            ],
            events:[{ 
                name: 'click', 
                action: function(event){
                    return Download();
                } 
            }],
            innerHTML: /*html*/`
            ${document.getIcon('download').outerHTML}&#160;Download`,
        },{
            tag: 'a',
            classList: 'dropdown-item rounded-2',
            attributes: [
                { name: 'href', value: '#Uninstall' },
                { name: 'aria-selected', value: false },
            ],
            events:[{ name: 'click', action: Uninstall }],
            innerHTML: /*html*/`
            ${document.getIcon('lightning').outerHTML}&#160;Uninstall`,
        }],
        parent: TabList,
    }).render();

    App.Views[Title] = {
        Title,
        view,
        button,
        DeveloperTools,
    }

}

window.addEventListener('popstate', function(event){

    const { hash } = location;
    const { isTrusted } = event;
    
    /** Parse the url & display the tab and/or data based on the url parameters; */
    // if (hash.replace('#', '') === Title)
    if (hash === `#${Title}`)
    {
        /** Manually call the tab without replacing the rest of the history; */
        view.show();
    }
    
    /** Handle the views in the administrator tab; */
    else if (!isTrusted && container)
    {
        const tabcontent = container.get('div#pills-SiteAdminTabContent');
        const viewStr = hash.replace('#', '').toLocaleLowerCase();
        if (tabcontent.querySelector(`div#pills-${viewStr}`))
        {
            /** Manually call the tab without replacing the rest of the history; */
            view?.show();
        }
    }

});