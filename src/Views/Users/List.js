/**
 * List.js
 * @description Microsoft SharePoint Users list definition.
 * @author Wilfredo Pacheco
 */

export const Title = 'Users';
export const Description = 'List of users and their primary role within the application.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;

/** 
 * NOTE:
 * @desctiption The PredefinedData for this list is set to an array with the intention 
 * of adding the current user to the array on the even of an install.
 * @author Wilfredo Pacheco
 */
export const PredefinedData = []; 

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'DisplayText', // Title;
    Description: 'Title of the user.',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: false,
    Order: 1
},{
    Title: 'Key', // LoginName;
    Description: 'The login name of the user.',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: false,
    Order: 1
},{
    Title: 'Email', // Email;
    Description: 'Email of the user saved.',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: false,
    Order: 1
},{
    Title: 'Hash', // Sha256 Hash;
    Description: `Sha256 string value of the user\'s email, used disguise the email value and as a 
    as a key value for the user.`,
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'Account', // Active Directory Object;
    Description: `This field is a JSON string of the users' Microsoft Active Directory account. Since 
    user accounts can be removed from the application from a site administrator, this ensures the 
    application will always render the user account information.`,
    FieldTypeKind: 3, // Multiple Lines of Text
    DefaultView: false,
    Order: 1
},{
    Title: 'Role', // GUID for ManagmentGroups;
    Description: 'This field is used to hold the overall role assigned to a user.',
    FieldTypeKind: 2, // Single Line of Text
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