/**
 * @title Patch.js
 * @description Patch event for Series list items
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { form as AdminForm, modal as AdminModal } from './Form.admin.js';
import { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';

export default function Patch(event){

    event.preventDefault();
    event.stopPropagation();

    const FORM = form || AdminForm;
    const MODAL = modal || AdminModal;

    console.info(MODAL);

    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');
    
    /** Form Validation - if the return is false, this will be true and return null; */
    if (!FORM.Fields.validate()) return null;

    const { ListItemEntityTypeFullName } = List;
    const Url = Element.getAttribute('src');

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true"
    >
    </span> Sending Request...`);

    const request = FORM.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    return Route.Patch(Url, request)
    .done(async function RequestComplete(data, textStatus, xhr){
        if (xhr.status >= 200 && xhr.status < 300)
        {
            const callback = FORM.get()?.callback;
            if (callback) await callback();

            $(Element).text('Success!');
            MODAL.hide();

            // Alert;
            new Toast({
                type: 'success',
                message: 'Success! Your item was updated.',
                parent: Layout.ToastContainer,
            })
            .render()
            .show();

            table.watcher();
        }
    })
    .fail(function RequestFailed(xhr, textStatus, errorThrown){

        console.info(xhr);
    
        const AlertBodyStr = xhr.responseJSON ?
        xhr.responseJSON.error.message.value :
        errorThrown;
        
        new Toast({
            type: 'danger',
            message: /*html*/`${errorThrown}!
            <br>
            <br>
            ${AlertBodyStr}`,
            autohide: false,
        })
        .render()
        .show();

    })
    .catch(console.info);
}