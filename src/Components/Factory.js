/**
 * Factory.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../Biome.js";
import { SiteCollectionLists } from '../../app.settings.js';
import ProgressBar from '../Classes/ProgressBar.js';

/**
 * SortByOrder
 * @param {Object} a Order property is call on this object to compare to the following;
 * @param {Object} b Order property is call on this object to compare to the following;
 */
export function SortByOrder(a, b) {
    return a.Order - b.Order;
}

/**
 * @param {String} Str Progress String passed by application;
 */
export function ProgressLog(Str, Callback){
    if (!!Callback) Callback(Str);
    try
    {
        return console.info('%c' + Str, 'background: #222; color: #23d82f');
    }
    /** This catches non-Google Chrome browsers; */
    catch(e)
    {
        return console.info(Str);
    };
}

/**
 * Used to return the d property from the Object passed;
 * @return {Object} Data property value from SharePoint response;
 */
export function ReturnDataProperty(data){
    return data.d;
}

/**
 * FieldTypeKind for SharePoint
 *  
 * {FieldTypeKind} - 2 (Single Line of Text)
 * {FieldTypeKind} - 3 (Mulitiple Lines of Text)
 * {FieldTypeKind} - 4 (Date)
 * {FieldTypeKind} - 6 (Choice)
 * {FieldTypeKind} - 7 (Lookup)
 * {FieldTypeKind} - 9 (Number)
 * {FieldTypeKind} - 20 (Person or Group)
 */
export function Field(Title, FieldTypeKind){
    this.__metadata = { type: "SP.Field" };
    this.Title = Title;
    this.FieldTypeKind = FieldTypeKind;
    this.Required = false;
    this.EnforceUniqueValues = false;
    this.StaticName = Title;
}

// BaseTemplate: 100 Regular List
// BaseTemplate: 106 Calendar List

export function List(Title, Description, BaseTemplate){
    
    this.__metadata = { type: "SP.List" };
    this.AllowContentTypes = true;
    this.BaseTemplate = BaseTemplate;
    this.ContentTypesEnabled = true;
    this.Description = Description;
    this.Title = Title;
}

export function Folder(Title, Description, BaseTemplate){
    
    this.__metadata = { type: "SP.Folder" };
    // this.AllowContentTypes = true;
    this.BaseTemplate = BaseTemplate;
    // this.ContentTypesEnabled = true;
    this.Description = Description;
    this.Title = Title;
}

export async function CreateList(Options, Callback){

    const { AddViewFieldTitle, AddViewFieldGUID, Fields, PredefinedData } = Options;
    const SharepointList = new List(Options.List.Title, Options.List.Description, Options.List.BaseTemplate);
    const SharepointFieldArray = new Array();
    for (const field of Fields)
    {
        const { Title, FieldTypeKind } = field;
        const FieldItem = new Field(Title, FieldTypeKind);

        // Since the new Field call doesn't handle the EnforceUniqueValues property;
        if (field.EnforceUniqueValues) FieldItem.EnforceUniqueValues = field.EnforceUniqueValues;

        // Since the new Field call doesn't handle the Required property;
        if (field.Required) FieldItem.Required = field.Required;

        SharepointFieldArray.push(FieldItem);
    }

    ProgressLog('Creating ' + SharepointList.Title + ' List....', Callback); // Progress Checkpoint;
    const ListResponse = await service.post(web.Url +
    '/_api/web/lists',
    SharepointList).then(ReturnDataProperty);
    ProgressLog('Create ' + SharepointList.Title + ' Complete', Callback); // Progress Checkpoint;
    ProgressLog('Creating Fields....', Callback);                          // Progress Checkpoint;

    for (const field of SharepointFieldArray)
    {
        const { Title } = field;
        ProgressLog('Creating ' + Title + ' Field....', Callback);         // Progress Checkpoint;

        const RoleTitleResponse = await service.post(ListResponse.__metadata.uri +
        '/Fields',
        field).then(ReturnDataProperty);
        if (RoleTitleResponse.FieldTypeKind === 6)
        {
            const template = Fields.find(f => f.Title === RoleTitleResponse.Title);
            if (template?.Choices)
            {
                const ChoiceRequest = RoleTitleResponse.Choices;
                ChoiceRequest.results = template.Choices;
                service.patch(RoleTitleResponse.__metadata.uri, {
                    Choices: ChoiceRequest,
                    __metadata: {
                        type: RoleTitleResponse.__metadata.type
                    }
                });
            }
        }
        ProgressLog('Create ' + Title + ' Complete', Callback); // Progress Checkpoint;
    }
    ProgressLog('Create Fields Complete', Callback); // Progress Checkpoint;

    /** Start Fix the View */
    ProgressLog('Updating Default View....', Callback); // Progress Checkpoint;
    const ChangeDefaultView = await service.get(ListResponse.DefaultView.__deferred.uri, {
        $select: '*',
        $expand: 'ViewFields'
    }).then(data => data.d);

    /**Add Fields: Default View */
    await service.post(ChangeDefaultView.ViewFields.__metadata.uri +
    '/removeAllViewFields()', {}).then(ReturnDataProperty);

    /** Checks for the option to add Title to the default view; */
    if (AddViewFieldTitle) await service.post(ChangeDefaultView.ViewFields.__metadata.uri +
    '/addViewField(\'Title\')', new Object()).then(ReturnDataProperty);

    const DefaultViewFields = Fields.filter(item => !!item.DefaultView);
    DefaultViewFields.sort(SortByOrder);

    for (const field of DefaultViewFields) await service.post(ChangeDefaultView.ViewFields.__metadata.uri +
    '/addViewField(\''+ field.Title + '\')', new Object(),).then(ReturnDataProperty);
    
    if (AddViewFieldGUID) await service.post(ChangeDefaultView.ViewFields.__metadata.uri +
    '/addViewField(\'GUID\')', {}).then(ReturnDataProperty);

    ProgressLog('Updating Default View Complete', Callback); // Progress Checkpoint;
    /** End Fix the View */
    
    if (PredefinedData)
    {
        ProgressLog('Creating Default List Items......', Callback); // Progress Checkpoint;
        const Metadata = { type: ListResponse.ListItemEntityTypeFullName };
        const ListItems = PredefinedData.map(item => {
            item.__metadata = Metadata
            return item
        });
    
        const FirstColumnLabel = Object.keys(PredefinedData[0])[0];
        var predefineddatacount = 0;

        for (const request of ListItems)
        {
            predefineddatacount++
            const response = await service.post(ListResponse.__metadata.uri +
            '/Items',
            request).then(ReturnDataProperty);
    
            ProgressLog(`Data for ${
                ListResponse.Title
            } | ${
                predefineddatacount
            } of ${
                ListItems.length
            } | ${
                response[ FirstColumnLabel ]
            }`, Callback); // Progress Checkpoint;
        }
    
        ProgressLog('Create ' + SharepointList.Title + ' Items Complete', Callback); // Progress Checkpoint;
    }

    web.Lists.results.push(ListResponse);
    return ListResponse;
}

export default async function Factory(){

    /** This is the parent for all the elements created in the factory; */
    const ContainerElement = document.querySelector('body');
    ContainerElement.classList.add('p-4');

    /** This is the dashboard card element where the user can see the progress; */
    const DashCard = new ProgressBar({
        parent: ContainerElement,
        text: 'Starting Progress',
    }).render();

    let Count = 0; /** Holds the overall count for the lists created; */
    let Total = SiteCollectionLists.length; /** List total used to calculate percent completion; */

    /** Begin List creation defined in SiteCollectionLists; */
    for (const list of SiteCollectionLists)
    {
        Count++                                   // Add list to count;
        DashCard.text(list.List.Title);           // Notify the user which list is being created and/or modified;

        /** Because the DashCard.text method gets passed as a callback, this method helps keep the element in scope; */
        const UpdateProgressbar = function UpdateProgressbar(Str){
            DashCard.text(Str);
        }
        
        /** Call the CreateList method; */
        await CreateList(list, UpdateProgressbar)
        .catch(e => console.info(e));
        
        /** After the list creation is complete (to include default data) update the progress bar; */
        DashCard.progress(Count *( 100/Total ));
    }

    /** When the list creation is complete, fade out the container, empty it, fade in to render the application; */
    $(ContainerElement).fadeOut('fast').empty().fadeIn('fast');
    ContainerElement.classList.remove('p-4');

    /** To trouble shoot error when creating lists, disable the reload; */
    /** FIXME: This fails to load list items on a list creation, had to switch it back to location.reload; */
    // if (!!window.onload) return onload();
    // else 
    return location.reload();

}