/**
 * List.js
 * Branches list;
 * @author Wilfredo Pacheco
 */


export const Title = 'Branches';
export const Description = '';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = [
    {
        "Branch": "Air Force"
    },
    {
        "Branch": "Army"
    },
    {
        "Branch": "Marines"
    },
    {
        "Branch": "Navy"
    },
    {
        "Branch": "Civilian"
    },
    {
        "Branch": "Contractor"
    },
    {
        "Branch": "None"
    }
]

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'Branch',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 2
},];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}