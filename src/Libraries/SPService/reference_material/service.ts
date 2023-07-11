import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const SP_SITE = 'https:[<tenant>].sharepoint.com'
const CRLF = '\r\n';
const MAX_RECORDS = 1000;
const PEOPLE_SOURCE_ID = 'B09A7990-05EA-4AF9-81EF-EDFAB16C4E31';
const DIGEST_INTERVAL = 6e5; // 10 minutes
const CONTEXT_INFO = `${SP_SITE}/_api/contextinfo`;
const BATCH_API = `${SP_SITE}/_api/$batch`;
const PEOPLE_MANAGER = `${SP_SITE}/_api/SP.UserProfiles.PeopleManager`;
const LIST_API = `${SP_SITE}/_api/Web/Lists`;
const LIST_ITEMS_API = (list: string) => `${LIST_API}/GetByTitle('${list}')/Items`;
const MY_PROFILE_API = `${PEOPLE_MANAGER}/GetMyProperties`;
const PROFILE_API = (account: string) => `${PEOPLE_MANAGER}/GetPropertiesFor(accountName=@v)?@v='${account}'`;
const USERS_API = (query: string) => `${SP_SITE}/_api/search/query?querytext=${query}&sourceId='${PEOPLE_SOURCE_ID}'`;
const PICTURE_URL = (user: string, size: string) => `${SP_SITE}/_layouts/15/userphoto.aspx?size=${size}&username=${user}`;
const USER_ID_API = (account: string) => `${SP_SITE}/_api/web/siteusers?$top=1&$select=Id&$filter=LoginName eq '${account}'`;
const WF_INSTANCE = (type: string) => `${SP_SITE}/_api/SP.WorkflowServices.Workflow${type}Service.Current`;
const WF_SUBSCRIPTIONS = `${WF_INSTANCE('Subscription')}/EnumerateSubscriptions()?$select=Name,Id`;
const WF_START = (query: string) => `${WF_INSTANCE('Instance')}/StartWorkflowOnListItemBySubscriptionId(${query})`;

export interface ISharepointListItem {
  __metadata: IMetadata;
  Id: number;
  Title?: string;
  AuthorId?: number;
}
export interface ISharepoint<T> {
  d: ISharepointD<T>;
}
export interface ISharepointItem<T> {
  d: T;
}
export interface ISharepointFieldChoices {
  d: ISharepointD<{
    Choices: {
      results: string[];
    };
  }[]>;
}
export interface ISharepointUser {
  AccountName: string;
  DisplayName: string;
  Email: string;
  UserProfileProperties: {
    results: ISharepointObject[];
  };
}
export interface ISharepointUserId {
  d: {
    results: {
      Id: number;
    }[];
  };
}
export interface ISharepointProfileProps {
  d: {
    UserProfileProperties: {
      results: ISharepointObject[];
    };
  };
}
export interface ISharepointContextInfo {
  d: {
    GetContextWebInformation: {
      FormDigestValue: string;
    };
  };
}
export interface ISharepointSearch {
  d: {
    query: {
      PrimaryQueryResult: {
        RelevantResults: {
          Table: {
            Rows: {
              results: {
                Cells: { results: ISharepointObject[]; };
              }[];
            };
          };
        };
      };
    };
  };
}
interface ISharepointObject {
  Key: string;
  Value: string;
}
interface ISharepointD<T> {
  results: T;
  __next?: string;
  ItemCount?: number;
}
interface IMetadata {
  etag: string;
}

/**
 *
 * SharepointService is the base class to Sharepoint
 */
export class SharepointService {

  private static RequestDigest: { value: string, timestamp: number } = null;
  private static ME: ISharepointUser = null;

  /** Max Records listdata.svc can fetch via REST */
  public maxRecords: number = MAX_RECORDS;

  /**
   * Constructor to init SharepointService
   */
  constructor(private httpClient: HttpClient) {
    // this.generateBatch('create', 'SampleList', [{Title: '2', Message: '2'}]).subscribe(data => console.log(data));
  }

  /**
   * API Default headers merged with passed values
   *
   * @param [options] If headers are passed they are merged with defaults
   * @returns headers
   */
  private getHeaders(options?: object): { headers: HttpHeaders } {
    const defaults = {
      Accept: 'application/json;odata=verbose'
    };
    return { headers: new HttpHeaders(Object.assign(defaults, options || {})) };
  }

  /**
   * Context Info for Invasive operations
   *
   * @returns formDigestValue
   */
  private getContextFormDigest(): Observable<string> {
    const digest = SharepointService.RequestDigest;
    if (digest != null && (new Date().getTime() - digest.timestamp) < DIGEST_INTERVAL) {
      return of(digest.value);
    } else {
      return this.httpClient.post<ISharepointContextInfo>(CONTEXT_INFO, {}, this.getHeaders())
        .pipe(
          map(res => res.d.GetContextWebInformation.FormDigestValue),
          tap(value => {
            SharepointService.RequestDigest = {
              value,
              timestamp: new Date().getTime()
            };
          })
        );
    }
  }

  /**
   * Count all the items in a list or based on query
   * NOTE: On passing a query it might not be right always but should work if < 100
   *
   * @param listName The name of the list
   * @returns countItems
   */
  protected count<T>(listName: string, query?: string): Observable<number> {
    const countUrl = query ? 'Items' : 'ItemCount';
    return this.httpClient.get<ISharepoint<T[]>>(
      `${LIST_API}/GetByTitle('${listName}')/${countUrl}?${query || ''}`,
      this.getHeaders()
    )
      .pipe(map(res => query ? res.d.results.length : res.d.ItemCount));
  }

  /**
   * Create Item with this call
   *
   * @param data The record that is to be created
   * @param listName the sharepoint list from where the record needs to be deleted
   * @returns newItem
   */
  protected create<T extends ISharepointListItem>(listName: string, data: T): Observable<ISharepointItem<T>> {
    return this.getContextFormDigest()
      .pipe(
        switchMap(requestDigest => this.httpClient.post<ISharepointItem<T>>(
          LIST_ITEMS_API(listName),
          { ...data, __metadata: { type: `SP.Data.${listName}ListItem` } },
          this.getHeaders({
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': requestDigest,
          })
        ))
      );
  }

  /**
   * Retrieve item(s) with this call
   *
   * @param listName the listname where the query is to be passed
   * @param query the query string to pass to the REST api
   * @returns listOfItems
   */
  protected retrieve<T>(listName: string, query?: string): Observable<ISharepoint<T>> {
    return this.httpClient.get<ISharepoint<T>>(`${LIST_ITEMS_API(listName)}?${query || ''}`, this.getHeaders());
  }

  /**
   * Update Item with this call
   *
   * @param listName the sharepoint list from where the record needs to be deleted
   * @param data The record that is to be deleted
   * @returns updatedItem
   */
  protected update<T extends ISharepointListItem>(listName: string, data: T): Observable<ISharepoint<T>> {
    return this.getContextFormDigest()
      .pipe(
        switchMap(requestDigest => this.httpClient.post<ISharepoint<T>>(
          `${LIST_ITEMS_API(listName)}(${data.Id})`,
          { ...data, __metadata: { type: `SP.Data.${listName}ListItem` } },
          this.getHeaders({
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': requestDigest,
            'X-HTTP-Method': 'MERGE',
            'If-Match': data.__metadata.etag
          })
        ))
      );
  }

  /**
   * Delete Item with this call
   *
   * @param listName the sharepoint list from where the record needs to be deleted
   * @param data The record that is to be deleted
   * @returns confirmation
   */
  protected delete<T extends ISharepointListItem>(listName: string, data: T): Observable<ISharepoint<T>> {
    return this.getContextFormDigest()
      .pipe(
        switchMap(requestDigest => this.httpClient.post<ISharepoint<T>>(
          `${LIST_ITEMS_API(listName)}(${data.Id})`,
          null,
          this.getHeaders({
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': requestDigest,
            'X-HTTP-Method': 'DELETE',
            'If-Match': data.__metadata.etag
          })
        ))
      );
  }

  /**
   * Gets all the choices of a choice field from List
   *
   * @param listName the name of the list
   * @param fieldName the choice field name
   * @returns choices string array
   */
  protected getFieldChoices(listName: string, fieldName: string): Observable<string[]> {
    const url = `${LIST_API}/GetByTitle('${listName}')/fields?$filter=EntityPropertyName eq '${fieldName}'`;
    return this.httpClient.get<ISharepointFieldChoices>(url, this.getHeaders())
      .pipe(map(response => response.d.results[0].Choices.results));
  }

  /**
   * Fetch the Logged in User Information
   *
   * @returns loggedInUser
   */
  public getLoggedInUser(): Observable<ISharepointUser> {
    if (SharepointService.ME !== null) {
      return of(SharepointService.ME);
    } else {
      return this.httpClient.get<ISharepointProfileProps>(
        `${MY_PROFILE_API}?$select=AccountName,DisplayName,Email,UserProfileProperties`,
        this.getHeaders()
      )
        .pipe(
          map(response => {
            const props = response.d.UserProfileProperties.results
              .filter(row => row.Value !== '')
              .reduce((result, row) => ({ ...result, [row.Key]: row.Value }), {});
            return { ...response.d, ...props } as ISharepointUser;
          }),
          tap(user => {
            SharepointService.ME = user;
          })
        );
    }
  }

  /**
   * Gets the user based on passed user's account name
   *
   * @param accountName the account-name for the user
   * @returns userDetails
   */
  protected getProfileData(accountName: string): Observable<ISharepointUser> {
    const url = `${PROFILE_API(encodeURIComponent(accountName))}&$select=AccountName,DisplayName,Email,UserProfileProperties`;
    return this.httpClient.get<ISharepointProfileProps>(url, this.getHeaders())
      .pipe(
        map(response => {
          const props = response.d.UserProfileProperties.results
            .filter(row => row.Value !== '')
            .reduce((result, row) => ({ ...result, [row.Key]: row.Value }), {});
          return { ...response.d, ...props } as ISharepointUser;
        })
      );
  }

  /**
   * Gets the sharepoint userId based on passed user's account name
   *
   * @param accountName the account-name for the user
   * @returns sharepointUserId
   */
  protected getUserId(accountName: string): Observable<number> {
    return this.httpClient.get<ISharepointUserId>(USER_ID_API(encodeURIComponent(accountName)), this.getHeaders())
      .pipe(
        map(response => response.d.results[0].Id)
      );
  }

  /**
   * Gets the picture url for the profile
   *
   * @param email email id of the user
   * @returns url of the picture
   */
  protected getPictureUrl(email: string, size: string): string {
    return PICTURE_URL(email, size);
  }

  /**
   * Search all users based on the search input string
   *
   * @param term the search term to search
   * @returns users matched by search term
   */
  protected searchUsers(term: string): Observable<ISharepointUser[]> {
    if (!term) {
      return of([]);
    } else {
      const query = `'(${this.notNullSearchFilter('SipAddress')}) AND (PreferredName:*${term}* OR SipAddress:*${term}*)'`;
      const url = `${USERS_API(query)}&selectproperties='AccountName,SipAddress,Title,PreferredName,PictureURL'`;
      return this.httpClient.get<ISharepointSearch>(url, this.getHeaders())
        .pipe(map(response => (response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
          .map(row => row.Cells.results
            .reduce((result, rowItem) => ({ ...result, [rowItem.Key]: rowItem.Value }), {} as ISharepointUser)
          ))
        ));
    }
  }

  /**
   * An alternative to match all which is equivalent to not null which searching
   * #Refer *searchUsers()*
   *
   * @param column name of column to include
   * @returns queryNotNull for a column
   */
  private notNullSearchFilter(column: string): string {
    // Fucked up logic for sharepoint not null
    return '_abcefghijklmonpqrstuvwxyz0123456789'
      .split('')
      .map(unit => `${column}:${unit}*`)
      .join(' OR ');
  }

  /**
   * Do Attachments Operations like delete, retrieve, and add to a list
   *
   * @param mode the nature of operation GetAttachments | DeleteAttachment | AddAttachment
   * @param id The Id of the List Item
   * @param listName The name of the list
   * @param [fileName] The Name of the file required for DeleteAttachment/AddAttachment operations
   * @param [fileData] The File data required when adding the file for AddAttachment operation
   * @returns attachmentList | confirmation | newItem
   */
  protected doAttachmentsOperation(
    mode: string,
    id: number,
    listName: string,
    fileName?: string,
    fileData?: ArrayBuffer
  ): Observable<any> {
    switch (mode) {
      case 'GetAttachments':
        return this.httpClient.get(`${LIST_API}/GetByTitle('${listName}')/Items(${id})/AttachmentFiles`, this.getHeaders());
      case 'DeleteAttachment':
        return this.getContextFormDigest()
          .pipe(
            switchMap(requestDigest => this.httpClient.post(
              `${LIST_API}/GetByTitle('${listName}')/Items(${id})/AttachmentFiles/GetByFileName('${fileName}')`,
              null,
              this.getHeaders({
                'X-RequestDigest': requestDigest,
                'X-HTTP-Method': 'DELETE',
              })
            ))
          );
      case 'AddAttachment':
        return this.getContextFormDigest()
          .pipe(
            switchMap(requestDigest => this.httpClient.post(
              `${LIST_API}/GetByTitle('${listName}')/Items(${id})/AttachmentFiles/Add(FileName='${fileName}')`,
              fileData,
              this.getHeaders({
                'X-RequestDigest': requestDigest,
                'Content-Type': undefined,
                // Microsoft proved me again that it is so stupid that can make you think you are stupid :(
              }),
            ))
          );
    }
  }

  /**
   * Transforms payload to acceptable Workflow input
   *
   * @param data payload for Workflow
   * @returns transformed request
   */
  private wfDataTransform(data: object): object {
    const primitiveTypes = { string: 'Edm.String', boolean: 'Edm.Boolean', number: 'Edm.Int32' };
    return {
      payload: Object.keys(data)
        .map(Key => ({
          Key,
          Value: data[Key],
          ValueType: primitiveTypes[(typeof data[Key])]
        }))
    };
  }

  /**
   * Initiates a Workflow 2013
   *
   * @param workflow Name of the workflow to start
   * @param itemId The item that the workflow will init with context
   * @param data the associated data params
   * @returns workflow response
   */
  protected startWorkflow(workflow: string, itemId: number, data: object): Observable<string> {
    return this.getContextFormDigest()
      .pipe(
        switchMap(requestDigest => this.httpClient.post<any>(
          `${WF_SUBSCRIPTIONS}`,
          null,
          this.getHeaders({
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': requestDigest,
          })
        )
          .pipe(
            map(response => {
              const subscription = response.d.results.find(sub => sub.Name === workflow);
              if (subscription) {
                return subscription.Id;
              } else {
                throw new Error('No Subsctiption found');
              }
            }),
            switchMap(subscriptionId => this.httpClient.post<any>(
              `${WF_START(`subscriptionId='${subscriptionId}',itemId='${itemId}'`)}`,
              this.wfDataTransform(data),
              this.getHeaders({
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': requestDigest,
              })
            ))
          )
        ),
        map(wfResponse => wfResponse.d.StartWorkflowOnListItemBySubscriptionId),
      );
  }

  /**
   * Generates an unique identifier for batch operations
   *
   * @returns uuid
   */
  private generateUUID(): string {
    let dateTime = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (item) => {
      // tslint:disable:no-bitwise
      const replacer = (dateTime + Math.random() * 16) % 16 | 0;
      dateTime = Math.floor(dateTime / 16);
      return (item === 'x' ? replacer : (replacer & 0x7 | 0x8)).toString(16);
      // tslint:enable:no-bitwise
    });
  }

  /**
   * Batch CRUD method
   * NOTE: not working Sharepoint syntax is confusing
   *
   * @param operation any of CRUD
   * @param listName the sharepoint list from where the record needs to be operated
   * @param data the data for the operation
   * @returns custom response
   */
  private generateBatch<T>(operation, listName, data): Observable<any> {
    const batchGuid = this.generateUUID();
    const changeSetId = this.generateUUID();
    const batchContents = [];
    const changeContents = [];
    let dataSet = '';

    data.forEach(item => {
      changeContents.push(`--changeset_${changeSetId}`);
      changeContents.push(`Content-Type: application/http`);
      changeContents.push(`Content-Transfer-Encoding: binary`);
      changeContents.push(``);
      changeContents.push(`POST ${LIST_ITEMS_API(listName)} HTTP/1.1`);
      changeContents.push(`Content-Type: application/json;odata=verbose`);
      changeContents.push(``);
      changeContents.push(JSON.stringify({ ...item, __metadata: { type: `SP.Data.${listName}ListItem` } }));
      changeContents.push(``);
    });
    changeContents.push(`--changeset_${changeSetId}--`);

    dataSet = changeContents.join(CRLF);

    batchContents.push(`--batch_${batchGuid}`);
    batchContents.push(`Content-Type: multipart/mixed; boundary=changeset_${changeSetId}`);
    batchContents.push(`Content-Length: ${dataSet.length}`);
    batchContents.push(`Content-Transfer-Encoding: binary`);
    batchContents.push(``);
    batchContents.push(dataSet);
    batchContents.push(``);

    batchContents.push(`--batch_${batchGuid}`);
    batchContents.push(`Content-Type: application/http`);
    batchContents.push(`Content-Transfer-Encoding: binary`);
    batchContents.push(``);
    batchContents.push(`GET ${LIST_ITEMS_API(listName)} HTTP/1.1`);
    batchContents.push(`Accept: application/json;odata=verbose`);
    batchContents.push(``);

    batchContents.push(`--batch_${batchGuid}--`);

    const batchBody = batchContents.join(CRLF);

    return this.getContextFormDigest()
      .pipe(
        switchMap(requestDigest => this.httpClient.post<T>(
          BATCH_API,
          batchBody,
          this.getHeaders({
            'Content-Type': `multipart/mixed; boundary=batch_${batchGuid}`,
            'X-RequestDigest': requestDigest,
            Accept: '*/*'
          })
        ))
      );
  }

}