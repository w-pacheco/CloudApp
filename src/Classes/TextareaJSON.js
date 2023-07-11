/**
 * UserTextarea.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import Form from "./Form.js";

export default class TextareaJSON extends Component {
    
    constructor(arg){
        
        const {
            headers = [],
            view,
            source,
            question,
            emptyMessage = 'N/A',
        } = arg;

        if (!headers.length) throw new Error('Missing headers!');

        /** Create the table for display; */
        super(view);

        if (!source instanceof HTMLElement 
        || !source instanceof Component) throw new Error('The source element is not defined correctly!');

        this.source = source;
        this.question = question;
        this.emptyMessage = emptyMessage;
        this.headers = headers;

        this.init();

    }

    addData(newItem){

        const data = this.getData();
        if (!data) this.setData([newItem]);
        else
        {
            data.push(newItem);
            this.setData(data);
        }

        return this.displayData();
        
    }

    getData(){

        let value;
        if (this.source instanceof HTMLElement) value = this.source.value;
        else if (this.source instanceof Component) value = this.source.get().value;

        if (value) value = JSON.parse(value);

        /** @returns Array or undefined; */
        return value;

    }

    setData(value){
        if (this.source instanceof HTMLElement) this.source.value = JSON.stringify(value, null, 2);
        else if (this.source instanceof Component) this.source.get().value = JSON.stringify(value, null, 2);
    }

    clearView(){
        return this.get('tbody').innerHTML = '';
    }

    displayData(){

        const {
            headers, 
            empty, 
            question,
        } = this;

        const component = this;
        const data = this.getData();
        const parent = this.get('tbody');

        this.clearView();

        if (!data || !data?.length) return new Component({
            tag: 'tr',
            parent,
            innerHTML: empty,
        }).render();

        else data.forEach(function(v, index){

            const tr = new Component({
                tag: 'tr',
                parent,
                innerHTML: /*html*/`${
                    headers.map(header => {

                        const isEmailValue = header.toLowerCase().includes('email') 
                        || header.toLowerCase().includes('email');

                        if (isEmailValue) return /*html*/`
                        <td><a href="mailto:${v[header]}">${v[header]}</a></td>`;
                        
                        else return /*html*/`
                        <td>${v[header]}</td>`;

                    }).join('')
                }<td data-remove></td>`,
            }).render();

            if (window?.$?.fn?.jquery) $(tr.get()).hide().fadeIn();

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
                            icon: 'warning',
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

        const { headers, emptyMessage } = this;

        /** Set the empty message; */
        this.empty = headers.map(function(item, index){
            if (index === 0) return /*html*/`<td>${emptyMessage}</td>`;
            else return /*html*/`<td></td>`;
        }).join('') + /*html*/`<td></td>`;

        this.get('tbody').innerHTML = this.empty;

    }

}