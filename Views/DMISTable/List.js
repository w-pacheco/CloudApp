/**
 * List.js
 * @description Microsoft SharePoint DMISTable list definition.
 * @author Wilfredo Pacheco
 */

export const Title = 'DMIS';
export const Description = 'DMIS table with import functionality from Microsoft Excel file.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = false

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'DMISID',
    Description: `DMIS ID - Unique identification code assigned by TMA to facilities, catchment areas, and other entities.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'DCWID',
    Description: `DCW IDUnique identification code of a treatment facility that reports or has reported direct care workload (biometrics) data.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'UnitIDCode',
    Description: `Unit ID Code - Military Unit ID Code (UIC).`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ServiceCode',
    Description: `Facility Service Code - Military service responsible for a treatment facility.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'TypeCode',
    Description: `Facility Type Code - Category of the overall capability of a treatment facility or other entity associated with a DMIS ID.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'DMISFacilityName',
    Description: `DMIS Facility Name - Name and installation of the treatment facility as assigned by Service.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'FacilityName',
    Description: `Facility Name - Distintive designation of a treatment facility.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'InstallationName',
    Description: `Installation Name - Designation of the base or post on which a treatment facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'FIPSCountryCode',
    Description: `Facility FIPS Country Code - Code of the country in which a facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'StateCode',
    Description: `Facility State Code - Code of the US state, territory, or possession in which a facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'CityName',
    Description: `Facility City Name - City in which a facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'FiveDigitZIPCode',
    Description: `Facility 5-Digit ZIP Code - Five-digit ZIP Code or APO/FPO of a facility.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'FourDigitZIPCode',
    Description: `Facility 4-Digit ZIP Code - Four-digit extension to a facility's five-digit ZIP Code.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'HealthServiceRegion',
    Description: `Health Service Region - The TRICARE Lead Agent, T-3 or T2017 Region in which a treatment facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'USFlagCode',
    Description: `US Flag Code - Flag indicating that a location is either inside or outside of the United States, its territories or possesions.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'DMISParentID',
    Description: `DMIS Parent ID - DMIS ID through which a treatment facility reports data.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'MEPRSParentID',
    Description: `MEPRS Parent ID - DMIS ID through which a treatment facility reports MEPRS data.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ServiceAreaCode',
    Description: `Service Area Code - Data element determined to be obsolete; values blanked out in DMIS ID Table of 1 March 2015.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'MarketCode',
    Description: `Market/DHAR/SSO Code - Major or intermediate command to which a treatment facility has been assigned. Values listed 
    in Source/Values column are those found in currently active records; see "Facility Command Codes" tab for a 
    listing of values that include inactive records.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'AuthorizedTRICARE',
    Description: `Authorized TRICARE Enrollment Site - Flag indicating whether a facility is or has ever been authorized to enroll DoD beneficiaries in the various TRICARE programs.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'DHPCode',
    Description: `DHPCode - Flag indicating whether the DMIS ID Branch of Service and source of operational authority is affiliated with 
    Defense Health Program funding. Affiliated Branch of Service/Authority Codes include: A, F, J, M, N, O, P, S, T, and V.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'BranchofServiceCode',
    Description: `Branch of Service Authority Code - Code indicating the DMIS ID's branch of service and source of operational authority.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'NPIRequired',
    Description: `NPI2Required - Flag indicating whether a Type 2 (organizational) National Provider ID is required for the entity.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'NPINumber',
    Description: `NPI2Number - National Provider Identifier associated with the facility / organization.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'NPIHIPAATaxonomy',
    Description: `NPI2 HIPAA Taxonomy - Heath Care Provider Taxonomy Code as maintained by the National Uniform Claim Committee (NUCC).`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ISOCountryCode',
    Description: `Facility ISO CountryCode - Code of the country in which a facility is located.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ReadinessServiceCode',
    Description: `Readiness Service Code - The service branch that oversaw the MTF prior to turn over to DHA.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ReadinessParentID',
    Description: `Readiness Parent ID - Parent DMIS ID that provides overarching medical support for a service’s operational forces/line units.`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ReadinessCommandCode',
    Description: `Readiness Command Code - The command code associated with the MTF prior to turn over to DHA`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'StreetAddress',
    Description: `Facility Street Address - The street address assocaited with the facility`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'BuildingNumber',
    Description: `Facility Building Number - The building number associated with the facility`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'CountyName',
    Description: `Facility County Name - The county name associated with the facility`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ExpandedMarketCode',
    Description: `Expanded Market Code - The expanded market code associated with the facility`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ActiveDentalCare',
    Description: `Active Dental Care`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'ReadinessParentID',
    Description: `Readiness Parent ID`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'MarketEstablishmentDate',
    Description: `Market Establishment Date`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'MHSGenesisTimeZoneCode',
    Description: `MHS Genesis Time Zone Code`,
    FieldTypeKind: 2,
    DefaultView: true, 
    Order: 1,
},{
    Title: 'AssignedMarket',
    Description: '',
    DefaultView: true, 
    FieldTypeKind: 2,
}, {
    Title: 'LocationType',
    Description: 'State whether the list item is a Facility or a Market',
    DefaultView: true, 
    FieldTypeKind: 2,
}, {
    Title: 'Location',
    Description: 'Holds the display name value that is used in the tool',
    DefaultView: true, 
    FieldTypeKind: 2,
}, {
    Title: 'Latitude',
    Description: '',
    DefaultView: true, 
    FieldTypeKind: 2,
}, {
    Title: 'Longitude',
    Description: '',
    DefaultView: true, 
    FieldTypeKind: 2,
}, {
    Title: 'EmailAddresses', 
    Description: '',
    DefaultView: true, 
    FieldTypeKind: 3,
},];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}