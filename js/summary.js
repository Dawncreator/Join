/**
 * Fills all values of the summary page.
 */
function init() {
    checkUserHaveContact();
    countAllTask();
    countTaskTypes("to do",'counttodo');
    countTaskTypes("Done",'countdone');
    countTaskTypes("in progress",'counttaskinprogress');
    countTaskTypes("Await feedback",'countfeedback');
    countUrgent()
    greetingUser()
    greetMobile()
}

/**
 * Counts the tasks with the given progress and shows the number.
 * @param {string} type - Progress to count.
 * @param {string} id - Id of the element that shows the number.
 * @returns {string} The shown number.
 */
function countTaskTypes(type,id) {
    const taskstype = tasks.filter(tasks => tasks.progress === type)

    if (taskstype.length === 0) {
        return document.getElementById(id).innerHTML = "0" ;
    } else {
        return document.getElementById(id).innerHTML = `${taskstype.length}`;
    }
}

/**
 * Counts all tasks and shows the number.
 * @returns {string} The shown number.
 */
function countAllTask() {
    if (tasks.length === 0) {
        return document.getElementById('countalltask').innerHTML = "0"; 
    } else {
        return document.getElementById('countalltask').innerHTML = `${tasks.length}`; 
    }     
}

/**
 * Counts the urgent tasks and shows the number and the next deadline.
 * @returns {string} The shown number.
 */
function countUrgent() {    
    const urgentcount = tasks.filter(tasks => tasks.prio === "Urgent");
    const nextdeadline = new Date(Math.min.apply(null, tasks.map(function(e) {
        return new Date(e.duedate);
      })));
    const date =  new Date(nextdeadline).toLocaleDateString('en-us', {month:"long", day:"numeric", year:"numeric"});
       
    if (urgentcount.length === 0) {
        document.getElementById('deadline').innerHTML = '';
       return document.getElementById('counturgent').innerHTML = "0" ;
    } else {
        document.getElementById('deadline').innerHTML = date;
        return document.getElementById('counturgent').innerHTML = `${urgentcount.length}`;
    }
}

/**
 * Shows the greeting for the logged in user or guest.
 */
function greetingUser() {
    const greeting = document.getElementById('greeting');
    const userName = document.getElementById('userlogedin');

    if (user === 'Guest') {
        greeting.innerHTML = getDaytime()+'!'
    } else {
        greeting.innerHTML = getDaytime()+', ';
        userName.innerHTML = `${user}`;
    }
}

/**
 * Returns a greeting that fits the current time of day.
 * @returns {string} The greeting text.
 */
function getDaytime() {
    const time = new Date().getHours();
    
    if (time >= 5 &&  time <= 12) {
        return 'Good morning'
    } else if (time >= 12 && time <= 18){
        return 'Good afternoon'
    } else if (time >= 18 && time <= 22) {
        return 'Good evening'
    } else {
        return 'Hello'
    }
}

/**
 * Shows the greeting screen once on small screens.
 */
function greetMobile() {
    if (window.innerWidth <= 1150 && sessionStorage.getItem("greet") == undefined ) {
        document.getElementById('greeting_user').classList.toggle('mobiled-none');
        sessionStorage.setItem('greet', true);

        setTimeout(()=> {document.getElementById('greeting_user').classList.toggle('mobiled-none');}, 2000);  
    }    
  }

  /**
   * Creates a contact for the logged in user if there is none.
   */
  function checkUserHaveContact() {
    if (user !== '') {
      if(contacts.filter(contact => contact.name == user).length == 0){
        const newContact = {
            'color' : getRandomColor(),
            'name' : user,
            'mail' : '' ,
            'phonenumber' : ''        
        };
        contacts.push(newContact);
        saveChangedDataContacts()
      }
    };
  }