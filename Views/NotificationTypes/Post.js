/**
 * @title Post.js
 * @description Post event for NotificationTypes list items
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';

export default function Post(event){
    
    event.preventDefault();
    event.stopPropagation();

    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');
    
    /** Form Validation - if the return is false, this will be true and return null; */
    if (!form.Fields.validate()) return null;

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = `${__metadata.uri}/Items`;

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);

    const request = form.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    return Route.Post(Url, request)
    .done(function RequestComplete(data, textStatus, xhr){
        if (xhr.status >= 200 && xhr.status < 300)
        {            
            $(Element).text('Success!');
            modal.hide();

            /** Alert; */
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

        // new Toast({
        //     type: 'danger',
        //     message: `Request ${textStatus} - ${errorThrown}
        //     <div>${AlertBodyStr}</div>`,
        // })
        // .render()
        // .show();

    })
    .catch(console.info);
}