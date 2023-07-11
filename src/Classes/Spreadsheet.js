/**
 * Spreadsheet.js
 * @author Dr. Toby Canning
 */

import Component from "./Component.js";

export default class Spreadsheet extends Component{

    constructor(tableOptions){

       let THIS;

        const events = [{
            name: 'click',
            action(event){

                const element = event.target;
                
                if (element.tagName === 'TD')
                {
                    const value = element.innerText;
                    const Url = this.getAttribute('src');
                    const Id = element.parentNode.dataset.id;
                    const title = element.dataset.title;
                    element.innerHTML = '';

                    const input = new Component({
                        tag: 'input',
                        classList: 'form-control form-control-sm',
                        parent: element,
                        attributes: [
                            { name: 'type', value: 'text' },
                            { name: 'value', value },
                        ],
                        events: [{
                            name: 'focusout',
                            action(event){
                                const request = new Object();
                                const value = event.target.value.trim();
                                element.innerText = value;
                                request[title] = value;

                                /** TODO: This is where the save event calls sharepoint to update the value for this list item; */
                                return THIS.FakeSharePointRESTCall(`${Url}/getById(${Id})`, request);

                            }
                        },{
                            name: 'keydown',
                            action(event){
                                // console.info(event)
                                const { key, keyCode } = event;
                                if (key === 'Enter' 
                                || keyCode === 13) element.innerText = event.target.value.trim();
                            }
                        }],
                    }).render();

                    input.get().focus();
                }
            }
        }];

        if (tableOptions.events) events.forEach(e => tableOptions.events.push(e));
        else tableOptions.events = events;
        THIS = super(tableOptions);
        
    }

    /** TODO: Complete the request to the list item, it is also missing the __metadata for the item; */
    FakeSharePointRESTCall(Url, request){
        // const ReqDigest = null;
        return console.info(Url, request, 'ReqDigest');
    }

}