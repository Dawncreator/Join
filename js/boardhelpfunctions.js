/**
 * Enables the OK button only if title and date are filled.
 */
function checkRequiredfieldsEdit() {
    const inputtitle = document.getElementById('inputtitle');
    const date = document.getElementById('inputdate');

    if (inputtitle.value && date.value !== '') {
        document.getElementById('edittaskdone').disabled = false;
    } else {
        document.getElementById('edittaskdone').disabled = true;
    }

    markMissingRequiredvalue(inputtitle);
    markMissingRequiredvalue(date)
}

/**
 * Switches the state of a subtask and saves it.
 * @param {number} tasksindex - Index of the task.
 * @param {number} subtaskindex - Index of the subtask.
 */
function isChecked(tasksindex, subtaskindex) {
    const subtask = tasks[tasksindex]['subtask'][subtaskindex];

    switch (subtask.state) {
        case true:
            subtask.state = false;
            break;

        case false:
            subtask.state = true;
            break;

        default:
            break;
    }
    saveChangedData()
    initBoard()
}

/**
 * Saves the edited task.
 * @param {number} index - Index of the task.
 */
function submitEditTask(index) {
    const currentTask = tasks[index];
    data["title"] = document.getElementById('inputtitle').value;
    data["duedate"] = document.getElementById('inputdate').value;
    data["category"] = currentTask.category;
    data["progress"] = currentTask.progress;
    data["description"] = document.getElementById('textfieldinput').value;
    data["Assigned To"] = assignedToArray;
    subtaskArray.map((sub) => data["subtask"].push({ "state": checkState(sub, currentTask), "title": sub }));
    tasks.splice(index, 1, data)

    saveChangedData();
    closeTaskOverlay();
    dataObjectReset();
    initBoard();
}

/**
 * Returns the state a subtask already had before editing.
 * @param {string} subtitle - Title of the subtask.
 * @param {Object} task - The task before editing.
 * @returns {boolean} The old state, or false for new subtasks.
 */
function checkState(subtitle, task) {

    if (task.subtask) {
        subtaskfilterd = task.subtask.filter(subtask => subtask.title == subtitle);

        if (subtaskfilterd[0] !== undefined) {
            return subtaskfilterd[0].state;
        } else {
            return false
        }
    } else {
        return false;
    }
}

/**
 * Shows the number of assigned contacts if there are four or more.
 * @param {number} i - Index of the task.
 * @param {Object} users - The task with the assigned contacts.
 */
function renderCurrentAssignedContactsNumber(i,users){
    let countAssignedContacts = document.getElementById('countassigneduseres'+i);
    countAssignedContacts.innerHTML = '';  

    if (users['Assigned To'].length >= 4 ) {
        countAssignedContacts.innerHTML = countAssignedContactsHTML(users); 
    }
}

/**
 * Opens or closes the menu to change the progress of a task.
 * @param {number} index - Index of the task.
 */
function showProgressMenue(index) {
    const cardmenue = document.getElementById('changeprogressmenü'+index);
    const progresslist = document.getElementById('chooseprogress'+index);

    cardmenue.classList.toggle('rotate');
    progresslist.classList.toggle('d-none');

    progresslist.innerHTML = ''
    renderProgressListMenue(index,progresslist)    
}

/**
 * Renders the progress options into the menu.
 * @param {number} index - Index of the task.
 * @param {HTMLElement} path - Container of the menu.
 */
function renderProgressListMenue(index,path) {
    const progressArray = ['to do','in progress','Await feedback','Done']
    const task = tasks[index]['progress']

    path.innerHTML += /*html*/`
        <h4>Change progress to:</h4>
    `
    progressArray.forEach(element => { if (task !== element) {
        const text = element.charAt(0).toUpperCase() + element.slice(1)
        path.innerHTML += /*html*/`
            <div onclick="changeProgressTo('${index}','${element}')">${text}</div>
        `
    }        
    });
}

/**
 * Changes the progress of a task and saves it.
 * @param {string} index - Index of the task.
 * @param {string} progress - New progress.
 */
function changeProgressTo(index, progress) {
    tasks[index]['progress'] = progress;
    
    saveChangedData()    
    initBoard();
    showProgressMenue(index)
}

/**
 * Adds the slide out animation to the overlay container.
 */
function addCloseAnimation() {
    const overlaycontainer = document.getElementById('overlaycontainer');

    overlaycontainer.classList.add('slideoutclass')

    setTimeout(() => {
        overlaycontainer.classList.remove('slideoutclass')
    }, 700);
}