/**
 * Form.js
 * @description Ranks Form
 * @author Wilfredo Pacheco
 */

import Component from "../../src/Classes/Component.js";
import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import { User, Route, Web, store, DEVELOPER } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import { Title as BranchesListTitle } from '../Branches/List.js'

export let modal;
export let form;

export default async function ShowForm(data){

    const isPointerEvent = data?.constructor?.name === 'PointerEvent';
    const Title = List.Title;
    const title = !isPointerEvent ? 
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
        events: [{ name: 'click', action: Patch }],
    }) : 
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{ name: 'click', action: Post }],
        customProperties: [{
            prop: 'callback',
            value(){
                return callback();
            }
        }],
    });

    /** The toast handles an undo method based on the item deleted; */
    if (data 
    && !isPointerEvent) buttons.push({
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
            value(){
                modal?.hide();
                table.watcher();
            },
        }],
    });

    /** Link to SharePoint list item; */
    if (data 
    && !isPointerEvent 
    && User.hasRole(DEVELOPER)) buttons.push({
        tag: 'a',
        classList: 'btn btn-sm',
        attributes:  [
            { name: 'type', value: 'button' },
            { name: 'href', value: `${Web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
            { name: 'title', value: 'Visit SharePoint' },
            { name: 'target', value: '_blank' },
        ],
        innerHTML: /*html*/ `
        <div class="pt-1">
            <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>View</span>
        </div>`,
    });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    form = new Form({
        classList: 'g-3 needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row my-2">
            <div class="col-md-4 col-sm-12">
                <label for="inputRank" class="form-label">Rank</label>
                <input type="text" id="inputRank" name="Rank" class="form-control" required />
            </div>
            <div class="col-md-4 col-sm-12">
                <label for="inputGrade" class="form-label">Grade</label>
                <input type="text" id="inputGrade" name="Grade" class="form-control form-control-sm" required />
            </div>
            <div class="col-md-4 col-sm-12">
                <label for="inputBranch" class="form-label">Branch</label>
                <select id="inputBranch" name="Branch" class="form-select form-select-sm" required></select>
            </div>
        </div>`,
    }).render();

    const BranchesSelectElement = form.get('select[name="Branch"]'); // first we get the element of the select we want to target and save it to a variable
    const BranchesId = Web.getListDetails(BranchesListTitle).Id;
    const Branches = store.lists[BranchesId].data;

    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: BranchesSelectElement, //Pass in the select element variable as a parent
        innerText: 'Choose...',
    }).render();

    Branches.forEach(function({ Branch }){ // then we do a forEach() to create an option for each list item
        return new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: Branch }],
            parent: BranchesSelectElement,
            innerText: Branch
        }).render();
    });

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}