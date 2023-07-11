/**
 * List.js
 * @description Application System List - Roles list definition;
 * @author Wilfredo Pacheco
 */

export const Title = 'Roles';
export const Description = 'Roles used to manage views and permissions within the application.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = [{
    "RoleTitle": "Developer",
    "Description": "Creator of service/developer",
},{
    "RoleTitle": "Service Owner",
    "Description": "Application Owner",
},{
    "RoleTitle": "Administrator",
    "Description": "Delegates privileges to others.",
},{
    "RoleTitle": "Content Manager",
    "Description": "Allows users to view, create, & explore data",
}];

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'RoleTitle',
    Description: 'Title of the role that can be assigned to a user within the application.',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1,
},{
    /** FIXME: Will this work to fix the system roles? */
//     Title: 'DisplayTitle',
//     Description: 'Title of the role that can be assigned to a user within the application.',
//     FieldTypeKind: 2,
//     DefaultView: true,
//     Order: 1,
// },{
    Title: 'Description',
    Description: 'Description of the role created (is not required.)',
    FieldTypeKind: 3,
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