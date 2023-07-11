/**
 * Table.js
 * @author Wilfredo Pacheco
 */

import SetParam from "../Actions/URLParam.Set.js";
import Button from "./Button.js";
import Component from "./Component.js";
import { service, user, name as biome } from '../Biome.js';
import SPListManager from './SPListManager.js';

const { port } = location;

// TODO: for very large lists, 
// only load the current paginated view and implement a lazy load 
// (make sort filter unavailable till the call is complete);

export class Highlight {

    constructor(arg){

        const {
            highlightRed = 'background-color: #ff9999 !important; color: black !important;',
            highlightYellow = 'background-color: #ffff99 !important; color: black !important;',
            highlightGreen ='background-color: #99ffa9 !important; color: black !important;',
            table,
            index,
        } = arg;

        let tableReference;
        /** Handle tables that are an instance of component; */
        if (table instanceof Component) tableReference = table.get();
        /** Handle query strings and HTML elements; */
        else if (table instanceof HTMLElement || typeof table === 'string') tableReference = table;
        /** Throw an error; */
        else throw new Error('There is an issue with your table argument!');

        if (!index || index < 0) throw new Error('index is invalid!');

        this.highlightRed = highlightRed;
        this.highlightYellow = highlightYellow;
        this.highlightGreen = highlightGreen;

        this.table = tableReference;
        this.index = index;

    }

    init(){

        const {
            index,
            table,
            highlightRed,
            highlightGreen,
            highlightYellow
        } = this;

        return $(table).DataTable()
        .data()
        .rows()
        .context[index]
        .aoData
        .map(el => {

            // const highlightRed = 'background-color: #ff9999 !important; color: black !important;';
            // const highlightYellow = 'background-color: #ffff99 !important; color: black !important;';
            // const highlightGreen = 'background-color: #99ffa9 !important; color: black !important;';
            
            if (el.anCells[1].innerText)
            {
                try {
                    const today = moment();
                    const sevenDaysInTheFuture = moment().add(7, 'days');
                    const date_requested = moment(new Date(el.anCells[2].innerText));

                    const anCells = el.anCells[1];
                    const complete = anCells.innerText === 'Complete';
                    const canceled = anCells.innerText === 'Canceled';
                    const submitted = anCells.innerText === 'Submitted';
                    const dueInSevenDays = date_requested < sevenDaysInTheFuture && date_requested > today;
                    // const pastDue = date_requested < today;

                    if (submitted) $(anCells)
                    .fadeOut('fast')
                    .fadeIn()
                    .attr('style', highlightGreen);

                    else if (submitted && dueInSevenDays) $(anCells)
                    .fadeOut('fast')
                    .fadeIn()
                    .attr('style', highlightYellow);

                    // else if (submitted && pastDue) $(anCells)
                    // .fadeOut('fast')
                    // .fadeIn()
                    // .attr('style', highlightRed);

                    else if (complete) $(anCells)
                    .fadeOut('fast')
                    .fadeIn()
                    .addClass('text-success');

                    else if (canceled) $(anCells)
                    .fadeOut('fast')
                    .fadeIn()
                    .addClass('text-danger')

                } catch(e){ }
            }
        });

    }

}

export default class Table extends Component {

    constructor(arg){

        if (!arg || typeof arg !== 'object') throw new Error(`${
            biome
        } | The argument passed is invalid or missing!`);

        const { 
            List,
            th, 
            tableElementId, 
            parent, 
            tableOptions, 
            $select,
            $expand,
            $orderby,
            $top,
            $filter,
            buttons,
            extentions,
            ShowForm,
            colvis,
            // stateSaveCallback,
            // stateLoadCallback,
            stateSave = true,
            data,
            watch = true,
        } = arg;
        
        super({
            /** Since this is a form constructor, we will always set this for the user; */
            tag: 'table',
            classList: 'table',
            parent,
            attributes: [
                { name: 'id', value: tableElementId },
                { name: 'style', value: 'width: 100% !important;'},
            ],
            innerHTML: /*html*/`
            <thead>
                <tr>${
                    th
                    .map(item => item.thead)
                    .map(thString => /*html*/`<th>${thString}</th>`)
                    .join('')
                }</tr>
            </thead>
            <tbody></tbody>`,
        });

        const TABLEOPTIONS = {
            stateSave,
        }

        Object.assign(tableOptions, {
            stateSave,
        });

        this.tableOptions = tableOptions || TABLEOPTIONS;
        this.tableOptions.buttons = [];
        
        this.th = th;
        this.List = List;
        this.parent = parent;
        this.buttons = buttons;
        this.ShowForm = ShowForm;
        this.watch = watch;
        
        /** TODO: Starting method to handle watcher; */
        this.timestamp = new Date().toISOString();
        
        this.$table = null;             // jQuery Datatable Object;
        this.extentions = extentions;   // Datatable extentions ie: buttons;
        this.colvis = colvis;
        // https://stackoverflow.com/questions/39462587/jquery-datatable-save-state-in-db-not-in-client-side
        // this.tableOptions.stateSaveCallback = stateSaveCallback || function(settings, data){};
        // this.tableOptions.stateLoadCallback = stateLoadCallback || function(settings){};

        this.$select = $select;
        this.$expand = $expand;
        this.$orderby = $orderby;
        this.$top = $top;
        this.$filter = $filter;
        this.data = data;

        /** Designed to handle all Microsoft SharePoint REST calls; */
        this.SPListManager = new SPListManager(this);
        
    }

    /** Exposes the watcher method from SPListManager; */
    watcher(){
        const watch = this.watch;
        if (watch === false) return this.refresh();
        return this.SPListManager.watcher();
    }

    edit(Url){

        const Route = service;
        const showForm = this.ShowForm;
        this.SPListManager.watcher();
        // const xhr = 
        return Route.Get(Url, {
            $select: '*,Author/Title,Editor/Title',
            $expand: 'AttachmentFiles,Author/Id,Editor/Id',
        })
        .then(function(data, textStatus, xhr){
            // console.info(xhr);
            // window.xhr = xhr;
            // if (Route.protocol === 'jQuery') console.info(xhr.getAllResponseHeaders());
            return data.d;
        })
        .then(data => {
            /** 
             * FIXME: 
             * 
             * When hosted locally and on the Users list, this fails and returns a document element;
             * 
             * jQuery.Deferred exception: Cannot read properties of undefined (reading 'Id') 
             * TypeError: Cannot read properties of undefined (reading 'Id')
             * 
             * Line 114 will display:
             * content-type: application/atom+xml; charset=utf-8; type=entry
             * 
             */
            SetParam('Id', data.Id);
            return showForm(data);
        });
        // return xhr;
    }

    update(data){

        /** Clear table data; */
        $(this.get()).DataTable().rows().remove().draw();

        /** Load and draw data; */
        $(this.get()).DataTable().rows.add(data).draw();

        /** Adjusts the column widths when render is complete; */
        $(this.get()).DataTable().columns.adjust().draw();

        /** Create custom event: update; */
        this.get().dispatchEvent(new Event('update'));

        return data;

    }

    async refresh(event){

        if (port === '8081') return;

        let Element, OriginalHTML;
        let isEvent = event instanceof Event;

        if (isEvent)
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

        /** This will update the timestamp now that the list items are being watched; */
        this.timestamp = new Date().toISOString();

        let data;        
        /** The data property is defined and is an array; This is probably the first time rendering on page; */
        if (!isEvent && typeof this.data === 'object' && this.data instanceof Array) data = this.data;

        /** The data property is defined and is a function; */
        // else if (typeof this.data === 'function') data = await this.data();
        else if (typeof this.data === 'function') data = this.data();

        /** The data property is NOT defined and we should call for data; */
        // else data = await this.getItems();
        else data = await this.SPListManager.getItems();
        
        /** Will this break the DOM when the length its more than 10,000?  */
        this.data = data;
        this.update(data);

        /** FIXME: This will not update new items in the store correctly; */
        // Commenting this out will result in multiple of the same item;
        this.SPListManager.refreshChangeToken();

        if (isEvent) $(Element)
        .html(OriginalHTML)
        .removeAttr('disabled');

    }

    buttonGroup(){

        let component_parent = this.parent;
        if (component_parent instanceof Component) component_parent = this.parent.get();
        
        $(component_parent).append(/*html*/ `<!-- Button Group Container -->
        <div class="col-12 p-0 my-3">
            <div class="d-flex justify-content-end">
                <div class="btn-group" id="${this?.List?.Id}" role="group" aria-label="" data-custom-dt-btn-group></div>
            </div>
        </div>`);

        const User = user;
        const parent = this.parent.querySelector('div.btn-group');
        if (this.buttons.length) this.buttons
        .forEach(function(btn){

            const { tag, role } = btn;

            /** FIXME: Get rid of this or handle it better, like an array of roles......... */
            /** This will skip any elements that have a specific role defined; */
            if (role && !User.hasRole(role)) return null;

            if (!tag || tag === 'button') return new Button(Object.assign(btn, {
                parent,
            })).render();

            else if (tag === 'a') new Component(Object.assign(btn, {
                parent,
            })).render();

        });

        return parent;
        
    }

    init(){

        const component = this;
        const ButtonGroupContainer = this.buttonGroup();
        const { extentions, colvis } = this;

        // component.tableOptions.buttons.push({
        //     extend: 'collection',
        //     text: 'Filters',
        //     // buttons: [
        //     //   { extend: 'columnsToggle', columns: '.myColumns' }, // will be expanded to individual buttons
        //     //   { extend: 'columnToggle', text:'Toggle multiple', columns:'.hideInitial' } // single button grouped
        //     // ]
        // })

        if (extentions?.buttons?.custom) extentions.buttons
        .custom.forEach(btn => component.tableOptions.buttons.push(btn));

        if (extentions?.buttons.copy) component.tableOptions
        .buttons.push({
            extend: 'copy',
            text: /*html*/`${
                document.getIcon('clipboard').outerHTML
            }&#160;Copy`,
        });
        
        if (extentions?.buttons.csv) component.tableOptions
        .buttons.push({
            extend: 'csv',
            text: /*html*/`${
                document.getIcon('filetype-csv').outerHTML
            }&#160;.csv`,
        });

        if (extentions?.buttons.excel) component.tableOptions
        .buttons.push({
            extend: 'excel',
            text: /*html*/`${
                document.getIcon('file-earmark-spreadsheet').outerHTML
            }&#160;.xlsx`,
        });

        if (extentions?.buttons.pdf) component.tableOptions
        .buttons.push({
            extend: 'pdf',
            text: /*html*/`${
                document.getIcon('filetype-pdf').outerHTML
            }&#160;.pdf`,
        });

        if (extentions?.buttons.print) component.tableOptions
        .buttons.push({
            extend: 'print',
            text: /*html*/`${
                document.getIcon('printer').outerHTML
            }&#160;Print`,
        });

        // https://datatables.net/forums/discussion/53587/how-do-you-change-the-name-of-a-postfix-button-in-column-visibility
        if (colvis) component.tableOptions.buttons.push({
            extend: 'colvis',
            text: "Columns",
            postfixButtons: [{
                extend: 'colvisRestore',
                text: /*html*/`${
                    document.getIcon('arrow-counterclockwise').outerHTML
                }&#160;Reset`,
            }],
        });

        function getTableData(rowData){

            /** Datatable columns collapse with small viewport, this prevents the modal from rendering; */
            /** @reference https://stackoverflow.com/questions/58001666/how-to-determine-if-before-is-applied-to-an-element */
            if (getComputedStyle(rowData.target, 'before').getPropertyValue('content') !== 'none') return;
            
            /** Adjusts the site theme for modal display for now; */
            rowData = $(component.get()).DataTable().row(this).data();

            /** Send information to render in modal; */
            if (rowData) component.edit(rowData.__metadata.uri);

        }

        this.render();
        this.$table = $(this.get()).DataTable(this.tableOptions);
        this.$table.on('click', 'tr', getTableData);

        // TODO: This was an attempt to save the save state for the table as a list item;
        // this.$table.on('stateSaveParams.dt', function(e, settings, data){
        //     // data.search.search = "";
        //     console.info({
        //         e,
        //         settings,
        //         data,
        //     });
        // } );

        /** Prepend table buttons; */
        if (extentions?.buttons) this.$table.buttons()
        .container()
        .addClass('mr-2')
        .prependTo(ButtonGroupContainer.parentNode);
        
        this.refresh();

        return this;

    }

}