/**
 * HomeView.js
 */

import Component from "../../src/Classes/Component.js";
import { Title as EventTypeListTitle } from "../EventTypes/List.js";
import BuildDisplayMatrix from "../BuildDisplayMatrix.js";
import { service, store, web } from "../../src/Biome.js";
import { Title as SettingsList } from '../../src/Schema/Settings.js';

const Title = 'HomeViewLayout';

export function createHomeView(request){
    const list = web.getListDetails(SettingsList);
    const type = list.ListItemEntityTypeFullName;
    return service.post(`${list.__metadata.uri}/Items`, {
        Key: Title,
        Properties: JSON.stringify(request, null, 2),
        __metadata: {
            type,
        },
    }).then(data => data.d);
}

export function updateHomeView(url, request){
    const list = web.getListDetails(SettingsList);
    const type = list.ListItemEntityTypeFullName;
    return service.patch(url, {
        Key: Title,
        Properties: JSON.stringify(request, null, 2),
        __metadata: {
            type,
        },
    });
}

export function getHomeView(){
    // const { port } = location;
    // if (port !== '8081') return;
    const list = web.getListDetails(SettingsList);
    if (!list) return;
    const id = list.Id;
    return store.listObserver.getListDataById(id).find(item => item.Key === Title);
}

export function showMatrix(event){
    const EventTypesListId = web.getListDetails(EventTypeListTitle).Id;
    const EventTypes = store.lists[EventTypesListId].data;
    return BuildDisplayMatrix(EventTypes);
}

export function parseColumnData(data){

    const sides = ['left', 'center', 'right'];
    const columns = sides.map(function(side){

        const icon = data[`icon-${side}`];
        const header = data[`header-${side}`];
        const content = data[`content-${side}`];
        const showIcon = data[`icon-${side}-show`];
        const action = data[`action-${side}`];
        const text = data[`text-${side}`];
        
        return {
            icon,
            header,
            content,
            showIcon,
            action,
            text,
        }

    })
    .filter(col => {
        if (col.header) return col;
    });

    return columns;
    
}

export const defaultHomeData = {
    "columnLength": "2",
    "header-left": "About",
    "icon-left": "info-circle-fill",
    "icon-left-show": false,
    "content-left": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore aut accusamus voluptates similique nisi nihil quis odio amet assumenda, rem id officia, quasi odit ad molestiae eaque vel quaerat quidem sed maiores aliquam illum deserunt quibusdam! Ipsum culpa id, deleniti laudantium quae accusantium repudiandae in eius nam alias! Quis, hic!",
    "icon-right-show": false,
    "header-right": "Lorem impsum",
    "icon-right": "collection",
    "text-right": "Lorem ipsum",
    "action-right": "showMatrix",
    "content-right": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore aut accusamus voluptates similique nisi nihil quis odio amet assumenda, rem id officia, quasi odit ad molestiae eaque vel quaerat quidem sed maiores aliquam illum deserunt quibusdam! Ipsum culpa id, deleniti laudantium quae accusantium repudiandae in eius nam alias! Quis, hic!"
}

export default class HomeView {

    constructor(arg){

        const { parent, columns, columnLength } = arg;

        this.columns = columns;
        this.columnLength = columnLength || columns.length;
        this.parent = parent;

    }

    clear(){
        return $(this.parent).empty();
    }

    init(){

        const parent = this.parent;
        const columnLength = this.columnLength;
        const columns = this.columns;
        const container = new Component({
            tag: 'div',
            classList: `row g-4 py-3 row-cols-1 row-cols-xl-${columnLength}`,
            parent,
        }).render();

        columns.forEach(function(col, index){

            if (index >= columnLength) return;

            const {
                action,
                content,
                header,
                icon = 'collection', // This prevents the getIcon method from throwing an error;
                showIcon,
                text,
            } = col;

            const column = new Component({
                tag: 'div',
                classList: 'feature col',
                parent: container,
                innerHTML: /*html*/`
                <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 p-3 rounded ${
                    showIcon ? '' : 'd-none'
                }">
                    ${document.getIcon(icon).outerHTML}
                </div>
                <h3 class="fs-2">${header}</h3>
                <p>${content}</p>`,
            }).render();

            if (action) new Component({
                tag: 'button',
                classList: 'btn btn-secondary',
                parent: column,
                attributes: [{ name: 'type', value: 'button' }],
                events: [{ name: 'click', action: window[action] }],
                innerText: text,
            }).render();
            
        });

        return this;

    }

}

window.showMatrix = showMatrix;