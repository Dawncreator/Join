let tasks = [];
let contacts = []

let user = '';
 user = getDataFromStorage();

/**
 * Loads data from the Firebase realtime database.
 * @param {string} path - Path of the data folder to load.
 * @returns {Promise<Object|Array|boolean>} The loaded data, or false if the request failed.
 */
async function getData(path) {
  const BASE_URL = "https://remotestorage-fe678-default-rtdb.europe-west1.firebasedatabase.app/";
  
  try {    
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
   return (responseAsJson)
   } catch(error){
    console.error("Sorry something went wrong.");
    return false
   }
}

/**
 * Loads tasks and contacts from Firebase and saves them in the session storage.
 * @returns {Promise<void>} Resolves when the data is saved.
 */
async function loadTasksandContactsinfos(){
 tasks = await getData("tasks");
 contacts = await getData("contacts");

await saveAsSessionStorage();
}

/**
 * Saves the tasks and contacts arrays in the session storage.
 */
function saveAsSessionStorage(){
  let taskssAsText = JSON.stringify(tasks);
 sessionStorage.setItem('tasks', taskssAsText);

 let contactsAsText = JSON.stringify(contacts);
 sessionStorage.setItem('contacts', contactsAsText); 
}

/**
 * Hides the navigation and user field when nobody is logged in and redirects to the login page.
 */
function checkIfUserlogin() {
  if (user == '' && window.location.pathname == "/Join/legal.html" | window.location.pathname =="/Join/privacy.html") {
    document.getElementById('navlinks').classList.add('d-none');
    document.getElementById('showuser').classList.add('d-none');
  } else if (user == '') {
    document.getElementById('navlinks').classList.add('d-none');
    document.getElementById('showuser').classList.add('d-none');
    window.location.href = "./index.html" 
  } else {
    setHeaderUserName();
  }
}

 /**
  * Reads user, tasks and contacts from the session storage.
  * @returns {string} The logged in user or an empty string.
  */
 function getDataFromStorage() {   
  if (sessionStorage.getItem("user") == undefined) {
    tasks = [];
    contacts = [];
    return user = ''
  } else {
    tasks = JSON.parse(sessionStorage.getItem("tasks"));
    contacts = JSON.parse(sessionStorage.getItem("contacts"));
    return user = sessionStorage.getItem("user");
  }
}

/**
 * Shows the initials of the user in the header icon.
 */
function setHeaderUserName(){
  let userIcon = user.match(/\b(\w)/g);
  document.getElementById('showuser').innerHTML = userIcon.join('');
}


/**
 * Toggles the user menu below the user icon.
 */
function showUserMenue(){
  document.getElementById('usermenue').classList.toggle('d-none');
}

/**
 * Clears the session storage.
 * @returns {Promise<void>} Resolves when the storage is cleared.
 */
async function logOut() {
 await sessionStorage.clear()
}

/**
 * Writes data to the Firebase realtime database.
 * @param {string} path - Path of the data folder to write.
 * @param {Object|Array} data - Data that replaces the content of the path.
 * @returns {Promise<Object>} The response of Firebase.
 */
async function putData(path="", data={}) {  
  const BASE_URL = "https://remotestorage-fe678-default-rtdb.europe-west1.firebasedatabase.app/"; 
  let response = await fetch(BASE_URL + path + ".json",{
     method: "PUT",
     header: {
           "Content-Type": "application/json",
     },
     body: JSON.stringify(data)
  });
  return responsetoJson = await response.json();
}

  /**
   * Saves the contacts in the session storage and uploads them to Firebase.
   */
  function saveChangedDataContacts() {
    saveAsSessionStorage();
    putData("contacts",contacts)
}

/**
 * Creates a random hex color for new contacts.
 * @returns {string} Color code like #1A2B3C.
 */
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

  /**
   * Adds (You) to the name if the contact is the logged in user.
   * @param {string} name - Name of the contact.
   * @returns {string} The name, with (You) if it is the user.
   */
  function checkIfContactisUser(name) {
    if (name == user) {
      return `${name}  (You)`
    } else {
      return name
    }
  }

/**
 * need for create or edit new tasks
 */
let data = {
  "Assigned To": [],
  "category": "",
  "description": "",
  "duedate": "",
  "prio": "Medium",
  "subtask": [],
  "title": "",
  "progress": "to do"      
}