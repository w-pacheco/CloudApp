/**
 * Home.edit.js
 * @author Wilfredo Pacheco
 */

import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import Component from "../../src/Classes/Component.js";
import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import Toast from "../../src/Classes/Toast.js";
import { updateHomeView, createHomeView } from "./HomeView.js";
import { layout } from "./View.js";

export let modal;
export let form;

function iconChange(event){
    const value = this.value;
    if (value)
    {
        const icon = document.getIcon(value).outerHTML;
        this.parentNode.querySelector('span[data-display]').innerHTML = icon;
    }
    else this.parentNode.querySelector('span[data-display]').innerHTML = '';
}

export default async function ShowForm(event){

    const element = this;
    const isEvent = event instanceof Event;
    const data = layout;

    const title = `Edit Home View`;
    const buttons = [{
        tag: 'button',
        type: 'patch',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        // attributes: [{ name: 'src', value: data?.__metadata?.uri }],
        events: [{
            name: 'click',
            async action(event){

                const Element = this;

                $(Element)
                .attr('disabled', '') /** Disable button; */
                .html(/*html*/`<!-- Spinner Element -->
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                </span> Sending Request...`);

                const request = form.Values.get();
                form.validate();

                if (element.dataset.method === 'post') await createHomeView(request);
                else if (element.dataset.method === 'patch') await updateHomeView(element.dataset.url, request);

                $(Element).text('Success!');
                modal.hide();

                /** Alert; */
                new Toast({
                    type: 'success',
                    message: 'Your request was successful.',
                })
                .render()
                .show();

                return swal({
                    icon: 'warning',
                    text: 'The application requires a reload to display all changes.',
                })
                .then(response => {
                    return location.reload();
                });

                // Array.from(form.querySelectorAll('div[data-row]'))
                // .forEach(function(div){
                //     const value = div.dataset.row;
                //     console.info(value);
                //     const elements = Array.from(div.querySelectorAll(`*[data-${value}]`));
                //     console.info(elements);

                //     elements.forEach(el => {

                //         const name = el.getAttribute('name');
                //         const value = el.value;
                //         const obj = {};
                //         obj[name] = value;
                //         console.info(obj);

                //     });
                // });

            }
        }],
    }];
    
    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    form = new Form({
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- {List.Title} Form -->
        <div class="row mt-2 mb-4">
            <div class="col-md-3 col-sm-12">
                <label for="inputColumns" class="form-label">Number of Columns</label>
                <select id="inputColumns" name="columnLength" class="form-select form-select-sm" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
        </div>
        <div data-row="left">
            <div class="row g-3 my-2">
                <div class="col-md-6 col-sm-12">
                    <label for="inputHeader" class="form-label">Header</label>
                    <input type="text" id="inputHeader" name="header-left" class="form-control form-control-sm" data-left />
                </div>
                <div class="col-md-4 col-sm-12">
                    <label for="inputIcon" class="form-label">Icon <span class="" data-display></span></label>
                    <select id="inputIcon" name="icon-left" class="form-select form-select-sm" data-left>
                        <option value="">Choose...</option>
                    </select>
                </div>
                <div class="col-md-2 col-sm-12" hidden>
                    <div class="form-check mt-4 pt-3">
                        <input class="form-check-input" type="checkbox" name="icon-left-show" value="" id="inputShowIcon" />
                        <label class="form-check-label" for="inputShowIcon">
                            Show Icon
                        </label>
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <label for="inputContent" class="form-label">Content</label>
                    <textarea class="form-control" rows="8" id="inputContent" name="content-left" data-left></textarea>
                </div>
            </div>
        </div>
        <div data-row="center">
            <div class="row g-3  my-2">
                <div class="col-md-6 col-sm-12">
                    <label for="inpinputHeaderutRank" class="form-label">Header</label>
                    <input type="text" id="inputHeader" name="header-center" class="form-control form-control-sm" data-center />
                </div>
                <div class="col-md-4 col-sm-12">
                    <label for="inputIcon" class="form-label">Icon <span class="" data-display></span></label>
                    <select id="inputIcon" name="icon-center" class="form-select form-select-sm" data-center>
                        <option value="">Choose...</option>
                    </select>
                </div>
                <div class="col-md-2 col-sm-12" hidden>
                    <div class="form-check mt-4 pt-3">
                        <input class="form-check-input" type="checkbox" name="icon-right-show" value="" id="inputShowIcon" />
                        <label class="form-check-label" for="inputShowIcon">
                            Show Icon
                        </label>
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <label for="inputContent" class="form-label">Content</label>
                    <textarea class="form-control" rows="8" id="inputContent" name="content-center" data-center></textarea>
                </div>
            </div>
        </div>
        <div data-row="right">
            <div class="row g-3 my-2">
                <div class="col-md-6 col-sm-12">
                    <label for="inputHeader" class="form-label">Header</label>
                    <input type="text" id="inputHeader" name="header-right" class="form-control form-control-sm" placeholder="DCIR Event Types" data-right />
                </div>
                <div class="col-md-4 col-sm-12">
                    <label for="inputIcon" class="form-label">Icon <span class="" data-display></span></label>
                    <select id="inputIcon" name="icon-right" class="form-select form-select-sm" data-right>
                        <option value="">Choose...</option>
                    </select>
                </div>
                <div class="col-md-2 col-sm-12" hidden>
                    <div class="form-check mt-4 pt-3">
                        <input class="form-check-input" type="checkbox" name="icon-right-show" value="" id="inputShowIcon" />
                        <label class="form-check-label" for="inputShowIcon">
                            Show Icon
                        </label>
                    </div>
                </div>
            </div>
            <div class="row g-3 my-2">
                <div class="col-md-4 col-sm-12">
                    <label for="inputtext" class="form-label">Action Text</label>
                    <input class="form-control form-control-sm" id="inputtext" type="text" name="text-right" data-right value="View DCIR Event Types" id="inputaction" />
                </div>
                <div class="col-md-4 col-sm-12">
                    <label for="inputaction" class="form-label">Action Action</label>
                    <select id="inputaction" name="action-right" class="form-select form-select-sm" data-right required disabled>
                        <option value="">Choose...</option>
                        <option value="showMatrix">showMatrix</option>
                    </select>
                </div>
            </div>
            <div class="row g-3 my-2">
                <div class="col-12">
                    <label for="inputContent" class="form-label">Content</label>
                    <textarea class="form-control" rows="8" id="inputContent" name="content-right" data-right></textarea>
                </div>
            </div>
        </div>`,
    }).render();

    const ICONS = document.listAllIcons().map(str => str.replace('bi bi-', '').trim());
    const iconElement1 = form.get('select[name="icon-left"]');
    const iconElement2 = form.get('select[name="icon-center"]');
    const iconElement3 = form.get('select[name="icon-right"]');
    // const columnsSelectEl = form.get('select[name="columns"]');
    // const columnsinputEl = form.get('input[name="columns"]');

    ICONS.forEach(icon => {

        const element = {
            tag: 'option',
            attiributes: [{ name: 'value', value: icon }],
            innerHTML: /*html*/`
            ${document.getIcon(icon).outerHTML} ${icon}`,
        }

        new Component(Object.assign(element, {
            parent: iconElement1,
        })).render();

        new Component(Object.assign(element, {
            parent: iconElement2,
        })).render();
        
        new Component(Object.assign(element, {
            parent: iconElement3,
        })).render();

    });
        
    iconElement1.addEventListener('change', iconChange);
    iconElement2.addEventListener('change', iconChange);
    iconElement3.addEventListener('change', iconChange);

    form.addEventListener('set', function(event){
        if (iconElement1.value) iconElement1.dispatchEvent(new Event('change'));
        if (iconElement2.value) iconElement2.dispatchEvent(new Event('change'));
        if (iconElement3.value) iconElement3.dispatchEvent(new Event('change'));
    });

    // columnsSelectEl.addEventListener('change', function(event){
    //     columnsinputEl.value = columnsSelectEl.value;
    // });

    /** Set for values if data is passed; */
    if (data && isEvent) form.Values.set(data);

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();

}