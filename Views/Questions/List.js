/**
 * List.js
 * Questions list;
 * @author Wilfredo Pacheco
 */

export const Title = 'Questions';
export const Description = 'This list holds the questions for the project and the responses.';
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
    Title: 'Project_FK',
    Description: 'FK of the project.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Series_FK',
    Description: 'FK for the series of questions.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Status',
    Description: 'Status for the question.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Question',
    Description: 'Question for the members of the project.',
    DefaultView: true,
    FieldTypeKind: 3,
},{
    Title: 'Response',
    Description: 'Response for the questions submitted by the members of the project.',
    DefaultView: true,
    FieldTypeKind: 3,
    // encrypted: true,
// },{
//     Title: 'ResponseAuthor',
//     Description: 'Response for the questions submitted by the members of the project.',
//     DefaultView: true,
//     FieldTypeKind: 2,
},{
    Title: 'Notes',
    Description: 'Notes for the questions submitted by (and only visible to) the project administrators/developers.',
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