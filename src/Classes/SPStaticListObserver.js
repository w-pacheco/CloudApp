/**
 * SPStaticListObserver.js
 * @author Wilfredo Pacheco
 */

import { service, web } from "../Biome.js";

export default class SPStaticListObserver {

    constructor(arg){

        const {
            storedLists = [],
        } = arg;

        const component = this;
        const lists = new Proxy({}, {
            set: function(target, key, value){
                // console.log(`${key} set to:`, value);
                target[key] = value;
                return true;
            },
            get: function(obj, prop){
                // console log the key/value pair;
                // console.info(prop, obj[prop]);
                // obj[prop] should be the list object defined on the SharePoint Web Object;
                const list = obj[prop];
                component.watcher(list);
                // console.info('This should refresh all lists!');
                /** @returns Value of property called; */
                return obj[prop];
            }
        });

        this.storedLists = storedLists;
        this.lists = lists;

    }

    async getChanges(List, data, ChangeTokenStart, ChangeTokenEnd){
        
        const { uri } = List.__metadata;
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

        const results = await service.post(`${uri}/getChanges`, { query })
        .then(data => data.d.results);

        /**
         * ChangeType
         * 1 Created
         * 2 Edited
         * 3 Delete
         * 7 Restore
         */

        function getItemById(ItemId){
            return service.get(`${uri}/Items(${ItemId})`)
            .then(data => data.d);
        }

        for (const item of results)
        {
            const { ChangeType, ItemId } = item;

            if (ChangeType === 1
            || ChangeType === 7)
            { /** 1=add 7=restore; */
                // Get the item and add it to the table;
                const newItem = await getItemById(ItemId);
                data.push(newItem);
            }
            
            else if (ChangeType === 2)
            { /** 2=update; */
                const updatedItem = await getItemById(ItemId);
                const index = data.map(item => item.Id).indexOf(ItemId);
                data[index] = updatedItem;
            }

            /** 3=delete; */
            else if (ChangeType === 3)
            {
                // const item = await getItemById(ItemId);
                const index = data.map(item => item.Id).indexOf(ItemId);
                data.splice(index, 1);
            }

        }

    }

    async watcher({list, data}){

        const {
            CurrentChangeToken,
            ItemCount,
            LastItemModifiedDate,
            LastItemDeletedDate,
        } = await Route.Get(list.__metadata.uri, {
            $select: 'ItemCount,CurrentChangeToken,LastItemModifiedDate,LastItemDeletedDate',
        },{
            cache: false,
        }).then(data => data.d);
        // console.info(list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue)
        /** This will compare the current change token with the most updated value from the list, then trigger get changes; */
        if (list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue) this.getChanges(list, data, list.CurrentChangeToken);

        /** Update the new properties on the list; */
        Object.assign(list, {
            ItemCount,
            CurrentChangeToken,
            LastItemModifiedDate,
            LastItemDeletedDate,
        });

        return this;

    }

    getListById(list_id){
        return this.lists[list_id];
    }

    getListDataById(list_id){
        return this.getListById(list_id).data;
    }

    async init(){

        const component = this;
        const storedLists = this.storedLists;

        await Promise.all(storedLists
        .map(l => web.getListDetails(l.List.Title))
        .map(function(list){
            const { ItemCount, __metadata } = list;
            return service.get(`${__metadata.uri}/Items`, {
                $select: '*',
                $top: ItemCount,
            })
            .then(data => data.d.results)
            .then(data => {
                return component.lists[list.Id] = {
                    list,
                    data,
                };
            });
        }));

        return this;

    }

}