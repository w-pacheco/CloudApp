/**
 * SearchTextarea.js
 * @author Wilfredo Pacheco
 */

import Hash from "../src/Actions/Hash.js";
import CreateUUID from "../src/Actions/UUID.Create.js";
import Component from "../src/Classes/Component.js";
import Form from "../src/Classes/Form.js";
import UserSearch from "../src/Classes/UserSearch.js";

export default class SearchTextarea extends Form {

    constructor(arg){

        const {

            inModal = false,        // default is false;
            showDisplay = false,    // default is false;

            textarea,               // textarea used to hold data;
            view,
            headers,
            title,
            question,

        } = arg;

        /** Check the textarea passed and make sure it is an element; */
        if (!textarea instanceof HTMLElement 
        || !textarea instanceof Component) throw new Error('The textarea element is not defined correctly!');

        let parent;
        const uuid = CreateUUID();

        if (textarea instanceof HTMLElement) parent = textarea.closest('div.row');
        else if (textarea instanceof Component) parent = textarea.get().closest('div.row');
        
        const inModalStyleEl = inModal ? 
        /*html*/`
        <!-- used to render search results in modal -->
        <style>
            ul.ui-menu.ui-widget.ui-widget-content { z-index:2147483647 !important; }
        </style>` : 
        '';

        super({
            classList: 'g-3 needs-validation px-3',
            parent,
            innerHTML: /*html*/`
            <h5>${title}</h5>
            ${inModalStyleEl}
            <div class="row my-2">
                <div class="col mt-4">
                    <div class="col-12 d-inline-flex"><!-- Search Field -->
                        <input type="search" 
                            name="" 
                            class="form-control form-control-sm" 
                            id="inputUsers-${uuid}" 
                            placeholder="Search by name or email..." />
                            <!-- <button type="button" class="btn btn-primary btn-sm mx-2">Add</button> -->
                        <div class="py-2" id="inputUsers-display-${uuid}"></div>
                    </div>
                </div>
                <div class="col-lg-7" data-table-container></div>
            </div>`,
        });

        const table = new Component({
            tag: 'table',
            // classList: 'table table-sm f12 mt-3 mx-2',
            // classList: 'table table-sm f12 mx-2',
            classList: 'table table-sm f12',
            // parent: this,
            // parent: this.get('div.row'),
            parent: this.get('div[data-table-container]'),
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
        }).render();

        const component = this;
        const input = this.get('input[type="search"]');
        const display = this.get('div#inputUsers-display');
        const search_component = new UserSearch({

            type: 'user',
            modal: inModal,
            showDisplay,

            /** These are the elements used in the search; */
            input,
            display,

            /** 
             * NOTE: 
             * Example of custom Active Directory search; 
             * This replaces the existing liAction method, exposing the values to set the form;
             */
            liAction(user) {

                user.Email = user.EntityData.Email;
                user.Hash = Hash(user.Key);
                user.Account = JSON.stringify(user);

                const source_value = component.getData() || [];
                component.setData([user, source_value].flat());
                component.displayData();
                
                /** FIXME: the login name is set after the field clears; */
                return setTimeout(function(){
                    return component.clear();
                }, 100);

            },

        });

        this.headers = headers;
        this.textarea = textarea;
        this.view = view;
        this.inModal = inModal;
        this.uuid = uuid;
        this.showDisplay = showDisplay;
        this.table = table;
        this.question = question || 'Are you sure?';
        this.input = input;
        this.search_component = search_component;

        this.empty = /*html*/`
        <tr>
            <td></td>
            <td>No ${title}.</td>
            <td></td>
            <td></td>
        </tr>`;

        this.init();

    }

    getData(){

        let value;
        if (this.textarea instanceof HTMLElement) value = this.textarea.value;
        else if (this.textarea instanceof Component) value = this.textarea.get().value;

        if (value) value = JSON.parse(value);

        /** @returns Array or undefined; */
        return value;
        
    }

    setData(value){

        /** FIXME: This should check for the value passed to not be already in the JSON string; */
        
        if (this.textarea instanceof HTMLElement) this.textarea.value = JSON.stringify(value);
        else if (this.textarea instanceof Component) this.textarea.get().value = JSON.stringify(value);
        
        return this;

    }

    clearView(){
        return this.get('tbody').innerHTML = '';
    }

    displayData(){

        const component = this;
        const data = this.getData();
        const parent = this.get('tbody');
        const {
            empty,
            question,
        } = this;

        this.clearView();

        if (!data || !data?.length) return new Component({
            tag: 'tr',
            parent,
            innerHTML: empty,
        }).render();

        else data.forEach(function(account, index){

            const { DisplayText, Email, Key } = account;

            const tr = new Component({
                tag: 'tr',
                parent,
                innerHTML: /*html*/`
                <td>${DisplayText}</td>
                <td><a href="mailto:${Email}">${Email}</a></td>
                <td>${Key}</td>
                <td data-remove></td>`,
            }).render();

            new Component({
                tag: 'a',
                attributes: [
                    { name: 'data-index', value: index },
                    { name: 'href', value: 'javascript:;' },
                ],
                events: [{
                    name: 'click',
                    async action(event){

                        const { index } = this.dataset;
                        const approval = await swal(question, {
                            dangerMode: true,
                            buttons: true,
                        });

                        if (approval)
                        {
                            $(this)
                            .attr('disabled', '') /** Disable button; */
                            .html(/*html*/`<!-- Spinner Element -->
                            <span class="spinner-border spinner-border-sm" 
                                role="status" 
                                aria-hidden="true"
                            ></span>`);

                            $(tr.get()).fadeOut('fast', function(){

                                setTimeout(function(){
                                    tr.remove();
                                }, 800);

                                const INDEX = Number(index);
                                const data = component.getData();
                                data.splice(INDEX, 1);
                                component.setData(data);
                                component.displayData();
                                
                            });
                        }
                    }
                }],
                parent: tr.get('td[data-remove]'),
                innerText: 'Remove',
            }).render();

        });

    }

    init(){
        return this.displayData();
    }

}