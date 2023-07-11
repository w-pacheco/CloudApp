// import { GetAllItems } from "../src/Actions/List.GetAllItems.js";
import Component from "../src/Classes/Component.js";
import Modal from "../src/Classes/Modal.js";
// import { Title as EventTypesListTitle } from './EventTypes/List.js'


export default function BuildDisplayMatrix(EventTypes) {
    // console.info('Create the display matrix modal and fill it with the EventType list items')
    // const EventTypes = await GetAllItems(EventTypesListTitle)
    // console.info(EventTypes)
    const matrixModal = new Modal({
        title: 'DCIR Event Types',
        draggable: true,
        size: 'modal-xl',
        classes: 'modal-dialog-scrollable'
        // buttons,
    }).render();
    // const NotificationTypeDescriptions = ['Offices', NotificationTypes.map(item => item.Description)].flat();
    const dcirTable = new Component({
        /** Since this is a form constructor, we will always set this for the user; */
        tag: 'table',
        classList: 'table f-12',
        // classList: 'table table-hover f-12',
        // classList: 'table',
        parent: matrixModal.body,
        attributes: [{ name: 'style', value: 'width: 100% !important;' }],
        innerHTML: /*html*/`
    <thead>
        
        <tr>
            <th class="text-center">DCIR Event Category</th>
            <th class="text-center">DCIR Event Number</th>
            <th style="padding-left:1em;">DCIR Event Description</th>
        </tr>
    </thead>
    <tbody></tbody>`,
    }).render();

    EventTypes.forEach(event =>

        new Component({
            tag: `tr`,
            parent: dcirTable.get(`tbody`),
            innerHTML: /*html*/ `
            <td>${event.Category}</td>
            <td class="text-center">${event.EventNumber}</td>
            <td>${event.Description}</td>
            `,
        }).render()

    )
    // $(dcirTable.get()).DataTable({
    //     paging: false,
    //     searching: false,
    //     order: [[1, 'asc']],
    //     columnDefs: [
    //         { orderable: false, targets: 2 },
    //         // { "width": "1em", "targets": 1 },
    //         // { "width": "3em", "targets": 0 },
    //     ],
    //     "columns": [
    //         { "width": "15%" },
    //         { "width": "10%" },
    //         { "width": "75%" },
    //       ]
    // })
    // console.info(
    // dcirTable.get().parentElement.parentElement.nextElementSibling.setAttribute('hidden', '')
    // .querySelector(`div.dataTables_info`)
    // .setAttribute('hidden','')
    // )

    matrixModal.show()
}