/**
 * @title Patch.js
 * @description Patch event for Reports list items
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './AccordionForm.js';
import { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';

export default function PatchDraft(event){

    event.preventDefault();
    event.stopPropagation();

    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');
    
    let fields = Array.from(form.Fields.get()).filter(field => !field.validity.valid)
    fields.forEach(field=>field.removeAttribute('required'))

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = Element.getAttribute('src');

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);

    const request = form.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }
    const PersonnelInvolved = [];
    // request.PersonnelInvolved
    const PersonnelRowElements = Array.from(form.get(`div[data-personnel-container]`).querySelectorAll(`div.row`))
    if(PersonnelRowElements.length){
        PersonnelRowElements.forEach(row=>{
            const obj = {}
            Array.from(row.querySelectorAll(`[data-personnel]`)).map(el=>{
                const name = el.getAttribute('name')
                const value = el.value
                obj[name] = value
            })
            PersonnelInvolved.push(obj)
        })
    }
    request.PersonnelInvolved = JSON.stringify(PersonnelInvolved, null, 2)
    request.Status = 'Draft'

    request.Date = request.Date.split('T')[0];

    delete request.Service
    delete request.Component
    delete request.Rank
    delete request.Grade
    delete request.PersonnelDetails
    
    return Route.Patch(Url, request)
    .done(function RequestComplete(data, textStatus, xhr){
        if (xhr.status >= 200 && xhr.status < 300)
        {            
            $(Element).text('Success!');
            modal.hide();

            // Alert;
            new Toast({
                type: 'success',
                message: 'Success! Your item was updated.',
                parent: Layout.ToastContainer,
            })
            .render()
            .show();

            table.watcher();
            App.Views.Incidents.table.watcher();
        }
    })
    .fail(function RequestFailed(xhr, textStatus, errorThrown){

        console.info(xhr, textStatus, errorThrown);
        console.warn(`${textStatus} | ${errorThrown}`);
        console.info(xhr);
    
        const AlertBodyStr = xhr.responseJSON ?
        xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
        errorThrown;
        
        // return Alert
        console.info({
            Title: `Request ${textStatus} - ${errorThrown}`,
            TitleTimestamp: '', 
            Body: '<div>' + AlertBodyStr + '</div>',
            AutoHide: false,
            Classes: 'bg-danger text-white',
            Type: textStatus
        });

    })
    .catch(console.info);
}