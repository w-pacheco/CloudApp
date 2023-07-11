/**
 * List.js
 * <<TITLE>> list;
 */

export const Title = '<<TITLE>>';
export const Description = '<<TITLE>> list description';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = false;

export const List = {
    Title,
    Description,
    BaseTemplate,
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

export const Fields = [{
    Title: '<<TITLE>>Title',
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