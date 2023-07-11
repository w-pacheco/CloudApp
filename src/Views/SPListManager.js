/**
 * SPListManager.js
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, Route, User, DEVELOPER } from "../../app.js";
import AdministratorView from "../Classes/AdministratorView.js";
import Component from "../Classes/Component.js";
import Form from "../Classes/Form.js";
import View from "../Classes/View.js";
import { setLocationHash } from "./Administrator.js";

export const Title = 'SPListManager';
export const Icon = 'list';
export const SharePointBlue = '#0072c6';

export let view;
export let button;
export let container;

export function ToggleVersioning(event){
    
    const { List, checked } = this;
    const { type, uri } = List.__metadata;

    return Route.Patch(uri, {
        EnableVersioning: checked,
        __metadata: {
            type: type
        }
    })
    .then((data, statusText, xhr) => {
        if (xhr.status === 204) console.info(`${List.Title} versioning enabled | ${event.target.checked} | Update Successful!`);
    });
    
}

export function SPListManagerTab(menu, tabcontent){

    if (!User.hasRole('Developer')) return;

    view = new AdministratorView({
        Title,
        Icon,
        Menu: menu,
        tabContent: tabcontent,
        content: /*html*/`
        <div>
            <h1 class="mb-5">${Title}</h1>
            <table class="table table-sm table-hover" id="lists">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>ItemCount</th>
                        <th>Description</th>
                        <th class="d-none">IsCatalog</th>
                        <th class="d-none">IsPrivate</th>
                        <th>EnableVersioning</th>
                        <th>Link</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** Bootstrap 5 removes the default hash set by this element - this manually adds the hash; */
    button.get('a').addEventListener('click', setLocationHash);

    /** This is used to render the list details on the DOM; */
    for (const l of Web.Lists.results)
    {
        const { Title, Description, EnableVersioning, Id, IsCatalog, IsPrivate, ItemCount } = l;
        const { ServerRelativeUrl } = l.DefaultView;
        const GreenDot = document.getIcon('circle-fill');
        const RedDot = document.getIcon('circle-fill');
        GreenDot.classList.add('text-success');
        RedDot.classList.add('text-danger');
        
        const tr = new Component({
            tag: 'tr',
            attributes: [{ name: 'data-id', value: Id }],
            parent: container.querySelector('table#lists tbody'),
            innerHTML: /*html*/`
            <td>${Title}</td>
            <td class="text-center">${ItemCount}</td>
            <td>${Description}</td>
            <td class="text-center d-none">${
                IsCatalog ? 
                GreenDot.outerHTML : 
                RedDot.outerHTML
            }</td>
            <td class="text-center d-none">${
                IsPrivate ? 
                GreenDot.outerHTML : 
                RedDot.outerHTML
            }</td>
            <td class="version"></td>
            <td class="link"></td>
            <td class="deletelist"></td>`,
        }).render();

        /** Link to Microsoft SharePoint; */
        new Component({
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  ServerRelativeUrl ? 
            [
                { name: 'type', value: 'button' },
                { name: 'href', value: ServerRelativeUrl },
                { name: 'title', value: 'Visit SharePoint' },
                { name: 'target', value: '_blank' },
            ] : [
                { name: 'type', value: 'button' },
                { name: 'href', value: `javascript:alert('Sorry, this link is not available.');` },
            ],
            parent: tr.querySelector('td.link'),
            innerHTML: /*html*/ `
            <div class="pt-1 d-inline-flex">
                <span>Visit</span> <img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
            </div>`,
        }).render();

        /** Delete list from Microsoft SharePoint; */
        new Component({
            tag: 'button',
            classList: 'btn btn-sm btn-outline-danger',
            attributes:  [
                { name: 'type', value: 'button' },
                { name: 'src', value: l.__metadata.uri },
                { name: 'title', value: 'Delete List' },
            ],
            events: [{
                name: 'click',
                async action(event){

                    const Element = event.target.tagName === 'BUTTON' ? 
                    event.target :
                    event.target.closest('button');

                    const Url = Element.getAttribute('src');
                    if (window?.swal) await swal({
                        icon: 'warning',
                        text: `Are you sure you want to delete the ${Title} list?`,
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
                                closeModal: true,
                            },
                        },
                    })
                    .then(response => {
                        if (response) $(tr.get()).fadeOut('', function(){
                            return Route.Recycle(Url)
                            .then(data => {
                                return $(tr).remove();
                            });
                        });
                    });

                    else if (confirm(`Are you sure you want to delete the ${
                        Title
                    } list?`)) return $(tr.get()).fadeOut('', function(){
                        return Route.Recycle(Url)
                        .then(data => {
                            return $(tr).remove();
                        });
                    });
                }
            }],
            parent: tr.querySelector('td.deletelist'),
            innerHTML: /*html*/ `
            <div class="pt-1 d-inline-flex">
                <span>Delete</span> <img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
            </div>`,
        }).render();

        /** Versioning checkbox element; */
        const form = new Form({
            classList: 'row g-3 needs-validation',
            parent: container,
            attributes: [{ name: 'data-id', value: Id }],
            parent: tr.querySelector('td.version'),
            innerHTML: /*html*/`
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" role="switch" id="customSwitch-${Id}">
                <label class="custom-control-label" for="customSwitch-${Id}">Toggle Versioning</label>
            </div>`
        }).render();

        const SwitchElement = form.querySelector(`input#customSwitch-${Id}`);
        SwitchElement.List = l;
        SwitchElement.checked = EnableVersioning;
        SwitchElement.addEventListener('change', ToggleVersioning);
    }

    App.Views[Title] = {
        Title,
        view,
        button,
    }

}

export default function SPListManager(){

    const { Menu, tabContent } = Layout;

    if (!User.hasRole(DEVELOPER)) return;

    view = new View({
        Title,
        Icon,
        Menu,
        tabContent,
        content: /*html*/`
        <div>
            <div class="p-2 mb-5 d-inline-flex w-100 shadow-lg" style="background-color: ${SharePointBlue};border-radius: 0.5em;">
                <img class="ml-4" src="_layouts/15/images/siteIcon.png?rev=40" />
                <h2 class="text-white m-2 text-end w-100">Site Collection Lists</h2>
            </div>
            <table class="table table-sm table-hover" id="lists">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>IsCatalog</th>
                        <th>IsPrivate</th>
                        <th>EnableVersioning</th>
                        <th>Link</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** This is used to render the list details on the DOM; */
    for (const l of Web.Lists.results)
    {
        const { Title, Description, EnableVersioning, Id, IsCatalog, IsPrivate } = l;
        const { ServerRelativeUrl } = l.DefaultView;
        const GreenDot = document.getIcon('circle-fill');
        const RedDot = document.getIcon('circle-fill');
        GreenDot.classList.add('text-success');
        RedDot.classList.add('text-danger');
        
        const tr = new Component({
            tag: 'tr',
            attributes: [{ name: 'data-id', value: Id }],
            parent: container.querySelector('table#lists tbody'),
            innerHTML: /*html*/`
            <td>${Title}</td>
            <td>${Description}</td>
            <td class="text-center">${
                IsCatalog ? 
                GreenDot.outerHTML : 
                RedDot.outerHTML
            }</td>
            <td class="text-center">${
                IsPrivate ? 
                GreenDot.outerHTML : 
                RedDot.outerHTML
            }</td>
            <td class="version"></td>
            <td class="link"></td>
            <td class="deletelist"></td>`,
        }).render();

        /** Link to Microsoft SharePoint; */
        new Component({
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  ServerRelativeUrl ? 
            [
                { name: 'type', value: 'button' },
                { name: 'href', value: ServerRelativeUrl },
                { name: 'title', value: 'Visit SharePoint' },
                { name: 'target', value: '_blank' },
            ] : [
                { name: 'type', value: 'button' },
                { name: 'href', value: `javascript:alert('Sorry, this link is not available.');` },
            ],
            parent: tr.querySelector('td.link'),
            innerHTML: /*html*/ `
            <div class="pt-1">
                <span>Visit</span>&#160;<img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
            </div>`,
        }).render();

        /** Delete list from Microsoft SharePoint; */
        new Component({
            tag: 'button',
            classList: 'btn btn-sm btn-outline-danger',
            attributes:  [
                { name: 'type', value: 'button' },
                { name: 'src', value: l.__metadata.uri },
                { name: 'title', value: 'Delete List' },
            ],
            events: [{
                name: 'click',
                action: async function (event){
                    const Element = event.target.tagName === 'BUTTON' ? 
                    event.target :
                    event.target.closest('button');
                    // if (User.isDeveloper || confirm('Are you sure you want to delete this list?'))
                    if (confirm('Are you sure you want to delete this list?'))
                    {
                        const Url = Element.getAttribute('src');
                        const ReqDigest = await Route.GetRequestDigest();
                        $(tr.get()).fadeOut('', function(){
                            return Route.Recycle(Url, ReqDigest)
                            .then(data => {
                                return $(tr).remove();
                            });
                        });
                    }
                }
            }],
            parent: tr.querySelector('td.deletelist'),
            innerHTML: /*html*/ `
            <div class="pt-1">
                <span>Delete</span>&#160;<img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
            </div>`,
        }).render();

        /** Versioning checkbox element; */
        const form = new Form({
            classList: 'row g-3 needs-validation',
            parent: container,
            attributes: [{ name: 'data-id', value: Id }],
            parent: tr.querySelector('td.version'),
            innerHTML: /*html*/`
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" role="switch" id="customSwitch-${Id}">
                <label class="custom-control-label" for="customSwitch-${Id}">Toggle Versioning</label>
            </div>`
        }).render();

        const SwitchElement = form.querySelector(`input#customSwitch-${Id}`);
        SwitchElement.List = l;
        SwitchElement.checked = EnableVersioning;
        SwitchElement.addEventListener('change', ToggleVersioning);
    }

    App.Views[Title] = {
        Title,
        view,
        button,
    }

}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`)
    {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();
    }
});