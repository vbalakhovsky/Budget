const pendingObjectStoreName = 'pending';
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event => {

    const db = request.result;

if(!db.objectStoreNames.contains(pendingObjectStoreName)){
db.createObjectStore(pendingObjectStoreName, {autoIncrement: true});
   }

};

request.onsuccess = event => {
console.log("Success: ${event.type}");

if(navigator.onLine) {checkDatabase();}

};

request.onerror = event => console.error(event);

function checkDatabase(){
const db = request.result;

let transaction = db.transaction([pendingObjectStoreName], "readwrite");

let store = transaction.objectStore(pendingObjectStoreName);

const getAll = store.getAll();

getAll.onsuccess = () => {

if(getAll.result.length >0) {
fetch("api/transaction/bulk" , {
method: "POST",
body: JSON.stringify(getAll.result),
headers: {
Accept: "application/json, text/plain, */*", 
"Content-Type": "application/json"

}


})

.then(response => response.json())
.then(()=>{
transaction = db.transaction([pendingObjectStoreName], "readwrite");

store = transaction.objectStore(pendingObjectStoreName);

store.clear();

            });

        }       

    };

}

function saveRecord (record) {

const db = request.result;

const transaction = db.transaction([pendingObjectStoreName], "readwrite");

//access pending store
const store = transaction.objectStore(pendingObjectStoreName);
//add record
store.add(record);

}

// when returns online change
window.addEventListener("online", checkDatabase);