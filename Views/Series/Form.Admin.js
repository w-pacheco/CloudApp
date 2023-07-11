/**
 * Form.js
 * @description Series Form
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
import getProjectsByStatus from "../Projects/getProjectsByStatus.js";
import Component from "../../src/Classes/Component.js";
import getQuestionsByFK from "../Questions/getQuestionsByFK.js";
import createQuestion from "../Questions/createQuestion.js";
import { service } from "../../src/Biome.js";

export let modal;
export let form;

export default async function ShowForm(data) {

    const ActiveProjects = await getProjectsByStatus('Active');

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
            <div class="col-xl-5 col-lg-6 col-sm-12">
                <label for="inputSeriesTitle" class="form-label">Series Title</label>
                <input type="text" name="SeriesTitle" class="form-control form-control-sm" id="inputSeriesTitle" required />
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-xl col-md-7 col-sm-12">
                <label for="inputProject_FK" class="form-label">Project</label>
                <select name="Project_FK" class="form-select form-select-sm" id="inputProject_FK" required>
                    <option value="">Choose...</option>
                </select>
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
        <hr>
        <div data-question-display>
            <h5 class="my-2">Questions</h5>
        </div>
        <div class="row g-3 my-2" hidden>
            <div class="col-lg-12">
                <label for="inputQuestionsData" class="form-label">QuestionsData</label>
                <textarea class="form-control" rows="4" id="inputQuestionsData" data-question-store disabled></textarea>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-lg-12">
                <label for="inputQuestion" class="form-label">New Question</label>
                <textarea class="form-control" rows="4" id="inputQuestion" data-question></textarea>
            </div>
            <div class="col-lg-12 text-end">
                <button class="btn btn-sm btn-success" type="button" data-add-question>Add</button>
            </div>
        </div>`,
    }).render();

    const ProjectSelectEl = form.get('select[name="Project_FK"]');
    const AddBtn = form.get('button[data-add-question]');
    const QuestionEl = form.get('textarea[data-question]');
    const QuestionStore = form.get('textarea[data-question-store]');
    const QuestionDisplayEl = form.get('div[data-question-display]');
    const QuestionTable = new Component({
        tag: 'table',
        classList: 'table table-sm mt-3 f-12',
        parent: QuestionDisplayEl,
        innerHTML: /*html*/`
        <thead>
            <tr>
                <th class="col-6">Question</th>
                <th class="text-center">Response</th>
                <th>Editor</th>
                <th>Modified</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody></tbody>`,
    }).render();

    function clearQuestionTable(){
        QuestionTable.get('tbody').innerHTML = '';
    }

    function getQuestionsData(){
        let qStore = QuestionStore.value;
        if (!qStore) qStore = [];
        else qStore = JSON.parse(qStore);
        return qStore;
    }

    function displayQuestions(){

        let qStore = QuestionStore.value;
        if (!qStore) qStore = [];
        else qStore = JSON.parse(qStore);

        clearQuestionTable();

        const checkIcon = document.getIcon('check-circle-fill');
        const xIcon = document.getIcon('x-circle-fill');
        checkIcon.classList.add('text-success');
        xIcon.classList.add('text-danger');

        qStore.forEach(function({ Question, Response, Editor, Modified }, index){

            const tr = new Component({
                tag: 'tr',
                parent: QuestionTable.get('tbody'),
                innerHTML: /*html*/`
                <td>${Question}</td>
                <td class="text-center">${!!Response ? checkIcon.outerHTML : xIcon.outerHTML }</td>
                <td>${!!Response ? Editor.Title : 'N/A'}</td>
                <td>${!!Response ? new Date(Modified).toLocaleString() : 'N/A'}</td>
                <td data-remove></td>`
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
                       
                        $(this)
                        .attr('disabled', '') /** Disable button; */
                        .html(/*html*/`<!-- Spinner Element -->
                        <span class="spinner-border spinner-border-sm" 
                              role="status" 
                              aria-hidden="true"
                        ></span>`);

                        $(tr.get()).fadeOut('fast', function(){
                            
                            const INDEX = Number(index);
                            const data = getQuestionsData();

                            /** Get the item removed; */
                            const itemArray = data.splice(INDEX, 1);
                            const item = itemArray[0];

                            /** If the item holds a metadata value then it should send a delete request; */
                            if (item?.__metadata) service.recycle(item.__metadata.uri);
                            
                            setQuestions(data);
                            displayQuestions();
                            
                        });
                        
                    }
                }],
                parent: tr.get('td[data-remove]'),
                innerText: 'Remove',
            }).render();
            
        });

    }

    function setQuestions(questions){
        QuestionStore.value = JSON.stringify(questions);
    }

    /** TODO: This should get the value from the question field, add it to the question data field, clear the question field */
    AddBtn.addEventListener('click' , function(event){

        const Question = QuestionEl.value;
        if (!Question) return;

        let qStore = QuestionStore.value;
        if (!qStore) qStore = [];
        else qStore = JSON.parse(qStore);

        qStore.push({
            Question,
            Project_FK: null, // this SHOULD never be null after the SharePoint REST API call;
            Series_FK: null, // this will be null if the series is a POST;
        });

        QuestionStore.value = JSON.stringify(qStore, null, 2);
        /** TODO: They are going to want to sort the questions; */
        QuestionEl.value = '';

        /** TODO: displayQuestions */
        displayQuestions();

    });

    /** Add all active projects to the drop down; */
    const ProjectsEl = form.get('select[name="Project_FK"]');
    ActiveProjects.forEach(function({ Project, GUID }){
        return new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: GUID }],
            parent: ProjectsEl,
            innerText: Project,
        }).render();
    });

    /** Sets the project fk when the series is created; */
    ProjectSelectEl.addEventListener('change', function(){
        form.setAttribute('data-project-fk', ProjectSelectEl.value);
    });

    form.get().setCustomProperty('callback', async function(series_fk){

        const Project_FK = form.getAttribute('data-project-fk');
        const Series_FK = form.getAttribute('data-series-fk') || series_fk;
        const questions = getQuestionsData();

        for (const q of questions)
        {
            const { Question } = q;
            // The question needs to be created and this will be a POST;
            if (!q.Id) await createQuestion({
                Question,
                Project_FK,
                Series_FK,
            });
        }

    });

    /** Set for values if data is passed; */
    if (data && !isEvent)
    {
        form.Values.set(data);
        form.setAttribute('data-project-fk', data.Project_FK);
        form.setAttribute('data-series-fk', data.GUID);

        /** Disable the project selection to prevent the changing of project questions; */
        ProjectSelectEl.setAttribute('disabled', '');
        
        const questions = await getQuestionsByFK(data.GUID);
        setQuestions(questions);

        displayQuestions();
    }

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}