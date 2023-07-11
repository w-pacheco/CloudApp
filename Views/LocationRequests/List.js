/**
 * List.js
 * @description LocationRequests list;
 * @author Wilfredo Pacheco
 */

export const Title = 'LocationRequests';
export const Description = `This list is used to hold user defined locations not found in the Locations list. After approved 
by an administrator, the requested location will then become available for selection from the Locations list.`;
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
    Title: 'DCIRNumber',
    Description: `This will be the DCIR Number of the report this facility (or installation) is referenced from. 
    If approved by an administrator, this should then be used to reference the report by the DCIR Number and 
    correct with the approved title.`,
    FieldTypeKind: 2,
    DefaultView: true,
},{
    Title: 'MarketName',
    Description: 'Name of the market the location will fall under.',
    FieldTypeKind: 3,
    DefaultView: true,
},{
    Title: 'LocationName',
    Description: 'Name of the location to be added to the main Locations list.',
    FieldTypeKind: 3,
    DefaultView: true,
},{
    Title: 'Timezone',
    Description: 'Timezone of the location used by administrators to correctly approve the request.',
    FieldTypeKind: 3,
    DefaultView: true,
// },{
//     Title: 'FacilityName',
//     FieldTypeKind: 3,
//     DefaultView: true,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}