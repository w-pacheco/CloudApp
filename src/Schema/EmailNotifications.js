/**
 * EmailNotifications.js
 * 
 * @description This should be used if the environment does not allow email notifications with SharePoint REST Api.
 * Also, that means this table would need a user to manually set up a workflow.
 * 
 * Application System List - Email Notifications list definition;
 * @author Wilfredo Pacheco
 */

export const Title = 'EmailNotifications';
export const Description = `Application System List | This list is used if the SharePoint environment does not allow 
email notifications via the REST API, requires worflow setup.`;
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
    Title: 'Subject',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1
}, {
    Title: 'Body',
    FieldTypeKind: 3, // 3 (Mulitiple Lines of Text)
    DefaultView: true,
    Order: 2
}, {
    Title: 'SendTo',
    FieldTypeKind: 3, // 3 (Mulitiple Lines of Text)
    DefaultView: true,
    Order: 2
}, {
    Title: 'CC',
    FieldTypeKind: 3, // 3 (Mulitiple Lines of Text)
    DefaultView: true,
    Order: 2
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}