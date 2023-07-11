/**
 * List.js
 * Acknowledgements list;
 * @author Wilfredo Pacheco
 */


export const Title = 'Acknowledgements';
export const Description = 'Holds DOC, Market POC, & Office acknowledgements for incident list items.';
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
    Title: 'Group',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'DCIR',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'EventTypeId',
    FieldTypeKind: 9,
    DefaultView: true,
    Order: 2,
},{
    Title: 'type',
    Description: 'The different types here are: Market, DOC, OPR, OCR',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'user',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'email',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'key',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2,
},{
    Title: 'timestamp',
    FieldTypeKind: 4,
    DefaultView: true,
    Order: 2,
},{
    Title: 'sort',
    FieldTypeKind: 9,
    DefaultView: true,
    Order: 2,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}