/**
 * List.js
 * RandomUsers list;
 */

export const Title = 'RandomUsers';
export const Description = 'RandomUsers list description';
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
    Title: 'RandomUsersTitle',
    Description: '',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Description',
    Description: '',
    DefaultView: true,
    FieldTypeKind: 3,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}