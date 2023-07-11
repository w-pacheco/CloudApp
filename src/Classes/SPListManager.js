/**
 * SPListManager.js
 * @author Wilfredo Pacheco
 */

import { service, web, name as biome } from "../Biome.js";

const resetPaginationOnDataUpdate = false;

export default class SPListManager {

    constructor(table_component){
        
        const {
            List,
            $select,
            $filter,
            $expand,
            $top,
            $orderby,
            // $table,
            data,
            watch = true,
            th,
            Element,
        } = table_component;

        this.List = List;
        
        /** Custom OData parameters set by view; */
        this.$select = $select;
        this.$filter = $filter;
        this.$expand = $expand;
        this.$top = $top;
        this.$orderby = $orderby;
        
        this.table_component = table_component;
        // this.$table = table_component.getTable();
        // this.table_headers = table_headers;
        this.timestamp = new Date().toISOString();
        this.watch = watch;
        this.data = data;
        this.th = th;
        this.Element = Element;

    }

    getRequestBody(){

        let $select = this.th
        .map(t => t.col.data)
        .filter(f => !f.includes('.'))
        .join(',');
    
        const RequestOptions = {
            $select,
            $orderby: 'Id desc',
        }
    
        /** These are will set the custom properties for the refresh call; */
        if (this.$select) RequestOptions.$select += `,${this.$select}`;
        if (this.$expand) RequestOptions.$expand = this.$expand;
        if (this.$orderby) RequestOptions.$orderby = this.$orderby;
        if (this.$top) RequestOptions.$top = this.$top;
        if (this.$filter) RequestOptions.$filter = this.$filter;
    
        return RequestOptions;
    
    }

    getItemCount(){

        if (!this?.List?.__metadata) return;

        const { uri } = this.List.__metadata;

        return service.Get(`${
            uri
        }/ItemCount`)
        .then(data => data.d)
        .then(data => data.ItemCount)
        .catch(response => console.info(response));

    }

    async getItems(){

        /** Get ItemCount to pull in all list items; */
        const ItemCount = await this.getItemCount();

        /** TODO: If a list item count is greater than set limit, check instance for lazy load; */
        // if (ItemCount >= 8000) console.info('Lazy load method here;')
        const RequestOptions = this.getRequestBody();
        
        /** @return data array; */
        return service.Get(`${this?.List?.__metadata?.uri}/Items`, Object.assign(RequestOptions, {
            $top: ItemCount,
        }))
        .then(data => data.d)
        .then(data => data.results);

    }

    async getLastModified(timestamp){

        const data = this.data;
        const List = this.List;
        const { ItemCount, __metadata } = List;

        const modified = await service.Get(`${__metadata.uri}/Items`, {
            $select: '*',
            $filter: `Modified ge '${timestamp}'`,
            $top: ItemCount,
        }).then(data => data.d.results);

        if (modified.length)
        {
            for (const updated of modified)
            {
                const { uri } = updated.__metadata;
                const index = data.map(item => item.__metadata.uri).indexOf(uri);
                
                if (index >= 0) data.splice(index, 1, updated);
                else data.push(updated);
            }

            this.update(data); 
            this.timestamp = new Date().toISOString();
        }
        
    }

    async getLastRecycled(timestamp){

        /** TODO: what happens if you don't have access to the recycling bin? */

        const $table = this.$table;
        const List = this.List;
        
        const { ItemCount } = List;
        const $filter = [
            `(DeletedDate ge datetime'${timestamp}')`,
            `(substringof('${List.Title}', DirName))`,
        ].join(' and ');

        const recycles = await service.Get(`${web.Url}/_api/Web/RecycleBin`, {
            $select: '*',
            $filter,
            $orderby: 'DeletedDate desc',
            $top: ItemCount,
        }).then(data => data.d.results);

        if (recycles.length)
        {
            for (const recycled of recycles)
            {
                const { LeafName } = recycled;
                const aoData = Array.from($table.context[0].aoData);
                /** NOTE: This does require the table to call for the Id of the list item to function; */
                const index = aoData.map(item => `${item._aData.Id}_.000`).indexOf(LeafName);
                $table.row(index).remove();
                $table.draw();
            }
    
            this.timestamp = new Date().toISOString();
        }
        
    }

    /**
     * ChangeType:
     * 1 Created
     * 2 Edited
     * 3 Delete
     * 7 Restore
     */
    async getChanges(ChangeTokenStart, ChangeTokenEnd){
        
        const component = this;
        const { uri } = this.List.__metadata;
        const { $table } = this.table_component;

        const type = 'SP.ChangeQuery';
        const query = {
            Add: true,
            DeleteObject: true,
            Item: true,
            List: true,
            Restore: true,
            Update: true,
            __metadata: {
                type,
            },
        }

        if (ChangeTokenStart) query.ChangeTokenStart = {
            StringValue: ChangeTokenStart.StringValue,
        }

        if (ChangeTokenEnd) query.ChangeTokenEnd = {
            StringValue: ChangeTokenEnd.StringValue,
        }

        const results = await service.Post(`${uri}/getChanges`, { query })
        .then(data => data.d.results);

        /**
         * ChangeType
         * 1 Created
         * 2 Edited
         * 3 Delete
         * 7 Restore
         */

        function removeFromTable(ItemId){
            const aoData = Array.from($table.context[0].aoData);
            /** NOTE: This does require the table to call for the Id of the list item to function; */
            const index = aoData.map(item => item._aData.Id).indexOf(ItemId);
            $table.row(index).remove();
        }

        function getItemById(ItemId){
            
            const RequestOptions = component.getRequestBody();
            
            /** When getting item by Id, these are not required; */
            delete RequestOptions.$filter;
            delete RequestOptions.$orderby;
            delete RequestOptions.$top;
            
            return service.Get(`${uri}/Items(${ItemId})`, RequestOptions)
            .then(data => data.d);
        }

        /** FIXME: This should refresh the table if the results exceed the LIMIT; */
        const CHANGE_LIMIT = 15;
        if (results.length > CHANGE_LIMIT) console.info(`The update list item exceeds the ${
            CHANGE_LIMIT
        } item limit: ${
            results.length
        }`);

        /** This only works well if the changes are less than 10-15; */
        /** TODO: Maybe if we filter based off change type, that will help keep from the table glitching? */
        // TODO: These should JUST be added to the table; a Promise.all would work for this;
        // if (results.length > CHANGE_LIMIT)
        // {
        //     const AddOrRestored = results.filter(function filterAddAndRestore(item){
        //         if (item.ChangeType === 1 || item.ChangeType === 7) return item;
        //     });
        //     const UpdatesAndDeletes = results.filter(function filterAddAndRestore(item){
        //         if (item.ChangeType === 2 || item.ChangeType === 3) return item;
        //     });
        //     await Promise.all(AddOrRestored.map(function({ItemId}){
        //         /** 1=add 7=restore; */
        //         // Get the item and add it to the table;
        //         return getItemById(ItemId).then(item => {
        //             $table.row.add(item);
        //             return item;
        //         });
        //     }))
        //     .then(results => {
        //         results.forEach(item => {
        //             $table.row.add(item);
        //         });
        //         $table.draw();
        //     });
        // }
        /**
         * FIXME: The issue here is that if there are more than 500 changes then this method is not efficient;
         * 
         * The issue with the solution commented out above is that these are a list of changes, in order.
         * So if we just get the new items and add them the changes are out of order when handling any update or delete.
         * 
         * @example user1 loads list, walks to make coffee, 
         * user2 makes a list item and deletes it. then user2 uses the undo feature.
         * based on the logic above, if user1 triggers the watcher method
         * the new item will be added to the list, followed by the removal 
         * if the for loop is changed to: for (const item of UpdatesAndDeletes)
         * 
         * The method would need to check the filtered results,
         * and handle them individually before adding them to the datatable;
         * 
         * Proposed Solution: trigger the refresh if the result.length is greater than CHANGE_LIMIT;
         */
        for (const item of results)
        {
            const { ChangeType, ItemId } = item;

            if (ChangeType === 1
            || ChangeType === 7)
            { /** 1=add 7=restore; */
                // Get the item and add it to the table;
                const item = await getItemById(ItemId);
                $table.row.add(item);
            }
            
            else if (ChangeType === 2)
            { /** 2=update; */
                removeFromTable(ItemId);
                // Get the item and add it to the table;
                const item = await getItemById(ItemId);
                $table.row.add(item);
            }

            /** 3=delete; */
            else if (ChangeType === 3) removeFromTable(ItemId);

            else console.info(`%c${biome} | Items on the ${
                List.Title
            } list were changed with an unknown ChangeType: ${ChangeType}`, 'color: gold;');

            $table.draw(resetPaginationOnDataUpdate);
        }

    }

    getChangeToken(){

        const { List } = this;
        
        return service.Get(List.__metadata.uri, {
            $select: 'ItemCount,CurrentChangeToken,LastItemModifiedDate,LastItemDeletedDate',
        },{
            cache: false,
        }).then(data => data.d);

    }

    /** Handle the update of the current List Object; */
    updateCachedListObject({
        ItemCount,
        CurrentChangeToken,
        LastItemModifiedDate,
        LastItemDeletedDate,
    }){
        /** Handle the list defined on the Web Object; */
        // const Id = this.List.Id;
        // const WebList = Web.Lists.results.filter(l => l.Id === Id);
        // if (WebList) Object.assign(WebList, {
        //     ItemCount,
        //     CurrentChangeToken,
        //     LastItemModifiedDate,
        //     LastItemDeletedDate,
        // });
        // this.List.ItemCount = ItemCount;
        // this.List.CurrentChangeToken = CurrentChangeToken;
        // this.List.LastItemModifiedDate = LastItemModifiedDate;
        // this.List.LastItemDeletedDate = LastItemDeletedDate;
        return Object.assign(this.List, {
            ItemCount,
            CurrentChangeToken,
            LastItemModifiedDate,
            LastItemDeletedDate,
        });
    }

    async refreshChangeToken(){
        const token = await this.getChangeToken();
        return this.updateCachedListObject(token);
    }

    async watcher(){

        const { port } = location;

        if (port === '8081') return;

        /** Updated the local store (if one is available) OR refresh the table; */
        const { List, timestamp } = this;
        const {
            CurrentChangeToken,
            ItemCount,
            LastItemModifiedDate,
            LastItemDeletedDate,
        } = await this.getChangeToken();

        const OrignalCurrentChangeToken = List.CurrentChangeToken.StringValue;
        const UpdatedCurrentChangeToken = CurrentChangeToken.StringValue;
            
        /** This checks the last modified date and compares it with the timestamp; */
        // if (moment(LastItemModifiedDate).isAfter(timestamp)) this.getLastModified(timestamp);
        // if (moment(LastItemModifiedDate).isAfter(timestamp)) console.info(`%c${biome} | Items on the ${
        //     List.Title
        // } list were updated!`, 'color: gold;');

        /** This checks the last item deleted and compares it to the timestamp; */
        // This won't work all the time if the user does not have the right permissions;
        /** NOTE: If the user did not the delete the list item, then they might now be able to see the item in the recycle bin with this method; */
        // if (moment(LastItemDeletedDate).isAfter(timestamp)) this.getLastRecycled(timestamp);
        
        // if (moment(LastItemDeletedDate).isAfter(timestamp)) console.info(`%c${biome} | Items on the ${
        //     List.Title
        // } list were deleted!`, 'color: firebrick;');

        // if (ItemCount > List.ItemCount) this.refresh();
        // if (ItemCount > List.ItemCount) console.info(`%c${biome} | Items on the ${
        //     List.Title
        // } list were created!`, 'color: gold;');

        /** This will compare the current change token with the most updated value from the list, then trigger get changes; */
        if (OrignalCurrentChangeToken !== UpdatedCurrentChangeToken) this.getChanges(List.CurrentChangeToken);

        /** Update the new properties on the list; */
        return this.updateCachedListObject({
            ItemCount,
            CurrentChangeToken,
            LastItemModifiedDate,
            LastItemDeletedDate,
        });

    }

}