/**
 * LocalDataBase.js
 * @author Wilfredo Pacheco
 */

/**
 * @reference https://stackoverflow.com/questions/5692820/maximum-item-size-in-indexeddb
 * depending on the available disk space, the "group" limit (for the given domain, including all of its subdomains) 
 * can range from 10 MB to 2 GB.
 */
// const READWRITE = 'readwrite';

export default class LocalDataBase {

    constructor(arg){

        const {
            name,
        } = arg;

        if (!name || typeof name !== 'string') throw new Error('The argument is not valid!');

        this.DBname = name;
        this.name = name;
        this.version = null;
        this.database = null;

    }

    /** These are used to set the version and database references; */
    setVersion(version){
        console.info(`%cDB | ${this.name} | ${version}`, 'color: dodgerblue;');
        this.version = version;
    }

    setDatabase(database){
        this.database = database;
    }

    searchStore(name){
        return this.database.objectStoreNames.contains(name);
    }

    closedEvent(){
        console.log('%cDB connection closed', 'color: forestgreen;');
    }

    updateObjectStore(name, keyPath, columns = []){

        let transaction;
        let objectStore;
        try
        {   /** Handle the fact that the database might be closing; */
            transaction = this.database.transaction([name], 'readwrite');
            // transaction.onsuccess = (event) => console.info(event);
            // transaction.onerror = (event) => console.info(event);
        }
        
        catch (error)
        {
            this.database.addEventListener('close', function(){
                updateObjectStore(name, keyPath, columns);
            });
            return;
        }
        objectStore = transaction.objectStore(name);

        // Create the columns dynamically;
        for (const arg of columns)
        {
            /** Handle if the array of columns are strings; */
            if (typeof arg === 'string') objectStore.createIndex(arg, arg, {
                unique: false,
            });

            /** Handle if the array of columns are objects; */
            else if (typeof arg === 'object')
            {
                const {
                    name,
                    unique = false,
                } = arg;

                objectStore.createIndex(name, name, {
                    unique,
                });
            }
        }

    }

    /** Creates a store on the local database; */
    createObjectStore(name, keyPath, columns = []){

        const localDB = this;
        const found = this.searchStore(name);
        
        if (found) return this.updateObjectStore(name, keyPath, columns);

        const version = localDB.version + 1;
        const DBOpenRequest = window.indexedDB.open(localDB.name, version);
        DBOpenRequest.onupgradeneeded = function(event){

            const database = event.target.result;
            const objectStore = database.createObjectStore(name, {
                keyPath,
            });

            // Create the columns dynamically;
            for (const arg of columns)
            {
                /** Handle if the array of columns are strings; */
                if (typeof arg === 'string') objectStore.createIndex(arg, arg, {
                    unique: false,
                });

                /** Handle if the array of columns are objects; */
                else if (typeof arg === 'object')
                {
                    const {
                        name,
                        unique = false,
                    } = arg;

                    objectStore.createIndex(name, name, {
                        unique,
                    });
                }

            }

            localDB.setVersion(version);
            localDB.setDatabase(database);
        }

        DBOpenRequest.onsuccess = function(event){

            const database = event.target.result;
            database.addEventListener('close', localDB.closedEvent);
            database.close();
            // if (found) localDB.updateObjectStore(name, keyPath, columns);
        }

        DBOpenRequest.onerror = function(event){ 
            console.info(event);
            const db = event.target.result;
            if (db){
                db.addEventListener('close', localDB.closedEvent);
                db.close();
            }
        }

    }

    /** Deletes the store on the local database; */
    deleteObjectStore(name){

        const localDB = this;
        const version = localDB.version + 1;
        const DBOpenRequest = window.indexedDB.open(localDB.name, version);

        DBOpenRequest.onupgradeneeded = function(event){
            const database = event.target.result;
            database.deleteObjectStore(name);
            localDB.setVersion(version);
            localDB.setDatabase(database);
        }

        DBOpenRequest.onsuccess = function(event){
            const db = event.target.result;
            db.addEventListener('close', localDB.closedEvent);
            db.close();
        }

        DBOpenRequest.onerror = function(event){ 
            console.info(event);
            const db = event.target.result;
            if (db)
            {
                db.addEventListener('close', localDB.closedEvent);
                db.close();
            }
        }

    }

    /** For adding new records to the ObjectStore; */
    addStoreData(name, data){

        // const READWRITE = 'readwrite';
        if (!Array.isArray(data)) throw new Error('The data passed is not in the form of an Array!');

        const localDB = this;
        const version = localDB.version + 1;
        const DBOpenRequest = window.indexedDB.open(localDB.name, version);

        DBOpenRequest.onupgradeneeded = function(event){
            const database = event.target.result;
            localDB.setVersion(version);
            localDB.setDatabase(database);
        }

        DBOpenRequest.onsuccess = function(event){
            
            const db = event.target.result;
            db.addEventListener('close', localDB.closedEvent);
            try {
                const transaction = db.transaction([name], 'readwrite');    
                // create an object store on the transaction
                const objectStore = transaction.objectStore(name);
                for (const item of data) objectStore.add(item);
            }
            
            catch(e) {
                console.info(e);
                db.close();
            }
            
            db.close();
        }

        DBOpenRequest.onerror = function(event){ 
            console.info(event);
            const db = event.target.result;
            if (db)
            {
                db.addEventListener('close', localDB.closedEvent);
                db.close();
            }
        }

    }

    /** For updating existing records in an ObjectStore; */
    putStoreData(name, data){

        // const READWRITE = 'readwrite';
        if (!Array.isArray(data)) throw new Error('The data passed is not in the form of an Array!');

        const localDB = this;
        const version = localDB.version + 1;
        const DBOpenRequest = window.indexedDB.open(localDB.name, version);

        DBOpenRequest.onupgradeneeded = function(event){
            const database = event.target.result;
            localDB.setVersion(version);
            localDB.setDatabase(database);
        }

        DBOpenRequest.onsuccess = function(event){
            
            const db = event.target.result;
            db.addEventListener('close', localDB.closedEvent);
            try {
                const transaction = db.transaction([name], 'readwrite');    
                // create an object store on the transaction
                const objectStore = transaction.objectStore(name);
                for (const item of data) objectStore.put(item);
            }
            
            catch(e) {
                console.info(e);
                db.close();
            }
            
            db.close();
        }

        DBOpenRequest.onerror = function(event){ 
            console.info(event);
            const db = event.target.result;
            if (db)
            {
                db.addEventListener('close', localDB.closedEvent);
                db.close();
            }
        }

    }

    /** Call for all the data from the ObjectStore; */
    getAllStoreData(name){
        const localDB = this;
        return new Promise(function(resolve, reject){

            const version = localDB.version;
            const DBOpenRequest = window.indexedDB.open(localDB.name, version);
    
            DBOpenRequest.onsuccess = function(event){
                
                const db = event.target.result;
                db.addEventListener('close', localDB.closedEvent);
                try {
                    const transaction = db.transaction([name], 'readwrite');
                    const objectStore = transaction.objectStore(name);
                    const objectStoreRequest = objectStore.getAll();
                    objectStoreRequest.onsuccess = event => resolve(event.target.result);
                    objectStoreRequest.onerror = event => reject(event);
                }
                
                catch(e) {
                    console.info(e);
                    db.close();
                }
                
                db.close();
            }
    
            DBOpenRequest.onerror = function(event){ 
                const db = event.target.result;
                if (db)
                {
                    db.addEventListener('close', localDB.closedEvent);
                    db.close();
                }
                reject(event);
            }
        });
    }

    /** Call for an item in the requested ObjectStore; */
    getStoreItemByKey(name, key){
        const localDB = this;
        return new Promise(function(resolve, reject){

            const version = localDB.version;
            const DBOpenRequest = window.indexedDB.open(localDB.name, version);
    
            DBOpenRequest.onsuccess = function(event){
                
                const db = event.target.result;
                db.addEventListener('close', localDB.closedEvent);
                try {
                    const transaction = db.transaction([name], 'readwrite');
                    const objectStore = transaction.objectStore(name);
                    const objectStoreRequest = objectStore.get(key);
                    objectStoreRequest.onsuccess = event => resolve(event.target.result);
                    objectStoreRequest.onerror = event => reject(event);
                }
                
                catch(e) {
                    console.info(e);
                    db.close();
                }
                
                db.close();
            }
    
            DBOpenRequest.onerror = function(event){ 
                const db = event.target.result;
                if (db)
                {
                    db.addEventListener('close', localDB.closedEvent);
                    db.close();
                }
                reject(event);
            }
        });
    }

    getAllKeys(name){
        const localDB = this;
        return new Promise(function(resolve, reject){

            const version = localDB.version;
            const DBOpenRequest = window.indexedDB.open(localDB.name, version);
    
            DBOpenRequest.onsuccess = function(event){
                
                const db = event.target.result;
                db.addEventListener('close', localDB.closedEvent);
                try {
                    const transaction = db.transaction([name], 'readwrite');
                    const objectStore = transaction.objectStore(name);
                    const objectStoreRequest = objectStore.getAllKeys();
                    objectStoreRequest.onsuccess = event => resolve(event.target.result);
                    objectStoreRequest.onerror = event => reject(event);
                }
                
                catch(e) {
                    console.info(e);
                    db.close();
                }
                
                db.close();
            }
    
            DBOpenRequest.onerror = function(event){ 
                const db = event.target.result;
                if (db)
                {
                    db.addEventListener('close', localDB.closedEvent);
                    db.close();
                }
                reject(event);
            }
        });
    }

    /** FIXME: This one doesn't work; */
    getKey(name, key, query){
        const localDB = this;
        return new Promise(function(resolve, reject){

            const version = localDB.version;
            const DBOpenRequest = window.indexedDB.open(localDB.name, version);
    
            DBOpenRequest.onsuccess = function(event){
                
                const db = event.target.result;
                db.addEventListener('close', localDB.closedEvent);
                try {
                    const transaction = db.transaction([name], 'readonly');
                    const objectStore = transaction.objectStore(name);

                    const index = objectStore.index(key);
                    const objectStoreRequest = index.getKey(query);
                    objectStoreRequest.onsuccess = event => resolve(objectStoreRequest.result);
                    objectStoreRequest.onerror = event => reject(event);
                }
                
                catch(e) {
                    console.info(e);
                    db.close();
                }
                
                db.close();
            }
    
            DBOpenRequest.onerror = function(event){ 
                const db = event.target.result;
                if (db)
                {
                    db.addEventListener('close', localDB.closedEvent);
                    db.close();
                }
                reject(event);
            }
        });
    }

    async init(){
        
        const localDB = this;
        const name = this.name;

        return new Promise(function(resolve, reject){
            const DBOpenRequest = window.indexedDB.open(name);
            
            DBOpenRequest.onupgradeneeded = function(event){
                // console.info(event);
                // const db = event.target.result;
                // console.info(db);
                console.info(event.constructor.name);
                /** FIXME: This should probably set the initial lists..... */
            };
                
            DBOpenRequest.onsuccess = function(event){
                const db = event.target.result;
                db.addEventListener('close', localDB.closedEvent);
                localDB.setVersion(db.version);
                localDB.setDatabase(db);
                db.close();
                resolve(localDB);
            }
            
            DBOpenRequest.onerror = function(event){
                console.info(event);
                const db = event.target.result;
                if (db)
                {
                    db.addEventListener('close', localDB.closedEvent);
                    db.close();
                }
                reject(localDB);
            }

        });

    }

}

/*
db.createObjectStore('users', 'email', [
    'age',
    'first',
    'last',
    'username'
]);
*/

function createRandomUserDB(app){
    app.localDB.createObjectStore('RandomUsers', 'email', [
        'age',
        'first',
        'last',
        'username',
    ]);
}
function getUsersFromRandomUser(app){
    return $.ajax({
        url: 'https://randomuser.me/api/?results=5000&nat=us',
        dataType: 'json',
    })
    .then(data => data.results)
    .then(results => {
        return results.map(user => {
            const { date, age } = user.dob;
            const { street, city, state, country, postcode } = user.location;
            const { uuid, username, password, salt, md5 } = user.login;
            const { title, first, last } = user.name;
            const { large, medium, thumbnail } = user.picture;
            return Object.assign(user, {
                date,
                age,
                street,
                city,
                state,
                country,
                postcode,
                uuid,
                username,
                password,
                salt,
                md5,
                title,
                first,
                last,
                large,
                medium,
                thumbnail,
            });
        });
    })
    .then(function(users){
        if (app) app.localDB.putStoreData('RandomUsers', users);
    });

    // db.putStoreData('users', users);
}
window.createRandomUserDB = createRandomUserDB;
window.getUsersFromRandomUser = getUsersFromRandomUser;
console.info({
    createRandomUserDB,
    getUsersFromRandomUser,
})