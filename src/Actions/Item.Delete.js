/**
 * Item.Delete.js
 * @author Wilfredo Pacheco
 */

import { web, service } from "../Biome.js";
import Component from "../Classes/Component.js";
import Toast from "../Classes/Toast.js";

export async function Undo(recycle){
    return service.post(`${
        web.Url
    }/_api/web/recyclebin('${
        recycle
    }')/restore()`, {});
}

export function RequestFailed(xhr, textStatus, errorThrown){

    console.info(xhr, textStatus, errorThrown);
    console.warn(`${textStatus} | ${errorThrown}`);
    console.info(xhr);

    const message = xhr.responseJSON ?
    xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
    errorThrown;
    
    new Toast({
        type: 'danger',
        message: `Request ${textStatus} - ${errorThrown}
        ${message}`,
    })
    .render()
    .show();

}

export default async function Delete(event){
                
    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');

    const Url = Element.getAttribute('src');
    const AlertResponse = await swal({
        icon: 'warning',
        text: 'Would you like to delete this item?',
        buttons: {
          cancel: true,
          confirm: true,
        },
    });

    // if (confirm('Would you like to delete this item?'))
    if (AlertResponse)
    {
        /** NOTE: 
         * By default all list items will be recycled, the property
         * we look for data-delete to find out what we will use.
         * If not found this method sends the item to the site collection recycle bin; 
         */

        if (Element.dataset.delete 
        && Element.dataset.delete === 'true') return service.Delete(Url)
        .fail(RequestFailed)
        .done(function(data, textStatus, xhr){
            if (xhr.status === 200)
            {
                /** If the element has a call back, this will run the method; */
                if (Element?.callback) Element.callback();
                
                /** Render the basic success toast; */
                new Toast({
                    type: 'success',
                    message: 'The item was deleted!',
                })
                .render()
                .show();
            }
        });

        else return service.Recycle(Url)
        .fail(RequestFailed)
        .done(function(data, textStatus, xhr){
            if (xhr.status === 200)
            {
                /** If the element has a call back, this will run the method; */
                if (Element?.callback) Element.callback();
                
                /** If the request is to recycle the list item, this provides the undo method to the user; */
                if (data.d?.Recycle 
                && Element.dataset.recycle
                && Element.dataset.undo)
                {
                    const delay = 8000;
                    const type = 'success';
                    const message = 'The item was deleted!';
                    const toast = new Toast({
                        type,
                        message,
                        delay,
                    })
                    .render()
                    .show();

                    /** Create the undo link; */
                    new Component({
                        tag: 'a',
                        classList: 'mx-2 text-white',
                        parent: toast.get('div.toast-body'),
                        attributes: [{ name: 'href', value: 'javascript:;' }],
                        events: [{
                            name: 'click',
                            action(event){
                                return Undo(data.d.Recycle)
                                .then(data => {
                                    if (Element?.callback) Element.callback();
                                    toast.hide();
                                });
                            },
                        }],
                        innerText: 'undo',
                    }).render();
                }

                /** Render the basic success toast; */
                else new Toast({
                    type: 'success',
                    message: 'The item was deleted!',
                })
                .render()
                .show();
            }
        });
    }
}