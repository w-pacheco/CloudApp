/**
 * AssignedRoles.js
 * @description Application System List - Assigned Roles list definition;
 * @author Wilfredo Pacheco
 */

export const Title = 'AssignedRoles';
export const Description = 'Application System List.';
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
    Title: 'Key', // LoginName;
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'Role',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}