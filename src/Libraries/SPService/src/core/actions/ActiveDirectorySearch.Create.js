/**
 * ActiveDirectorySearch.Create.js
 * @author Wilfredo Pacheco
 */

/** CreateSearchPayload Properties */
const AllowEmailAddresses = false;
const AllowMultipleEntities = true;
const AllUrlZones = false;
const ForceClaims = false;
const MaximumEntitySuggestions = 15;
const PrincipalSource = 15;
const PrincipalType = 5;
const Required = true;
const SharePointGroupID = 0;
const UrlZone = 0;
const UrlZoneSpecified = false;
const WebApplicationID = '{00000000-0000-0000-0000-000000000000}';

export default function ActiveDirectorySearchPayload(queryString){

    const Request_xmlns = '<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName="Javascript Library">' +
            '<Actions>' +
                '<StaticMethod TypeId="{de2db963-8bab-4fb4-8a58-611aebc5254b}" Name="ClientPeoplePickerSearchUser" Id="0">' +
                    '<Parameters>' +
                        '<Parameter TypeId="{ac9358c6-e9b1-4514-bf6e-106acbfb19ce}">' +
                            '<Property Name="AllowEmailAddresses" Type="Boolean">' + AllowEmailAddresses + '</Property>' +
                            '<Property Name="AllowMultipleEntities" Type="Boolean">' + AllowMultipleEntities + '</Property>' +
                            '<Property Name="AllUrlZones" Type="Boolean">' + AllUrlZones + '</Property>' +
                            '<Property Name="EnabledClaimProviders" Type="Null" />' +
                            '<Property Name="ForceClaims" Type="Boolean">' + ForceClaims + '</Property>' +
                            '<Property Name="MaximumEntitySuggestions" Type="Number">' + MaximumEntitySuggestions + '</Property>' +
                            '<Property Name="PrincipalSource" Type="Number">' + PrincipalSource + '</Property>' +
                            '<Property Name="PrincipalType" Type="Number">' + PrincipalType + '</Property>' +
                            '<Property Name="QueryString" Type="String">' + queryString + '</Property>' +
                            '<Property Name="Required" Type="Boolean">' + Required + '</Property>' +
                            '<Property Name="SharePointGroupID" Type="Number">' + SharePointGroupID + '</Property>' +
                            '<Property Name="UrlZone" Type="Number">' + UrlZone + '</Property>' +
                            '<Property Name="UrlZoneSpecified" Type="Boolean">' + UrlZoneSpecified + '</Property>' +
                            '<Property Name="Web" Type="Null" />' +
                            '<Property Name="WebApplicationID" Type="String">' + WebApplicationID + '</Property>' +
                        '</Parameter>' +
                    '</Parameters>' +
                '</StaticMethod>' +
            '</Actions>' +
            '<ObjectPaths />' +
        '</Request>';

        return Request_xmlns;
}