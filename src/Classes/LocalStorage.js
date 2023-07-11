
export default class LocalStorage {

    constructor(arg){

        const {
            name,
            data,
        } = arg;

        this.key = name;
        this.name = name;
        this.lists = data.map(function({ Id }){
            return Id;
        });
        this.data = data;
        this.init();

    }

    get(key){

        if (!key) throw new Error('You are missing an argument!');
        if (typeof key !== 'string') throw new Error('Your argument is invalid!');

        let data = window.localStorage.getItem(key);
        try
        {
            data = JSON.parse(data);
        }
        catch(e) { console.info(e); }
        return data;
    }

    set(key, value){
        if (typeof value === 'object') return window.localStorage.setItem(key, JSON.stringify(value));
        else if (typeof value === 'string') return window.localStorage.setItem(key, value);
        else throw new Error('Your value is not a Object or String!');
    }

    destroy(key){
        return window.localStorage.removeItem(key);
    }

    init(){

        const {
            key,
            data,
        } = this;

        const local_storage = this;
        const store = this.get(key);
        // We need to create one;
        if (!store)
        {
            local_storage.set(key, data);
            console.info('%cThis means we need to call ALL the data to set in the indexedDB!', 'color: gold;');
        }
        
        else {
            console.info('%cStore found!', 'color: dodgerblue;');
            // we need to compare the data passed with the original data;
            for (const list of store)
            {
                const { CurrentChangeToken, Id, Title } = list;
                /** This is the cached change token saved on the user's computer; */
                const cached_CurrentChangeToken = CurrentChangeToken;

                /** This is the new change token value provided by SharePoint; */
                const cached_ListItem = data.find(function(list){
                    if (list.Id === Id) return list;
                });

                const new_CurrentChangeToken = cached_ListItem.CurrentChangeToken;
                if (cached_CurrentChangeToken !== new_CurrentChangeToken)
                {
                    console.info(`%cThis list needs to be updated: ${Title}`, 'color: gold');
                    console.table({
                        cached_CurrentChangeToken,
                        new_CurrentChangeToken,
                    });
                }
            }

        }

    }

}