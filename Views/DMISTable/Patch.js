/**
 * Patch.js
 * @description Patch event for DMISTable list items.
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';

/** FIXME: Should we report an error to the errors list? */
export default async function Patch(event){

    event.preventDefault();
    event.stopPropagation();

    const isPointerEvent = event?.constructor?.name === 'PointerEvent';
    let Element, OriginalHTML;

    Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');

    OriginalHTML = Element.innerHTML;
    
    /** Form Validation - if the return is false, this will be true and return null; */
    if (!form.Fields.validate()) return null;

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = Element.getAttribute('src');

    if (isPointerEvent) $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true">
    </span> Updating...`);

    const ReqDigest = await Route.GetRequestDigest();
    const request = form.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    return Route.Patch(Url, request, ReqDigest)
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
        }
    })
    .fail(function RequestFailed(xhr, textStatus, errorThrown){

        console.warn(`${textStatus} | ${errorThrown}`);
    
        const text = xhr.responseJSON ?
        xhr.responseJSON.error.message.value :
        errorThrown;
        
        swal({
            icon: textStatus,
            title: errorThrown,
            text,
            buttons: {
                cancel: {
                    text: 'Close',
                    visible: true,
                    closeModal: true,
                }
            },
        }).then(() => {
            if (isPointerEvent) $(Element)
            .html(OriginalHTML)
            .removeAttr('disabled');
        });

    })
    .catch(console.info);
}