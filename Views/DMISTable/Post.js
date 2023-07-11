/**
 * Post.js
 * @description Post event for DMISTable list items.
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';

export default async function Post(event){
    
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
    const Url = `${__metadata.uri}/Items`;

    if (isPointerEvent) $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true">
    </span> Sending Request...`);

    const ReqDigest = await Route.GetRequestDigest();
    const request = form.Values.get();

    /** This is the template of the steps assigned on creation; */
    request.ProcessTemplate = JSON.stringify(form.Store.get('template'));

    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    return Route.Post(Url, request, ReqDigest)
    .done(function RequestComplete(data, textStatus, xhr){
        if (xhr.status >= 200 && xhr.status < 300)
        {            
            $(Element).text('Success!');
            modal.hide();

            // if (form.Store.get('create')) form.Store.create(data.d, ReqDigest);

            // Alert;
            new Toast({
                type: 'success',
                message: 'Success! Your item was created.',
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