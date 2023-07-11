/**
 * EmailWidget.js
 * @author Wilfredo Pacheco
 */

import Component from "../src/Classes/Component.js";
import Form from "../src/Classes/Form.js";

export default class EmailWidget extends Component {
    
    constructor(arg){
        
        const {
            view,
            source,
            form,
            action_element,
            question,
        } = arg;

        super(view);

        if (!source instanceof HTMLElement || !source instanceof Component) throw new Error('The source element is not defined correctly!');

        this.source = source;
        this.form = new Form(form);
        this.action_element = action_element;
        this.question = question;

        this.empty = /*html*/`
        <tr><td>No Emails.</td><td></td></tr>`;

        this.init();

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
        if (this.source instanceof HTMLElement) this.source.value = JSON.stringify(value);
        else if (this.source instanceof Component) this.source.get().value = JSON.stringify(value);
    }

    clearView(){
        return this.get('tbody').innerHTML = '';
    }

    displayData(){

        const component = this;
        const data = this.getData();
        const parent = this.get('tbody');
        const empty_tr = this.empty;
        const question = this.question;

        this.clearView();

        if (!data || !data?.length) return new Component({
            tag: 'tr',
            parent,
            innerHTML: empty_tr,
        }).render();

        else data.forEach(function(v, index){

            const tr = new Component({
                tag: 'tr',
                parent,
                innerHTML: /*html*/`
                <td>${v}</td>
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

        const component = this;
        this.displayData();
        this.form.render();

        const action_element = this.action_element;
        const widget_form = this.form;
        const add_button = widget_form.get(action_element);

        add_button.addEventListener('click', function(event){

            if (!widget_form.Fields.validate()) return;

            const widget_form_values = Object.values(widget_form.Values.get());
            const source_value = component.getData() || [];
            component.setData([widget_form_values, source_value].flat());
            widget_form.clear();
            component.displayData();

        });
        
    }

}