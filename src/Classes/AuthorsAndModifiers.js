/**
 * AuthorsAndModifiers.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";

function DateTimeString(date){
    const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
    return new Date(date)
    .toLocaleString(locale, {
        timeZone, 
    });
}

export default class AuthorsAndModifiers extends Component {

    constructor({parent, data}){

        const {
            Created,
            Modified,
            Author,
            Editor,
        } = data;

        // const AuthorTitle = Author ? 
        // Author.Title : 
        // await Route.Get(Web.SiteUsers.__deferred.uri, {
        //     $select: 'Title', $filter: `Id eq ${AuthorId}`
        // }).then(data => data.results[0].Title).catch(AuthorEditorError);

        super({
            tag: 'div',
            classList: 'mt-5',
            parent,
            innerHTML: /*html*/`
            <div class="f12 mt-2">Created at ${DateTimeString(Created)} by ${Author.Title}</div>
            <div class="f12 mt-0">Last Modified at ${DateTimeString(Modified)} by ${Editor.Title}</div>`
        });

    }

}