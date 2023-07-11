
import Component from "./Component.js";

export default class BasicTable extends Component {

    constructor(arg){

        const {
            th, 
            tableElementId, 
            parent, 
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

        this.init();

    }

    init(){

    }

}