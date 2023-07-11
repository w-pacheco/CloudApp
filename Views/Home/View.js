/**
 * Home.js
 * Home View;
 * @author Wilfredo Pacheco
 */

import App, { ADMINISTRATOR, DEVELOPER, Layout, User, Route } from "../../app.js";
import Component from "../../src/Classes/Component.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Home.edit.js";
import HomeView, { parseColumnData, defaultHomeData, getHomeView } from "./HomeView.js";
// import ShowForm from '../src/Views/TicketTracker/Form.js';

export const Icon = 'house-door';
export const Title = 'Home';

export let view;
export let button;
export let container;
export let layout;

const CostPointLink = 'https://te.saic.com/';
const Microsoft365Link = 'https://www.office365.us/?auth=2&home=1';
const ISSACLink = 'https://issaic.saic.com/';
const SocialLink = 'https://issaic.saic.com/personal/{{USER}}/Social/Sites.aspx#IsEditing_WPQ5=1';

export function WebInfosWidget(parent){

    const { origin } = location;

    return Route.Get(`${Web.Url}/_api/Web/WebInfos`)
    .then(data => data.d)
    .then(data => data.results)
    .then(results => {

        const widget = new Component({
            tag: 'div',
            classList: 'row',
            parent,
            // innerHTML: /*html*/`
            // <div uk-filter="target: .js-filter">
    
            //     <ul class="uk-subnav uk-subnav-pill" hidden>
            //         <li class="uk-active" uk-filter-control><a href="#">All</a></li>
            //         <li uk-filter-control="[data-color='white']"><a href="#">White</a></li>
            //         <li uk-filter-control="[data-color='blue']"><a href="#">Blue</a></li>
            //         <li uk-filter-control="[data-color='black']"><a href="#">Black</a></li>
            //     </ul>
    
            //     <ul class="js-filter uk-child-width-1-1 uk-child-width-1-3@l uk-child-width-1-2@m uk-grid" uk-grid>

            //     <!-- The following is an example of how the filter will work:
            //         <li data-color="white">
            //             <div class="uk-card uk-card-default uk-card-body">Item</div>
            //         </li>
            //         <li data-color="blue">
            //             <div class="uk-card uk-card-primary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="white">
            //             <div class="uk-card uk-card-default uk-card-body">Item</div>
            //         </li>
            //         <li data-color="white">
            //             <div class="uk-card uk-card-default uk-card-body">Item</div>
            //         </li>
            //         <li data-color="black">
            //             <div class="uk-card uk-card-secondary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="black">
            //             <div class="uk-card uk-card-secondary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="blue">
            //             <div class="uk-card uk-card-primary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="black">
            //             <div class="uk-card uk-card-secondary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="blue">
            //             <div class="uk-card uk-card-primary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="white">
            //             <div class="uk-card uk-card-default uk-card-body">Item</div>
            //         </li>
            //         <li data-color="blue">
            //             <div class="uk-card uk-card-primary uk-card-body">Item</div>
            //         </li>
            //         <li data-color="black">
            //             <div class="uk-card uk-card-secondary uk-card-body">Item</div>
            //         </li>

            //         -->
            //     </ul>
    
            // </div>`
        }).render();

        // const grid = widget.querySelector('ul[uk-grid]');
        // $(grid).empty();

        // new Component({
        //     tag: 'div',
        //     classList: 'card p-0',
        //     attributes: [{ name: 'style', value: 'width: 28em;' }],
        //     parent: widget,
        //     innerHTML: `
        //     <img src="./images/soldier-walk-med.jpg" class="card-img-top" alt="...">
        //     <div class="card-body">
        //         <h5 class="card-title">Card title</h5>
        //         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        //         <a href="#" class="btn btn-primary">Go somewhere</a>
        //     </div>`,
        // }).render();

        // new Component({
        //     tag: 'div',
        //     classList: 'card p-0',
        //     attributes: [{ name: 'style', value: 'width: 28em;' }],
        //     parent: widget,
        //     innerHTML: `
        //     <div class="row g-0">
        //         <div class="col-md-4">
        //             <img src="./src/Images/favicon_Costpoint.ico" class="img-fluid rounded-start" alt="...">
        //         </div>
        //         <div class="col-md-8">
        //         <div class="card-body">
        //             <h5 class="card-title">Card title</h5>
        //             <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        //             <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
        //         </div>
        //     </div>
        // </div>`,
        // }).render();

        new Component({
            tag: 'div',
            classList: 'card col-4 p-0',
            parent: widget,
            innerHTML: /*html*/`
            <div class="card-body">
                <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6 rounded"></span>
                </h5>
                <p class="card-text placeholder-glow">
                    <span class="placeholder col-7 rounded"></span>
                    <span class="placeholder col-4 rounded"></span>
                    <span class="placeholder col-4 rounded"></span>
                    <span class="placeholder col-6 rounded"></span>
                    <span class="placeholder col-8 rounded"></span>
                </p>
                <a class="btn btn-primary btn-sm disabled placeholder col-6"></a>
            </div>`
        }).render();
        
        return results.forEach(site => {

            const {
                Configuration,
                Created,
                Description,
                Id,
                Language,
                LastItemModifiedDate,
                ServerRelativeUrl,
                Title,
                WebTemplate,
                WebTemplateId,
            } = site;

            return new Component({
                // tag: 'li',
                // attributes: [{ name: 'data-color', value: 'white' }],
                // parent: grid,
                // innerHTML: /*html*/`
                // <div class="uk-card" 
                //      data-id="${Id}" 
                //      data-language="${Language}" 
                //      data-web-template="${WebTemplate}" 
                //      data-web-template-id="${WebTemplateId}"
                //      data-configuration="${Configuration}">
                //     <div class="uk-card uk-card-default">
                //         <div class="uk-card-header">
                //             <div class="uk-grid-small uk-flex-middle" uk-grid>
                //                 <div class="uk-width-expand">
                //                     <h3 class="uk-card-title uk-margin-remove-bottom">${Title}</h3>
                //                     <p class="uk-text-meta uk-margin-remove-top">
                //                         <time datetime="${Created}">Created: ${new Date(Created).toLocaleString()}</time>
                //                     </p>
                //                     <p class="uk-text-meta uk-margin-remove-top">
                //                         <time datetime="${LastItemModifiedDate}">Modified: ${new Date(LastItemModifiedDate).toLocaleString()}</time>
                //                     </p>
                //                 </div>
                //             </div>
                //         </div>
                //         <div class="uk-card-body">
                //             <p>${Description || 'N/A'}</p>
                //         </div>
                //         <div class="uk-card-footer uk-text-center">
                //             <a href="${origin + ServerRelativeUrl}" target="_blank" class="uk-button uk-button-text">Visit</a>
                //         </div>
                //     </div>
                // </div>`
                tag: 'div',
                classList: 'card col-4',
                parent: widget,
                innerHTML: /*html*/`
                <!-- <div class="card" style="width: 18rem;"> -->
                    <div class="card-body">
                        <h5 class="card-title">${Title}</h5>
                        <time datetime="${Created}">Created: ${new Date(Created).toLocaleString()}</time>
                        <p class="card-text">${Description || 'N/A'}</p>
                        <a href="${origin + ServerRelativeUrl}" class="btn btn-outline-primary btn-sm">Visit</a>
                    <!-- </div> -->
                </div>`
            }).render();
        });
    });
}

export default function Home(){

    const { Menu, tabContent } = Layout;
    const UserAccountDescription = User.Account.Description.split('\\')[1];

    view = new View({
        Title, 
        Icon, 
        Menu, 
        tabContent,
        active: true,
        content: /*html*/`
        <div>
            <h2 class="pb-2 border-bottom">${App.Name}</h2>
            <div class="float-end" data-edit></div>
            <div data-feature></div>
        </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** Widget that holds Dashboard element; */
    // const Widget = new Component({
    //     tag: 'div',
    //     // classList: 'card col-lg-6 shadow-lg el-widget my-2',
    //     classList: 'card col-4 el-widget my-2 bg-transparent border-0',
    //     attributes: [{ name: 'style', value: 'border-radius: 1.25rem!important;' }],
    //     parent: container.get('div[data-widget-container]'),
    //     innerHTML: /*html*/`
    //     <div class="mt-4" id="icon-grid">
    //         <h4 class="border-bottom mt-4 pt-4 pb-1">Helpful Links</h4>
    //         <div class="link-container"></div>
    //     </div>`,
    // })
    // .render();

    /** Costpoint Link */
    // new Component({
    //     tag: 'div',
    //     parent: Widget.get('div.link-container'),
    //     innerHTML: /*html*/`
    //     <a class="btn" href="${CostPointLink}" target="_blank">
    //         <div class="col d-flex align-items-start">
    //             <img width="8%" class="mr-2" src="./src/Images/favicon_Costpoint.ico" alt="">
    //             <h4 class="fw-bold mb-0">&#160;Costpoint</h4>
    //         </div>
    //     </a>`,
    // })
    // .render();

    /** Microsoft 365 Link */
    // new Component({
    //     tag: 'div',
    //     parent: Widget.get('div.link-container'),
    //     innerHTML: /*html*/`
    //     <a class="btn" href="${Microsoft365Link}" target="_blank">
    //         <div class="col d-flex align-items-start">
    //             <img class="mr-2" src="./src/Images/favicon_office365.ico" alt="">
    //             <h4 class="fw-bold mb-0">&#160;Microsoft 365</h4>
    //         </div>
    //     </a>`,
    // })
    // .render();

    /** ISSAC Link */
    // new Component({
    //     tag: 'div',
    //     parent: Widget.get('div.link-container'),
    //     innerHTML: /*html*/`
    //     <a class="btn" href="${ISSACLink}" target="_blank">
    //         <div class="col d-flex align-items-start">
    //             <svg class="mr-2" width="2em" height="2em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g data-name="STYLE = COLOR">
    //                 <circle cx="15" cy="9.5" r="9.5" fill="#036c70"/>
    //                 <circle cx="23.875" cy="17.875" r="8.125" fill="#1a9ba1"/>
    //                 <circle cx="16" cy="25.5" r="6.5" fill="#37c6d0"/>
    //                 <path d="M16.667 7H5.833A9.506 9.506 0 0015 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 009.5 25.5q0 .252.019.5h7.148A1.337 1.337 0 0018 24.667V8.333A1.337 1.337 0 0016.667 7z" opacity=".1"/><path d="M15.667 8H5.617A9.505 9.505 0 0015 19c.277 0 .551-.013.823-.036l.005.038A6.505 6.505 0 009.674 27h5.993A1.337 1.337 0 0017 25.667V9.333A1.337 1.337 0 0015.667 8z" opacity=".2"/><path d="M15.667 8H5.617A9.505 9.505 0 0015 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 009.518 25h6.149A1.337 1.337 0 0017 23.667V9.333A1.337 1.337 0 0015.667 8z" opacity=".2"/><path d="M14.667 8h-9.05A9.505 9.505 0 0015 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 009.518 25h5.149A1.337 1.337 0 0016 23.667V9.333A1.337 1.337 0 0014.667 8z" opacity=".2"/><path data-name="Back Plate" d="M1.333 8h13.334A1.333 1.333 0 0116 9.333v13.334A1.333 1.333 0 0114.667 24H1.333A1.333 1.333 0 010 22.667V9.333A1.333 1.333 0 011.333 8z" fill="#03787c"/><path d="M5.67 15.825a2.645 2.645 0 01-.822-.87 2.361 2.361 0 01-.287-1.19 2.29 2.29 0 01.533-1.541A3.142 3.142 0 016.51 11.3a5.982 5.982 0 011.935-.3 7.354 7.354 0 012.549.357v1.8a3.986 3.986 0 00-1.153-.471 5.596 5.596 0 00-1.349-.162 2.926 2.926 0 00-1.386.293.91.91 0 00-.549.833.844.844 0 00.233.59 2.122 2.122 0 00.627.448q.394.196 1.176.52a1.232 1.232 0 01.169.067 9.697 9.697 0 011.483.732 2.654 2.654 0 01.877.883 2.558 2.558 0 01.317 1.332 2.48 2.48 0 01-.499 1.605 2.789 2.789 0 01-1.335.896A6.049 6.049 0 017.703 21a10.028 10.028 0 01-1.722-.142 5.912 5.912 0 01-1.4-.404v-1.902a4.5 4.5 0 001.416.675 5.513 5.513 0 001.558.25 2.68 2.68 0 001.413-.3.947.947 0 00.475-.847.904.904 0 00-.266-.648 2.704 2.704 0 00-.735-.512q-.469-.236-1.386-.62a7.86 7.86 0 01-1.386-.725z" fill="#fff"/><path fill="none" d="M0 0h32v32H0z"/></g>
    //             </svg>
    //             <h4 class="fw-bold mb-0">&#160;ISSAC</h4>
    //         </div>
    //     </a>`,
    // })
    // .render();

    /** SAIC Personnal SharePoint Link */
    // new Component({
    //     tag: 'div',
    //     parent: Widget.get('div.link-container'),
    //     innerHTML: /*html*/`
    //     <a class="btn" href="${
    //         SocialLink.replace('{{USER}}', UserAccountDescription)
    //     }" target="_blank">
    //         <div class="col d-flex align-items-start">
    //             <img class="mr-2" width="8%" src="https://issaic.saic.com/_layouts/15/images/SharePointLogoSquare96.png?rev=40&Size=L" alt="">
    //             <h4 class="fw-bold mb-0 text-sm-center">&#160;SAIC Personnal SharePoint</h4>
    //         </div>
    //     </a>`,
    // })
    // .render();

    // new Component({
    //     tag: 'div',
    //     classList: 'card col bg-transparent border-0 animated fadeIn mt-5 pt-5',
    //     attributes: [
    //         { name: 'style', value: 'border-radius: 1.25rem!important;' },
    //         { name: 'draggable', value: true },
    //     ],
    //     parent: container.get('div[data-widget-container]'),
    //     innerHTML: /*html*/`
    //     <div class="card-body">
    //         <h5 class="card-title">PEESS Team</h5>
    //         <h6 class="card-subtitle mb-2 text-muted">icenter.saic.com</h6>
    //         <p class="card-text  d-none">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //         <div>
    //             <a href="https://icenter.saic.com/sites/peess/main/Lists/pht/MyEntries.aspx" 
    //                class="card-link" 
    //                target="_blank">${
    //                 document.getIcon('watch').outerHTML
    //             } Hour Tracking</a>
    //         </div>
    //         <div>
    //             <a href="https://icenter.saic.com/sites/peess/main/Wil/Shared%20Documents/Forms/AllItems.aspx" 
    //                class="card-link" 
    //                target="_blank">${
    //                 document.getIcon('folder-fill').outerHTML
    //             } My Shared Documents</a>
    //         </div>
    //         <div>
    //             <a href="https://icenter.saic.com/sites/peess/pedb/SiteAssets/SiteDataCapture/index.aspx" 
    //                class="card-link" 
    //                target="_blank">${
    //                 document.getIcon('download').outerHTML
    //             } Site Data Capture Module (icenter.saic.com)</a>
    //         </div>
    //         <div>
    //             <a href="https://info.health.mil/sites/stratp/medpei/peidb/Site%20Assets/UploadModule/index.html" 
    //                class="card-link" 
    //                target="_blank">${
    //                 document.getIcon('upload').outerHTML
    //             } Site Data Upload Module (info.health.mil)</a>
    //         </div>
    //     </div>`
    // })
    // .render();

    // container.get('button[data-view-matrix]').addEventListener('click', function(event){
    //     const EventTypesListId = Web.getListDetails(EventTypeListTitle).Id;
    //     const EventTypes = store.lists[EventTypesListId].data;
    //     return BuildDisplayMatrix(EventTypes);
    // });

    // WebInfosWidget(container);

    const homeviewdata = getHomeView();
    if (homeviewdata) layout = JSON.parse(homeviewdata.Properties);
    else layout = defaultHomeData;
    const columns = parseColumnData(layout);
    const columnLength = Number(layout.columnLength);

    new HomeView({
        parent: container.get('div[data-feature]'),
        columns,
        columnLength,
    }).init();

    if (User.hasRole(ADMINISTRATOR) 
    || User.hasRole(DEVELOPER)) new Component({
        tag: 'button',
        classList: 'btn btn-sm btn-primary me-2',
        attributes: [
            { name: 'data-method', value: homeviewdata ? 'patch' : 'post' },
            { name: 'data-url', value: homeviewdata?.__metadata?.uri },
        ],
        events: [{ name: 'click', action: ShowForm }],
        parent: container.get('div[data-edit]'),
        innerHTML: `${document.getIcon('pencil-square').outerHTML} Edit`,
    }).render();

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
    }

}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}` 
    || this.location.hash === '')
    {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();
    }
});