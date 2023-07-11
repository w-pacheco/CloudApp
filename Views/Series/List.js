/**
 * List.js
 * Series list;
 * @author Wilfredo Pacheco
 */

export const Title = 'Series';
export const Description = 'This list holds the timestamp for the project question series.';
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
    Title: 'SeriesTitle',
    Description: 'Title of question series.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Status',
    Description: 'Status of question series.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Description',
    Description: 'Details for the question series.',
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