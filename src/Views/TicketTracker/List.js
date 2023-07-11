/**
 * List.js
 * @description Microsoft SharePoint TicketTracker list definition.
 * @author Wilfredo Pacheco
 */

export const Title = 'Tickets';
// export const Title = 'TicketTracker';
export const Description = 'List used to report issues within the application.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = false;
export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'Status',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'TicketTitle',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'Description',
    FieldTypeKind: 3,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'Notes',
    FieldTypeKind: 3,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'CompletedDate',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'Classification',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'Priority',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'LOE',
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}