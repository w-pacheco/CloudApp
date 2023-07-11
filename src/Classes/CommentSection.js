/**
 * CommentSection.js
 * @author Wilfredo Pacheco
 */

import { web, service, user as User } from "../Biome.js";
import Component from "./Component.js";
import Form from "./Form.js";

export default class CommentSection extends Component {

    constructor({ parent, FK, list }){

        const List = web.getListDetails(list);
        
        super({
            tag: 'div',
            classList: 'col-12 mt-4 p-0',
            attributes: [{ name: 'data-fk', value: FK }],
            parent,
            innerHTML: /*html*/`
            <label>Comments:</label>
            <div class="w-100" data-container></div>`,
        });

        this.AddBtn = null;
        this.RefreshBtn = null;
        this.SaveBtn = null;

        this.List = List;
        this.list = list;
        this.fk = FK;

        this.init();

    }

    display(comments){

        const component = this;
        const Container = component.get('div[data-comments]');
        const UserInitials = component.UserInitials;
        const DateTimeString = component.DateTimeString;

        $(Container).empty();
        if (!comments.length) Container.innerText = 'N/A';

        comments.forEach(function(comment){

            const { AuthorId, UserTitle, Created, UserComment, User } = comment;

            if (AuthorId === web.CurrentUser.Id) new Component({
                tag: 'div',
                parent: Container,
                innerHTML: /*html*/`<!-- Task Comment -->
                <div class="card border-0">
                    <div class="card-body row p-1">
                        <div class="col-1 d-md-none d-lg-block"><user>${UserInitials(User)}</user></div>
                        <div class="card col pl-0 border-0">
                            <div class="card-body row p-1">
                                <div class="col-12">
                                    <span class="f12"><b>${UserTitle}</b></span>
                                    <span class="f12">${DateTimeString(Created)}</span>
                                </div>
                                <message class="col-11">
                                    ${UserComment}
                                </message>
                            </div>
                        </div>
                    </div>
                </div>`
            }).render();

            else new Component({
                tag: 'div',
                parent: Container,
                innerHTML: /*html*/`<!-- Task Comment -->
                <div class="card border-0">
                    <div class="card-body row p-1">
                        <div class="card col pl-0 border-0 text-right">
                            <div class="card-body row p-1">
                                <div class="col-12">
                                    <span class="f12"><b>${UserTitle}</b></span>
                                    <span class="f12">${DateTimeString(Created)}</span>
                                </div>
                                <message class="col-12 px-5 ml-5">
                                    ${UserComment}
                                </message>
                            </div>
                        </div>
                        <div class="col-1 d-md-none d-lg-block"><user>${UserInitials(User)}</user></div>
                    </div>
                </div>`
            }).render();
        });

        return this;

    }

    refresh(){

        const component = this;
        const fk = component.fk;
        const List = component.List;        
        
        return service.get(`${List.__metadata.uri}/Items`, {
            $select: 'User,UserTitle,Created,UserComment,AuthorId',
            $orderby: 'Id desc',
            $filter: `FK_GUID eq '${fk}'`,
        })
        .then(data => data.d.results)
        .then(comments => {
            component.display(comments);
        });

    }

    UserInitials(email){
        const holder = email.split('@')[0].split('.');
        return holder.map(name => name.charAt(0).toUpperCase())
        .join('');
    }
    
    DateTimeString(date){
        return new Date(date).toLocaleString();
        return `${
            new Date(date).toLocaleDateString()
        } ${
            new Date(date).toLocaleTimeString()
        }`;
    }

    showForm(){
        const component = this;
        const form = component.get('form[data-form]');
        $(form).fadeIn();
    }

    hideForm(){
        const component = this;
        const form = component.get('form[data-form]');
        $(form).fadeOut().hide();
    }

    init(){

        const component = this;
        const fk = component.fk;
        const List = component.List;

        const form = new Form({
            classList: 'row mt-1 w-100 mx-auto needs-validation',
            attributes: [{ name: 'data-form', value: '' }],
            parent: component,
            innerHTML: /*html*/`
            <textarea class="form-control mt-5 mb-2" id="CommentForm" rows="3" required></textarea>
            <div class="w-100" data-save-container></div>`,
        }).render();

        new Component({
            tag: 'div',
            classList: 'mt-5',
            attributes: [{ name: 'data-comments', value: '' }],
            parent: component,
        }).render();

        const btnContainer = component.get('div[data-container]');
        const textarea = component.get('textarea[id="CommentForm"]');

        const PlusIcon = document.getIcon('plus');
        const RefreshIcon = document.getIcon('arrow-repeat');
        RefreshIcon.setAttribute('style', 'font-size: 1.25em;');
        PlusIcon.setAttribute('style', 'font-size: 1.25em;');
        
        component.hideForm();

        this.RefreshBtn = new Component({
            tag: 'span',
            classList: 'badge rounded-pill bg-primary text-white point px-2 float-end mx-1',
            attributes: [{ name: 'title', value: 'Refresh' }],
            parent: btnContainer,
            events: [{
                name: 'click', 
                async action(event){
                    
                    const Element = event.currentTarget;
                    const OriginalButtonHTML = Element.innerHTML;
                    
                    $(Element)
                    .attr('disabled', '') /** Disable the button element; */
                    .html(/*html*/`
                    <span class="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true"
                    ></span> Refreshing...`);
                    
                    await component.refresh();

                    /** Replace the innerHTML of the button to the original content; */
                    $(Element).removeAttr('disabled').html(OriginalButtonHTML);
                    
                }
            }],
            innerHTML: RefreshIcon.outerHTML,
        }).render();

        this.AddBtn = new Component({
            tag: 'span',
            classList: 'badge rounded-pill bg-primary text-white point px-2 float-end mx-1',
            attributes: [{ name: 'title', value: 'Add Comment' }],
            events: [{ 
                name: 'click', 
                action(){
    
                    /** Display form element; */
                    $(form.get()).toggle('fade'); 
                    
                    /** Focus user within the textarea element; */
                    form.get('textarea').focus(); 
                }
            }],
            parent: btnContainer,
            innerHTML: `${PlusIcon.outerHTML} Add Comment`,
        }).render();

        this.SaveBtn = new Component({
            tag: 'button',
            classList: 'btn btn-sm btn-primary float-end mt-1',
            attributes: [
                { name: 'type', value: 'button' },
                { name: 'data-guid', value: fk },
                { name: 'data-uri', value: List.__metadata.uri },
                { name: 'data-ListItemEntityTypeFullName', value: List.ListItemEntityTypeFullName },
            ],
            events: [{
                name: 'click',
                action: async function SaveComment(event){

                    event.preventDefault();
                    event.stopPropagation();
                
                    const Element = event.target.tagName === 'BUTTON' ? 
                    event.target : 
                    event.target.closest('button');
                    
                    const OriginalButtonHTML = Element.innerHTML;
                
                    const uri = Element.dataset.uri;
                    const type = List.ListItemEntityTypeFullName;

                    if (!form.Fields.validate()) return null;

                    $(Element)
                    .attr('disabled', '')
                    .html(/*html*/`
                    <span class="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true"
                    ></span> Submitting Request...`);

                    const FK_GUID = Element.dataset.guid;
                    const UserTitle = User.Title;
                    const UserComment = textarea.value;
                    const UserKey = User.Key;
                    const __metadata = {
                        type,
                    }
                
                    return service.post(`${uri}/Items`, {
                        __metadata,
                        FK_GUID,
                        User: User.Email,
                        UserTitle,
                        UserComment,
                        UserKey,
                    })
                    .then(function(data, status, xhr){
                        if (xhr.status >= 200 && xhr.status < 300)
                        {
                            component.hideForm();
                            form.clear();
                            component.refresh();

                            $(Element)
                            .removeAttr('disabled')
                            .html(OriginalButtonHTML);
                        }
                    });
                },
            }],
            customProperties: [{
                prop: 'textarea', 
                value: component.get('textarea[id="CommentForm"]'),
            }],
            parent: form.get('div[data-save-container]'),
            innerText: 'Save Comment',
        }).render();

        this.refresh();
        return this;

    }

}