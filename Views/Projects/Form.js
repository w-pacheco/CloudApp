/**
 * Form.js
 * @description Locations Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import { User } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import Component from "../../src/Classes/Component.js";
import UserSearch from "../../src/Classes/UserSearch.js";
import Hash from "../../src/Actions/Hash.js";
import TextareaJSON from "../../src/Classes/TextareaJSON.js";
// import EmailWidget from "../../Components/EmailWidget.js";
// import Component from "../../src/Classes/Component.js";

export let modal;
export let form;

export default async function ShowForm(data) {

    const isEvent = data instanceof Event;
    const Title = List.Title;
    const title = !isEvent ?
    `Edit ${Title}` :
    `New ${Title}`;

    /** Modal Buttons; */
    const buttons = [];
    (data && !isEvent) ?
    buttons.push({
        tag: 'button',
        type: 'patch',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        attributes: [{ name: 'src', value: data?.__metadata?.uri }],
        events: [{
            name: 'click',
            action: Patch,
        }],
    }) :
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{
            name: 'click',
            action: Post,
        }],
        customProperties: [{
            prop: 'callback',
            value() {
                return callback();
            }
        }],
    });

    /** The toast handles an undo method based on the item deleted; */
    if (data
    && !isEvent) buttons.push({
        tag: 'button',
        type: 'delete',
        classList: 'btn btn-danger btn-sm',
        innerText: 'Delete',
        attributes: [
            { name: 'src', value: data?.__metadata.uri },
            { name: 'data-recycle', value: true },
            { name: 'data-undo', value: true },
        ],
        events: [{ name: 'click', action: Delete }],
        customProperties: [{
            prop: 'callback',
            value() {
                modal?.hide();
                table.watcher();
            },
        }],
    });

    /** Link to SharePoint list item; */
    if (data
    && !isEvent
    && User.hasRole('Developer')) buttons.push({
        tag: 'a',
        classList: 'btn btn-sm',
        attributes: [
            { name: 'type', value: 'button' },
            { name: 'href', value: `${Web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
            { name: 'title', value: 'Visit SharePoint' },
            { name: 'target', value: '_blank' },
        ],
        innerHTML: /*html*/ `
    <div class="pt-1">
        <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>View</span>
    </div>`,
        role: 'Developer',
    });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    form = new Form({
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row g-3 my-2">
            <div class="col-xl-5 col-md-6 col-sm-12">
                <label for="inputProject" class="form-label">Project</label>
                <input type="text" name="Project" class="form-control form-control-sm" id="inputProject" required />
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-xl-2 col-md-4 col-sm-12">
                <label for="inputStatus" class="form-label">Status</label>
                <select name="Status" class="form-select form-select-sm" id="inputStatus" required>
                    <option value="Active">Active</option>
                    <option value="Complete">Complete</option>
                    <option value="Hold">Hold</option>
                </select>
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-lg-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea class="form-control" rows="4" id="inputDescription" name="Description" required></textarea>
            </div>
        </div>

        <div class="row g-3 my-2">
            <div class="col-md-6 col-sm-12">
                <label for="inputProductionURL" class="form-label">Production URL</label>
                <input type="url" name="ProductionURL" class="form-control form-control-sm" id="inputProductionURL" />
                <div class="invalid-feedback"></div>
                <div data-link-container></div>
            </div>
            <div class="col-md-6 col-sm-12">
                <label for="inputDevelopmentURL" class="form-label">Developement URL</label>
                <input type="url" name="DevelopmentURL" class="form-control form-control-sm" id="inputDevelopmentURL" />
                <div class="invalid-feedback"></div>
                <div data-link-container></div>
            </div>
        </div>

        <div class="row g-3 my-2">
            <div class="col-lg-12">
                <label for="inputMembers" class="form-label">Members</label>
                <textarea class="form-control" rows="4" id="inputMembers" name="Members" hidden disabled></textarea>
            </div>
        </div>
        <div class="row g-3 my-2">
            <!-- used to render search results in modal -->
            <style>
                ul.ui-menu.ui-widget.ui-widget-content { z-index:2147483647 !important; }
            </style>
            <div class="col-md-6 col-sm-12"><!-- Seach Field -->
                <input type="search" 
                    name="" 
                    class="form-control form-control-sm" 
                    id="inputUsers" 
                    placeholder="Search by name or email..." />
                <div class="py-2" id="inputUsers-display"></div>
            </div>
        </div>`,
    }).render();

    const memberTextAreanew = new TextareaJSON({
        /** Having the view here allows for the maximum customization on the table element; */
        view: {
            tag: 'table',
            classList: 'table table-sm mt-3 f-12',
            parent: modal.body,
            innerHTML: /*html*/`
            <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Key</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody></tbody>`,
        },
        /** Property value for the array of objects; */
        headers: [
            'DisplayText',
            'Email',
            'Key',
        ],
        source: form.get('textarea[name=Members]'),
        question: 'Are you sure you want to remove this item?',
        input: null,
    }).render();
    
    const UsersInput = form.get('input[type="search"]');
    const UsersDisplay = form.get('div#inputUsers-display');
    const UsersSearchManager = new UserSearch({

        type: 'user',
        modal: true,
        showDisplay: false,

        /** These are the elements used in the search; */
        input: UsersInput,
        display: UsersDisplay,

        /** 
         * NOTE: 
         * Example of custom Active Directory search; 
         * This replaces the existing liAction method, exposing the values to set the form;
         */
        select(event, li){

            const user = li.item.data;
            user.Email = user.EntityData.Email;
            user.Hash = Hash(user.Key);
            user.Account = JSON.stringify(user);

            /** Set the form with the user data, and clear the input element; */
            // form.Values.set(user);
            // console.info(user);
            memberTextAreanew.addData(user);

            UsersSearchManager.clear();
            
        },

    });

    /** FIXME: Should the links be saved in an array in order to save more than two? */
    const inputProductionURL = form.get('input[name="ProductionURL"]');
    const inputDevelopmentURL = form.get('input[name="DevelopmentURL"]');

    function URLChangeEvent(event){

        const value = this.value;
        if (value)
        {
            const dataLinkContainer = this.parentNode.querySelector('div[data-link-container]');   
            dataLinkContainer.innerHTML = '';
            return new Component({
                tag: 'a',
                classList: 'badge rounded-pill text-bg-primary float-end mt-3 me-1',
                attributes: [
                    { name: 'href', value },
                    { name: 'target', value: '_blank' },
                ],
                parent: dataLinkContainer,
                innerText: 'View',
            }).render();
        }

    }

    inputProductionURL.addEventListener('change', URLChangeEvent);
    inputDevelopmentURL.addEventListener('change', URLChangeEvent);

    /** Set for values if data is passed; */
    if (data && !isEvent)
    {
        form.Values.set(data);
        memberTextAreanew.displayData();
        inputProductionURL.dispatchEvent(new Event('change'));
        inputDevelopmentURL.dispatchEvent(new Event('change'));
    }

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}