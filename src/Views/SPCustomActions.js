/**
 * SPCustomActions.js
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, Route, User, DEVELOPER } from "../../app.js";
import AdministratorView from "../Classes/AdministratorView.js";
import Component from "../Classes/Component.js";
// import Form from "../Classes/Form.js";
import View from "../Classes/View.js";
import { setLocationHash } from "./Administrator.js";

import Form from "../Classes/Form.js";
import Modal from "../Classes/Modal.js";

export const Title = 'SPCustomActions';
export const Icon = 'list';
export const SharePointBlue = '#0072c6';

export const th = [{
    thead: 'Title',
    col: {
        data: 'DisplayText',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'ScriptSrc',
    col: {
        data: 'Key',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'Actions',
    col: {
        data: 'Email',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
}];

export let view;
export let button;
export let container;
export let table = {};
export let modal;
export let form;

function getUserCustomActions(){
    /*
    CommandUIExtension: null
    Description: null
    Group: null
    Id: "132af535-0b9b-4e50-a37c-2c96f290e9b4"
    ImageUrl: null
    Location: "ScriptLink"
    Name: "{132af535-0b9b-4e50-a37c-2c96f290e9b4}"
    RegistrationId: null
    RegistrationType: 0
    Rights: {__metadata: {…}, High: '0', Low: '0'}
    Scope: 3
    ScriptBlock: null
    ScriptSrc: "~sitecollection/main/Wil/TaskTracker/SiteAssets/tracker.js"
    Sequence: 1000
    Title: "/main/Wil/TaskTracker/SiteAssets/tracker.js"
    Url: null
    VersionOfUserCustomAction: "16.0.1.0"
    */
    return Route.Get(`${Web.Url}/_api/Web/UserCustomActions`, {
        // $select: 'Description,Id,ScriptSrc,Sequence,Title',
    })
    .then(data => data.d)
    .then(data => data.results);
}

function ShowForm(data){

    const isPointerEvent = data?.constructor?.name === 'PointerEvent';
    const ClipboardIcon = document.getIcon('clipboard');
    // const Title = List.Title;
    const title = data && !isPointerEvent ? 
    `Edit ${Title}` : 
    `New ${Title}`;

    /** Modal Buttons; */
    const buttons = [];
    (data && !isPointerEvent) ? 
    buttons.push({
        tag: 'button',
        type: 'patch',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        attributes: [{ name: 'src', value: data?.__metadata?.uri }],
        // events: [{
        //     name: 'click',
        //     action: Patch,
        // }],
    }) : 
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{
            name: 'click',
            async action(event){

                const root = Web.SiteLogoUrl.split('/SiteAssets')[0];
                const site = Web.ServerRelativeUrl.replace(root, '');

                const isPointerEvent = event?.constructor?.name === 'PointerEvent';
                let Element, OriginalHTML;

                if (isPointerEvent)
                {
                    Element = event.target.tagName === 'BUTTON' ? 
                    event.target : 
                    event.target.closest('button');

                    OriginalHTML = Element.innerHTML;

                    $(Element)
                    .attr('disabled', '') /** Disable button; */
                    .html(/*html*/`
                    <span class="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true">
                    </span> Loading...`);
                }

                const ReqDigest = await Route.GetRequestDigest();
                const request = form.Values.get();
                request.Location = 'ScriptLink';
                request.__metadata = { type: 'SP.UserCustomAction' };
                request.ScriptSrc = `~sitecollection${site}/${request.Url}`;
                request.Title = `${site}/${request.Url}`;

                delete request.Url;

                return Route.Post(`${
                    Web.Url
                }/_api/Web/UserCustomActions`, request, ReqDigest)
                .then(data => {
                    
                    modal?.hide();
                    table?.refresh();
                    
                    if (isPointerEvent) $(Element)
                    .html(OriginalHTML)
                    .removeAttr('disabled');

                });
            }
        }],
    });

    // if (data 
    // && !isPointerEvent) buttons.push({
    //     tag: 'button',
    //     type: 'delete',
    //     classList: 'btn btn-danger btn-sm',
    //     innerText: 'Delete',
    //     attributes: [
    //         { name: 'src', value: data?.__metadata.uri },
    //         { name: 'data-recycle', value: true },

    //         /** NOTE: If they item was set to recycle true, this would allow the undo method; */
    //         // { name: 'data-undo', value: true },

    //         /** NOTE: If they item was set to delete true, this would delete the item and bypass recycle; */
    //         // { name: 'data-delete', value: true },
    //     ],
    //     events: [{ name: 'click', action: Delete }],
    //     customProperties: [{
    //         prop: 'callback',
    //         value(){
    //             modal?.hide();
    //             table.refresh();
    //         },
    //     }],
    // });

    /** Link to SharePoint list item; */
    // if (data 
    // && !isPointerEvent 
    // && User.hasRole('Developer')) buttons.push({
    //     tag: 'a',
    //     classList: 'btn btn-sm',
    //     attributes:  [
    //         { name: 'type', value: 'button' },
    //         { name: 'href', value: `${Web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
    //         { name: 'title', value: 'Visit SharePoint' },
    //         { name: 'target', value: '_blank' },
    //     ],
    //     innerHTML: /*html*/ `
    //     <div class="pt-1">
    //         <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>View</span>
    //     </div>`,
    //     role: 'Developer',
    // });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    form = new Form({
        classList: 'g-3 needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${Title} Form -->
        <div class="row my-2">
            <!-- Display Name -->
            <div class="col-lg-6 col-md-12">
                <label for="inputTitle" class="form-label">Title</label>
                <input type="text" 
                       name="Title" 
                       class="form-control form-control-sm" 
                       id="inputTitle" 
                       placeholder="Title" />
            </div>
            <div class="col-lg-3 col-md-12">
                <label for="inputSequence" class="form-label">Sequence</label>
                <input type="number" 
                    name="Sequence" 
                    class="form-control form-control-sm" 
                    id="inputSequence"
                    value="1000"  
                    placeholder="1000" />
            </div>
        </div>
        
        <div class="row my-2">
            <!-- Key Input -->
            <div class="col-lg-6 col-md-12">
                <label for="inputUrl" class="form-label">Url</label>
                <input type="text" 
                       name="Url" 
                       class="form-control form-control-sm" 
                       id="inputUrl" 
                       value="SiteAssets/App/custom-actions/custom.js" 
                       placeholder="SiteAssets/custom.js" />
            </div>
        </div>
        
        <div class="row my-2">
            <div class="col-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea name="Description" 
                          class="form-control" 
                          id="inputDescription" 
                          cols="30" 
                          rows="4"
                ></textarea>
            </div>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data) form.Values.set(data);
    form.Fields.focus();

    return modal.show();
}

export function SPCustomActionsTab(menu, tabcontent){

    if (!User.hasRole(DEVELOPER)) return;

    view = new AdministratorView({
        Title,
        Icon,
        Menu: menu,
        tabContent: tabcontent,
        content: /*html*/`
        <h1 class="mb-4">User Custom Actions Configuration</h1>
        <p>This page lists the current user custom actions configured for the current site and site collection.</p>
        <div class="row w-100">
            <div class="col-12 p-0 my-3">
                <div class="d-flex justify-content-end">
                    <div class="btn-group" id="${Title.toLocaleLowerCase()}" role="group" aria-label="">
                        <button class="btn btn-outline-secondary" data-new>
                            <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="font-size: 1.25em;"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path></svg>
                        </button>
                        <button class="btn btn-outline-secondary" data-refresh>
                            <svg class="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="font-size: 1.25em;"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Display Container for saved site collection user custom actions -->
            <div class="col" id="custom-actions">
                <div class="">
                    <table class="table table-sm mt-2">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>ScriptSrc</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** Bootstrap 5 removes the default hash set by this element - this manually adds the hash; */
    button.get('a').addEventListener('click', setLocationHash);

    // const CustomActionsContainer = document.querySelector('div#custom-actions');
    const ActionsTableBody = container.querySelector('table tbody');

    function renderTableRows(ca){

        const { Title, ScriptSrc, __metadata } = ca;
        
        const tr = new Component({
            tag: 'tr',
            parent: ActionsTableBody,
            innerHTML: /*html*/`
            <td>${Title}</td>
            <td>${ScriptSrc}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" src="${__metadata.uri}" data-remove class="btn btn-secondary btn-sm remove">Remove</button>
                </div>
            </td>`
        }).render();

        tr.get('button[data-remove]').addEventListener('click', async function Remove(event){
        
            const Element = event.target.tagName === 'BUTTON' ? 
            event.target : 
            event.target.closest('button');

            $(Element)
            .attr('disabled', '') // Disable button;
            .html(/*html*/`
            <span class="spinner-border spinner-border-sm" 
                    role="status" 
                    aria-hidden="true"
            ></span> Sending Request`);
            
            const ReqDigest = await Route.GetRequestDigest();
            const Url = Element.getAttribute('src');

            console.info(Url, ReqDigest);

            return Route.Delete(Url, ReqDigest)
            .then(data => {
                $(tr.get()).fadeOut();
                // return location.reload();
            });
        });

    }

    const NewBtn = container.get('button[data-new]');
    const RefreshBtn = container.get('button[data-refresh]');

    NewBtn.addEventListener('click', ShowForm);
    RefreshBtn.addEventListener('click', function (event){

        const isPointerEvent = event?.constructor?.name === 'PointerEvent';
        let Element, OriginalHTML;

        if (isPointerEvent)
        {
            Element = event.target.tagName === 'BUTTON' ? 
            event.target : 
            event.target.closest('button');

            OriginalHTML = Element.innerHTML;

            $(Element)
            .attr('disabled', '') /** Disable button; */
            .html(/*html*/`
            <span class="spinner-border spinner-border-sm" 
                role="status" 
                aria-hidden="true">
            </span> Loading...`);
        }
        
        $(ActionsTableBody).empty();

        getUserCustomActions()
        .then(data => {
            data.forEach(renderTableRows);        
        })
        .then(() => {
            if (isPointerEvent) $(Element)
            .html(OriginalHTML)
            .removeAttr('disabled');
        });

    });

    Web?.UserCustomActions?.results.forEach(renderTableRows);

    Object.assign(table, {
        refresh(){
            RefreshBtn.click();
        },
    });

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
    }

}

export default function SPCustomActions(){

    const { Menu, tabContent } = Layout;

    if (!User.hasRole(DEVELOPER)) return;

    view = new View({
        Title,
        Icon,
        Menu,
        tabContent,
        content: /*html*/``,
        // content: /*html*/`
        // <div>
        //     <div class="p-2 mb-5 d-inline-flex w-100 shadow-lg" style="background-color: ${SharePointBlue};border-radius: 0.5em;">
        //         <img class="ml-4" src="_layouts/15/images/siteIcon.png?rev=40" />
        //         <h2 class="text-white m-2 text-end w-100">Site Collection Lists</h2>
        //     </div>
        //     <table class="table table-sm table-hover" id="lists">
        //         <thead>
        //             <tr>
        //                 <th>Title</th>
        //                 <th>Description</th>
        //                 <th>IsCatalog</th>
        //                 <th>IsPrivate</th>
        //                 <th>EnableVersioning</th>
        //                 <th>Link</th>
        //                 <th>Delete</th>
        //             </tr>
        //         </thead>
        //         <tbody></tbody>
        //     </table>
        // </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** This is used to render the list details on the DOM; */
    // for (const l of Web.Lists.results)
    // {
    //     const { Title, Description, EnableVersioning, Id, IsCatalog, IsPrivate } = l;
    //     const { ServerRelativeUrl } = l.DefaultView;
    //     const GreenDot = document.getIcon('circle-fill');
    //     const RedDot = document.getIcon('circle-fill');
    //     GreenDot.classList.add('text-success');
    //     RedDot.classList.add('text-danger');
        
    //     const tr = new Component({
    //         tag: 'tr',
    //         attributes: [{ name: 'data-id', value: Id }],
    //         parent: container.querySelector('table#lists tbody'),
    //         innerHTML: /*html*/`
    //         <td>${Title}</td>
    //         <td>${Description}</td>
    //         <td class="text-center">${
    //             IsCatalog ? 
    //             GreenDot.outerHTML : 
    //             RedDot.outerHTML
    //         }</td>
    //         <td class="text-center">${
    //             IsPrivate ? 
    //             GreenDot.outerHTML : 
    //             RedDot.outerHTML
    //         }</td>
    //         <td class="version"></td>
    //         <td class="link"></td>
    //         <td class="deletelist"></td>`,
    //     }).render();

    //     /** Link to Microsoft SharePoint; */
    //     new Component({
    //         tag: 'a',
    //         classList: 'btn btn-sm btn-outline-secondary',
    //         attributes:  ServerRelativeUrl ? 
    //         [
    //             { name: 'type', value: 'button' },
    //             { name: 'href', value: ServerRelativeUrl },
    //             { name: 'title', value: 'Visit SharePoint' },
    //             { name: 'target', value: '_blank' },
    //         ] : [
    //             { name: 'type', value: 'button' },
    //             { name: 'href', value: `javascript:alert('Sorry, this link is not available.');` },
    //         ],
    //         parent: tr.querySelector('td.link'),
    //         innerHTML: /*html*/ `
    //         <div class="pt-1">
    //             <span>Visit</span> <img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
    //         </div>`,
    //     }).render();

    //     /** Delete list from Microsoft SharePoint; */
    //     new Component({
    //         tag: 'button',
    //         classList: 'btn btn-sm btn-outline-danger',
    //         attributes:  [
    //             { name: 'type', value: 'button' },
    //             { name: 'src', value: l.__metadata.uri },
    //             { name: 'title', value: 'Delete List' },
    //         ],
    //         events: [{
    //             name: 'click',
    //             action: async function (event){
    //                 const Element = event.target.tagName === 'BUTTON' ? 
    //                 event.target :
    //                 event.target.closest('button');
    //                 // if (User.isDeveloper || confirm('Are you sure you want to delete this list?'))
    //                 if (confirm('Are you sure you want to delete this list?'))
    //                 {
    //                     const Url = Element.getAttribute('src');
    //                     const ReqDigest = await Route.GetRequestDigest();
    //                     $(tr.get()).fadeOut('', function(){
    //                         return Route.Recycle(Url, ReqDigest)
    //                         .then(data => {
    //                             return $(tr).remove();
    //                         });
    //                     });
    //                 }
    //             }
    //         }],
    //         parent: tr.querySelector('td.deletelist'),
    //         innerHTML: /*html*/ `
    //         <div class="pt-1">
    //             <span>Delete</span> <img style="width: 21px;" src="/_layouts/15/images/favicon.ico?rev=23" />
    //         </div>`,
    //     }).render();

    //     /** Versioning checkbox element; */
    //     const form = new Form({
    //         classList: 'row g-3 needs-validation',
    //         parent: container,
    //         attributes: [{ name: 'data-id', value: Id }],
    //         parent: tr.querySelector('td.version'),
    //         innerHTML: /*html*/`
    //         <div class="form-check form-switch">
    //             <input type="checkbox" class="form-check-input" role="switch" id="customSwitch-${Id}">
    //             <label class="custom-control-label" for="customSwitch-${Id}">Toggle Versioning</label>
    //         </div>`
    //     }).render();

    //     const SwitchElement = form.querySelector(`input#customSwitch-${Id}`);
    //     SwitchElement.List = l;
    //     SwitchElement.checked = EnableVersioning;
    //     SwitchElement.addEventListener('change', ToggleVersioning);
    // }

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