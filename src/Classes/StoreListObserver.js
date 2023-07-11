/**
 * StoreListObserver.js
 * @author Wilfredo Pacheco
 */

class StoreListObserver {

    constructor(arg){
        
        const {
            Route,
            storedLists,
        } = arg;

        this.Route = Route;
        this.storedLists = storedLists;
        this.init();
    }

    async getChanges(List, data, ChangeTokenStart, ChangeTokenEnd){

        const Route = this.Route;

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

        const results = await Route.Post(`${uri}/getChanges`, {
            query,
        })
        .then(data => data.d.results);

        /**
         * ChangeType
         * 1 Created
         * 2 Edited
         * 3 Delete
         * 7 Restore
         */

        // function removeFromTable(ItemId, newItem){
        //     /** NOTE: This does require the table to call for the Id of the list item to function; */
        //     const index = data.map(item => item.Id).indexOf(ItemId);
        //     data[index] = newItem
        // }

        function getItemById(ItemId){
            return Route.Get(`${uri}/Items(${ItemId})`)
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

            // else console.info(`%c{biome} | Items on the ${
            //     List.Title
            // } list were changed with an unknown ChangeType: ${ChangeType}`, 'color: gold;');

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
        }).then(data => data.d);
        // console.info(list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue)
        /** This will compare the current change token with the most updated value from the list, then trigger get changes; */
        if (list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue) getChanges(list, data, list.CurrentChangeToken);

        /** Update the new properties on the list; */
        Object.assign(list, {
            ItemCount,
            CurrentChangeToken,
            LastItemModifiedDate,
            LastItemDeletedDate,
        });

        return this;

    }

    async init(){
        const lists = await Promise.all(storedLists
        .map(l => Web.getListDetails(l.List.Title))
        .map(function(list){
            const { ItemCount, __metadata } = list;
            return Route.Get(`${__metadata.uri}/Items`, {
                $select: '*',
                $top: ItemCount,
            })
            .then(data => data.d.results)
            .then(data => {
                return store.lists[list.Id] = {
                    list,
                    data,
                };
            });
        }));
    }

}

class SPListObserver {
    
    constructor(arg){

        if (!arg) throw new Error('Missing/Invalid argument!');

        const {
            list,
            Route,
            Web,
        } = arg;

        console.info(typeof arg);
        console.info(typeof list);
        
        this.list = list;
        this.Route = Route;
        this.Web = Web;

    }

    async getChanges(List, data, ChangeTokenStart, ChangeTokenEnd){

        const Route = this.Route;

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

        const results = await Route.Post(`${uri}/getChanges`, {
            query,
        })
        .then(data => data.d.results);

        /**
         * ChangeType
         * 1 Created
         * 2 Edited
         * 3 Delete
         * 7 Restore
         */

        // function removeFromTable(ItemId, newItem){
        //     /** NOTE: This does require the table to call for the Id of the list item to function; */
        //     const index = data.map(item => item.Id).indexOf(ItemId);
        //     data[index] = newItem
        // }

        function getItemById(ItemId){
            return Route.Get(`${uri}/Items(${ItemId})`)
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

            // else console.info(`%c{biome} | Items on the ${
            //     List.Title
            // } list were changed with an unknown ChangeType: ${ChangeType}`, 'color: gold;');

        }

    }

}

async function setStaticListObserver(Route, storedLists){

    async function getChanges(List, data, ChangeTokenStart, ChangeTokenEnd){
        
        const { uri } = List.__metadata;
        const ReqDigest = await Route.GetRequestDigest();
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

        const results = await Route.Post(`${uri}/getChanges`, {
            query,
        }, ReqDigest)
        .then(data => data.d.results);

        /**
         * ChangeType
         * 1 Created
         * 2 Edited
         * 3 Delete
         * 7 Restore
         */

        // function removeFromTable(ItemId, newItem){
        //     /** NOTE: This does require the table to call for the Id of the list item to function; */
        //     const index = data.map(item => item.Id).indexOf(ItemId);
        //     data[index] = newItem
        // }

        function getItemById(ItemId){
            return Route.Get(`${uri}/Items(${ItemId})`)
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

            // else console.info(`%c{biome} | Items on the ${
            //     List.Title
            // } list were changed with an unknown ChangeType: ${ChangeType}`, 'color: gold;');

        }

    }

    async function watcher({list, data}){

        const {
            CurrentChangeToken,
            ItemCount,
            LastItemModifiedDate,
            LastItemDeletedDate,
        } = await Route.Get(list.__metadata.uri, {
            $select: 'ItemCount,CurrentChangeToken,LastItemModifiedDate,LastItemDeletedDate',
        }).then(data => data.d);
        // console.info(list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue)
        /** This will compare the current change token with the most updated value from the list, then trigger get changes; */
        if (list.CurrentChangeToken.StringValue !== CurrentChangeToken.StringValue) getChanges(list, data, list.CurrentChangeToken);

        /** Update the new properties on the list; */
        Object.assign(list, {
            ItemCount,
            CurrentChangeToken,
            LastItemModifiedDate,
            LastItemDeletedDate,
        });

        return this;

    }

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
            watcher(list);
            /** @returns Value of property called; */
            return obj[prop];
        }
    });

    // store.set('lists', lists, FORCE);

    // if (!Settings.localhost) 
    await Promise.all(storedLists
    .map(l => Web.getListDetails(l.List.Title))
    .map(function(list){
        const { ItemCount, __metadata } = list;
        return Route.Get(`${__metadata.uri}/Items`, {
            $select: '*',
            $top: ItemCount,
        })
        .then(data => data.d.results)
        .then(data => {
            return store.lists[list.Id] = {
                list,
                data,
            };
        });
    }));

}