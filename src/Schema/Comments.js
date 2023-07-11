/**
 * Comments.js
 * @description Application System List - Comments list definition;
 * @author Wilfredo Pacheco
 */

export const Title = 'Comments';
export const Description = 'Comments tied by GUID to list items in the application.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = true;
export const AddViewFieldGUID = false;
export const PredefinedData = false;
export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'FK_GUID',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1
},{
    Title: 'User',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2
},{
    Title: 'UserTitle',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 3
},{
    Title: 'UserComment',
    FieldTypeKind: 3,
    DefaultView: true,
    Order: 4
},{
    Title: 'UserKey',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 5
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}