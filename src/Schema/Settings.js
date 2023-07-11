/**
 * Settings.js
 * @author Wilfredo Pacheco
 */

export const Title = 'Settings';
export const Description = 'Application system list.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = [{
    Key: 'v1.0',
    Properties: JSON.stringify({
        Installed: {
            New: true,
        },
    }),
}];

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'Key',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1,
},{
    Title: 'Properties',
    FieldTypeKind: 3,
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