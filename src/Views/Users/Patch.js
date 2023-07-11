/**
 * Patch.js
 * @description Patch event for Users list items.
 * @author Wilfredo Pacheco
 */

import App, { Layout } from '../../../app.js';
import { service, user as User } from '../../Biome.js';
import { List, table } from './View.js';
import { form, modal } from './Form.js';
import Toast from '../../Classes/Toast.js';

/**
 * ChecUserRoles
 * @description This method is used to reload the application in the event the user's primary role changes.
 * @param {Object} param0 Key & Role are passed to this method, they are compared to the current user.
 * @returns global onload method.
 */
export function CheckUserRoles({ Key, Role }){
    if (User.Key === Key 
    && !User.hasRole(Role))
    {
        // console.info(`%c${App.engine.name} | You have changed your own role, the application will now reload...`, 'color: #E7C800');
        console.info(`%c${App.engine.name} | Your primary role has changed to ${Role}, the application will now reload...`, 'color: gold');
        Layout.Main.remove();
        return onload()
        .then(data => { // console.info(data);
            console.info(`%c${App.engine.name} | Reload Complete!`, 'color: limegreen');
        });
    }
}

export default function Patch(event){

    event.preventDefault();
    event.stopPropagation();

    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');
    
    /** Form Validation - if the return is false, this will be true and return null; */
    if (!form.Fields.validate()) return null;

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = Element.getAttribute('src');

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true">
    </span> Sending Request...`);

    const request = form.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    return service.patch(Url, request)
    .then(function RequestComplete(data, textStatus, xhr){
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
            CheckUserRoles(request);
            
        }
    }) // FIXME: .fail is specific to jQuery;
    .fail(function RequestFailed(xhr, textStatus, errorThrown){

        // console.info(xhr);
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