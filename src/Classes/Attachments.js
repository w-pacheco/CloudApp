/**
 * Attachments.js
 * @author Wilfredo Pacheco
 */

import { service as sp_service } from "../Biome.js";
import Component from "./Component.js";
import Store from "./Store.js";

/** Convert the file to an array buffer; */
export function GetFileBuffer(attachment){
    let deferred = $.Deferred();            // Chainable utility object that register, invoke and relay multiple callbacks/success/failure of any synch/async function;
    let reader = new FileReader();          // Creates new instance of FileReader();
    reader.onloadend = function(e){         // Handles the instace of FileReader and returns the promise when the file is loaded in the reader;
        deferred.resolve(e.target.result);
    }
    reader.onerror = function(e){           // Handles errors;
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(attachment);   // The file is loaded to the array buffer;
    return deferred.promise();              // The Promise is returned to upload();
}

export function UploadRequestBody(param){

    const { Url, name, arrayBuffer, ReqDigest } = param;

    function success(data, textStatus, xhr){
        console.info(`${name} upload successful!`);
    }

    function error(response){
        /** FIXME: should this be reported in the error log? */
        console.info(response);
    }

    // This one is used on document libraries;
    // this.url = `${Url}/Files/add(url='${name}')`;

    // This one is used for List item attachments;
    this.url = `${Url}/AttachmentFiles/add(FileName='${name}')`;
    this.method = 'POST';
    this.data = arrayBuffer;
    this.processData = false;

    this.headers = {
        'Accept': 'application/json; odata=verbose',
        'Content-Type': 'application/json; odata=verbose',
        'X-RequestDigest': ReqDigest,
    }

    this.success = success;
    this.error = error;

    return this;
}

export const SuiteList = [{
    "class": "primary",
    "ext": "docx",
    "suite": "ms-word:ofv|u|"
},{
    "class": "success",
    "ext": "xls",
    "suite": "ms-excel:ofv|u|"
},{
    "class": "primary",
    "ext": "doc",
    "suite": "ms-word:ofv|u|"
},{
    "class": "success",
    "ext": "xlsm",
    "suite": "ms-excel:ofv|u|"
},{
    "class": "success",
    "ext": "xlsx",
    "suite": "ms-excel:ofv|u|"
},{
    "class": "success",
    "ext": "xltm",
    "suite": "ms-excel:ofv|u|"
},{
    "class": "danger",
    "ext": "pptx",
    "suite": "ms-powerpoint:ofv|u|"
},{
    "class": "success",
    "ext": "xltx",
    "suite": "ms-excel:ofv|u|"
},{
    "class": null,
    "ext": "pdf",
    "suite": null
},{
    "class": "success",
    "ext": "xlsb",
    "suite": "ms-excel:ofv|u|"
}];

export default class Attachments extends Component {

    constructor(arg){

        const {
            parent,
            label,
        } = arg;

        super({
            tag: 'div',
            attributes: [{ name: 'data-attachments', value: '' }],
            parent,
            innerHTML: /*html*/`
            <style>
                /* DropZone */
                svg.page {
                    display: inline-block !important;
                    width: 1em !important;
                    height: 1em !important;
                    stroke-width: 0 !important;
                    stroke: var(--darkColor) !important;
                    fill: #343a40 !important;
                }
                .drop-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                    font-weight: 500;
                    margin-top: 2px;
                    margin-bottom: 4px;
                    min-height: 200px;
                    border-radius: 4px;
                    border: solid 2px rgba(0,0,0,0.7);
                }
                .drop-zone-preview-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                .drop-zone-preview-container .icon {
                    font-size: 4.5em;
                    stroke: rgba(0,0,0,0.7);
                    fill: rgba(0,0,0,0.7);
                }
                .file-preview {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                }
                .file-preview-name {
                    text-align: center;
                    width: 115px;
                    margin-bottom: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .file-preview-remove {
                    cursor: pointer;
                    font-size: .7em;
                    padding: 1px 3px;
                    background: crimson;
                    color: white;
                    border-radius: 4px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
                }
                .file-icon { position: relative; }
                .file-icon .page { font-size: 4em; }
                .file-icon .type {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    font-size: 2em;
                }
            </style>
            <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <symbol id="icon-drawer" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                        <path d="M23 16h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M25 20h-18c-0.552 0-1-0.448-1-1s0.448-1 1-1h18c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <symbol id="icon-drawer2" viewBox="0 0 32 32"><!-- Drop Zone -->
                        <title></title>
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                    </symbol>
                    <symbol id="icon-file-text2" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                        <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <symbol id="icon-file-empty" viewBox="0 0 32 32"><!-- Empty Page -->
                        <title></title>
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                    </symbol>
                    <symbol id="icon-microsoftword" viewBox="0 0 32 32"><!-- Word -->
                        <title></title>
                        <path fill="#2b579a" style="fill: var(--color1, #2b579a)" d="M31.999 4.977v22.063c0 0.188-0.067 0.34-0.199 0.461-0.135 0.125-0.295 0.184-0.48 0.184h-11.412v-3.060h9.309v-1.393h-9.317v-1.705h9.309v-1.392h-9.303v-1.72h9.307v-1.376h-9.307v-1.724h9.307v-1.392h-9.307v-1.705h9.307v-1.391h-9.307v-1.74h9.307v-1.325h-9.307v-3.457h11.416c0.199 0 0.36 0.064 0.477 0.199 0.14 0.132 0.2 0.293 0.199 0.475zM18.2 0.855v30.296l-18.2-3.149v-23.912l18.2-3.24zM15.453 9.799l-2.279 0.14-1.461 9.047h-0.033c-0.072-0.428-0.34-1.927-0.82-4.489l-0.852-4.351-2.139 0.107-0.856 4.244c-0.5 2.472-0.779 3.911-0.852 4.315h-0.020l-1.3-8.333-1.96 0.104 2.1 10.511 2.179 0.14 0.82-4.091c0.48-2.4 0.76-3.795 0.82-4.176h0.060c0.081 0.407 0.341 1.832 0.82 4.28l0.82 4.211 2.36 0.14 2.64-11.8z"></path>
                    </symbol>
                    <symbol id="icon-microsoftexcel" viewBox="0 0 32 32"><!-- Excel -->
                        <title></title>
                        <path fill="#217346" style="fill: var(--color4, #217346)" d="M31.404 4.136h-10.72v1.984h3.16v3.139h-3.16v1h3.16v3.143h-3.16v1.028h3.16v2.972h-3.16v1.191h3.16v2.979h-3.16v1.191h3.16v2.996h-3.16v2.185h10.72c0.169-0.051 0.311-0.251 0.424-0.597 0.113-0.349 0.172-0.633 0.172-0.848v-21.999c0-0.171-0.059-0.273-0.172-0.309-0.113-0.035-0.255-0.053-0.424-0.053zM30.013 25.755h-5.143v-2.993h5.143v2.996zM30.013 21.571h-5.143v-2.98h5.143zM30.013 17.4h-5.143v-2.959h5.143v2.961zM30.013 13.4h-5.143v-3.139h5.143v3.14zM30.013 9.241h-5.143v-3.12h5.143v3.14zM0 3.641v24.801l18.88 3.265v-31.416l-18.88 3.36zM11.191 22.403c-0.072-0.195-0.411-1.021-1.011-2.484-0.599-1.461-0.96-2.312-1.065-2.555h-0.033l-2.025 4.82-2.707-0.183 3.211-6-2.94-6 2.76-0.145 1.824 4.695h0.036l2.060-4.908 2.852-0.18-3.396 6.493 3.5 6.624-3.065-0.18z"></path>
                    </symbol>
                    <symbol id="icon-microsoftpowerpoint" viewBox="0 0 32 32"><!-- PowerPoint -->
                        <title></title>
                        <path fill="#d24726" style="fill: var(--color2, #d24726)" d="M31.312 5.333h-11.389v4.248c0.687-0.52 1.509-0.784 2.473-0.784v4.131h4.099c-0.020 1.159-0.42 2.136-1.201 2.924-0.779 0.789-1.757 1.195-2.917 1.221-0.9-0.027-1.72-0.297-2.439-0.82v2.839h8.959v1.393h-8.961v1.724h8.953v1.376h-8.959v3.12h11.391c0.461 0 0.68-0.243 0.68-0.716v-19.976c0-0.456-0.219-0.68-0.68-0.68zM23.040 12.248v-4.165c1.16 0.027 2.133 0.429 2.917 1.213 0.781 0.784 1.188 1.768 1.208 2.952zM11.008 12.317c-0.071-0.268-0.187-0.476-0.351-0.629-0.16-0.149-0.376-0.259-0.644-0.328-0.3-0.081-0.609-0.12-0.92-0.12l-0.96 0.019v3.999h0.035c0.348 0.021 0.713 0.021 1.1 0 0.38-0.020 0.74-0.12 1.079-0.3 0.417-0.3 0.667-0.7 0.748-1.219 0.080-0.521 0.052-1.021-0.085-1.481zM0 4.079v23.928l18.251 3.153v-30.32zM13.617 14.861c-0.5 1.159-1.247 1.9-2.245 2.22-0.999 0.319-2.077 0.443-3.239 0.372v4.563l-2.401-0.279v-12.536l3.812-0.199c0.707-0.044 1.405 0.033 2.088 0.24 0.687 0.203 1.229 0.612 1.631 1.229 0.4 0.615 0.625 1.328 0.68 2.14 0.049 0.812-0.057 1.563-0.325 2.249z"></path>
                    </symbol>
                    <symbol id="icon-adobeacrobatreader" viewBox="0 0 32 32"><!-- Adobe PDF -->
                        <title></title>
                        <path fill="#ee3f24" style="fill: var(--color1, #ee3f24)" d="M31.464 20.491c-0.947-1.013-2.885-1.596-5.632-1.596-1.467 0-3.167 0.147-5.013 0.493-1.043-1.027-2.083-2.227-3.076-3.627-0.707-0.987-1.324-2.027-1.893-3.053 1.084-3.387 1.608-6.147 1.608-8.133 0-2.229-0.804-4.555-3.12-4.555-0.711 0-1.421 0.433-1.8 1.067-1.044 1.877-0.573 5.991 1.223 10.053-0.671 2.027-1.38 3.964-2.267 6.14-0.771 1.835-1.659 3.725-2.564 5.461-5.205 2.112-8.573 4.579-8.889 6.512-0.139 0.729 0.099 1.4 0.609 1.933 0.177 0.147 0.848 0.727 1.973 0.727 3.453 0 7.093-5.707 8.943-9.147 1.42-0.48 2.84-0.916 4.257-1.353 1.557-0.431 3.12-0.777 4.54-1.020 3.647 3.339 6.861 3.867 8.477 3.867 1.989 0 2.699-0.823 2.937-1.496 0.373-0.867 0.093-1.827-0.336-2.32zM29.617 21.896c-0.139 0.725-0.851 1.208-1.848 1.208-0.28 0-0.52-0.049-0.804-0.096-1.813-0.433-3.511-1.355-5.204-2.808 1.667-0.285 3.080-0.333 3.973-0.333 0.987 0 1.84 0.043 2.413 0.192 0.653 0.141 1.693 0.58 1.46 1.84zM19.587 19.62c-1.227 0.253-2.552 0.552-3.925 0.924-1.088 0.297-2.221 0.632-3.36 1.027 0.617-1.203 1.139-2.365 1.611-3.471 0.571-1.36 1.040-2.76 1.513-4.061 0.467 0.813 0.987 1.64 1.507 2.373 0.853 1.16 1.747 2.267 2.64 3.227zM13.387 1.64c0.193-0.387 0.573-0.581 0.904-0.581 0.993 0 1.183 1.157 1.183 2.080 0 1.557-0.472 3.923-1.28 6.623-1.416-3.76-1.513-6.907-0.807-8.121zM8.184 24.169c-2.413 4.057-4.731 6.577-6.151 6.577-0.28 0-0.516-0.1-0.707-0.244-0.285-0.288-0.427-0.629-0.331-1.013 0.284-1.453 2.981-3.484 7.188-5.32z"></path>
                    </symbol>
                </defs>
            </svg>
            <div class="doc-row"><!-- Attachments -->
                <!-- <div class="doc-label pt-2">
                    <strong>${label || 'Supporting Documents'}:</strong>
                    <span class="badge rounded-pill bg-primary text-white point px-2 float-right d-flex justify-content-center mx-1" 
                          title="Add Attachment">Add Attachment${document.getIcon('plus').outerHTML}
                    </span>
                </div> -->
                <div class="col-12" id="edit-view-attached"></div>
                <div class="text-center" style="height: 30px;">
                    <div class="invalid-feedback float-left" id="upload-feedback">
                        Please select a valid state.
                    </div>
                </div>
                <!-- Hidden file input -->
                <input type="file" multiple="" style="display: none;" id="drop-zone-files">
                <!-- File Drop Zone UI -->
                <div class="drop-zone p-3" id="doc-dropzone">
                    <div class="drop-zone-preview-container p-2">
                        <svg class="icon-custom" fill="var(--primary)" style="width: 25%"><use href="#icon-drawer"></use></svg>
                    </div>
                    <span class="drop-zone-button-container">
                        <button type="button" data-choose-files class="btn btn-primary btn-sm">Choose files</button>
                        <span class="drag-message"> or drag them here</span>
                    </span>
                </div>
            </div>`,
        });

        this.store = new Store();
        this.store.files = [];
        this.store.failed = [];
        this.init();

    }

    selectIcon(ext){

        switch(ext) {
            case 'doc':
            case 'docx':
                return 'microsoftword';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'microsoftpowerpoint';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'microsoftexcel';
            case 'pdf':
                return 'adobeacrobatreader';
            default:
                return 'file-text2';
        }

    }

    remove(event){

        const component = this;
        const FileStore = component.store.files;
        const { fileName } = event.target.dataset;
        const file = FileStore.find(file => file.name === fileName);
        const index = FileStore.indexOf(file);
        FileStore.splice(index, 1);

        const previewContainer = component.get('.drop-zone-preview-container');
        const el = event.target.closest('.file-preview');

        $(el).addClass('animated zoomOutDown faster');
        
        setTimeout(function(){
            
            el.remove();
            if (previewContainer.innerHTML.trim() === '')
            {
                
                $(previewContainer).hide();
                previewContainer.innerHTML = /*html*/`
                <svg class="icon-custom" fill="var(--primaryColor)" style="width: 25%">
                    <use href="#icon-drawer"></use>
                </svg>`;
                $(previewContainer).fadeIn();

            }

        }, 500);

    }

    update(){

        const component = this;
        const FileStore = this.store.files;
        const selectIcon = this.selectIcon;
        const PreviewContainer = component.get('.drop-zone-preview-container');

        PreviewContainer.innerHTML = '';

        FileStore.forEach(file => {
            
            const ext = file.name.split('.').pop();
            
            const PreviewEl = new Component({
                tag: 'div',
                classList: 'file-preview p-2 animated fadeIn',
                attributes: [
                    { name: 'draggable', value: true },
                    { name: 'title', value: file.name },
                ],
                innerHTML: /*html*/ `
                <div class='file-icon'>
                    <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                    <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                </div>
                <div class='file-preview-name'>${file.name}</div>`,
            });

            new Component({
                tag: 'span',
                classList: 'file-preview-remove',
                attributes: [{ name: 'data-file-name', value: file.name }],
                events: [{ 
                    name: 'click', 
                    action(event){
                        return component.remove(event);
                    },
                }],
                parent: PreviewEl,
                innerText: 'Remove',
            }).render();
            
            PreviewContainer.append(PreviewEl.get());

        });

        component.get().dispatchEvent(new Event('updated'));

    }

    add(fileList){

        const component = this;
        const FileStore = this.store.files;

        /** Use DataTransferItemList interface to access the file(s); */
        Array.from(fileList)
        .forEach(file => {

            const { name } = file;
            const alreadyDropped = FileStore.find(droppedFile => droppedFile.name === name);
            
            if (!alreadyDropped) FileStore.push(file);
            else 
            {
                const FeedbackEl = component.get('#upload-feedback');
                console.warn(`${file.name} was already added!`);
                
                $(FeedbackEl).text(`${file.name} was already added!`).fadeIn('fast');
                
                setTimeout(function(){
                    $(FeedbackEl).fadeOut('fast');
                }, 1500);
            }

        });
        
        return this.update();
    }

    dropEvent(event){
        return this.add(event.originalEvent.dataTransfer.files);
    }

    getStore(){
        return this.store.files;
    }

    getFailed(){
        return this.store.failed;
    }

    async upload(Url, callback){

        if (!Url) throw new Error('Argument is invalid!');

        const ReqDigest = sp_service.service.digest.value;
        const attachments = this.getStore();
        const component = this;

        for (const file of attachments)
        {
            const { name } = file;
            const fileBuffer = new GetFileBuffer(file);
            const arrayBuffer = await fileBuffer;
            const RequestBody = new UploadRequestBody({
                Url,
                name,
                arrayBuffer,
                ReqDigest,
            });

            await $.ajax(RequestBody)
            .fail(function(xhr, textStatus, errorThrown){

                console.warn(`${textStatus} | ${errorThrown}`);

                /** Add the failed; */
                component.store.failed.push(file);
            
                const text = xhr.responseJSON ?
                xhr.responseJSON.error.message.value :
                errorThrown;
                
                /** FIXME: This should be a new toast; */
                // swal({
                //     icon: textStatus,
                //     title: errorThrown,
                //     text,
                //     buttons: {
                //         cancel: {
                //             text: 'Close',
                //             visible: true,
                //             closeModal: true,
                //         }
                //     },
                // })
                // .then(() => {
                //     if (isPointerEvent) $(Element)
                //     .html(OriginalHTML)
                //     .removeAttr('disabled');
                // });
        
            })
            .then(data => {
                if (callback) return callback(data.d);
                else return data;
            })
            .catch(console.info);
        }

        return this;
    }

    init(){

        const component = this;
        const icon = component.get('.icon-custom');
        const element = component.get('div.drop-zone');
        const inputElement = component.get('input#drop-zone-files');
        
        /** Set the drag event listeners; */
        $(inputElement).on('change', e => component.add(e.target.files));

        $(element)
        .on('dragenter', e => e.preventDefault())
        .on('dragleave', e => e.preventDefault())
        .on('drop', e => e.preventDefault())
        .on('dragover', e => e.preventDefault())
        .on('drop', e => component.dropEvent(e));

        $(icon)
        .attr('fill', 'var(--primaryColor)')
        .attr('style', 'width: 25%');

        const ChooseButton = this.get('button[data-choose-files]');
        ChooseButton.addEventListener('click', function(event){
            return component.get('#drop-zone-files').click();
        });

    }

}