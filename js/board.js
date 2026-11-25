const typeColors = {
    "technical task": '#1fd7c1',
    "user story": '#0038ff',
};

let currentDraggedElement;

/**
 * Renders all four columns of the board.
 */
function initBoard() {
    updateTaskTable('to do', 'tableToDo');
    updateTaskTable('in progress', 'tableInProgress');
    updateTaskTable('Await feedback', 'tableAwaitFeedback');
    updateTaskTable('Done', 'tableDone');
}

/**
 * Renders the tasks with the given progress into a column.
 * @param {string} status - Progress of the tasks to show.
 * @param {string} tableId - Id of the column element.
 */
function updateTaskTable(status, tableId) {
    const filteredTasks = tasks.filter(t => t.progress === status);  // Filtert die Aufgaben nach dem gegebenen Status.
    const tableElement = document.getElementById(tableId);
    tableElement.innerHTML = '';

    if (filteredTasks.length == 0) {  // Überprüft, ob es Aufgaben im gefilterten Status gibt.
        tableElement.innerHTML = showNoTaskContainerHTML('status');
    } else {
        for (let index = 0; index < filteredTasks.length; index++) {
            let indexOfTask = tasks.indexOf(filteredTasks[index]);  // Findet den Index der Aufgabe im ursprünglichen `tasks`-Array.
            let element = filteredTasks[index];

            tableElement.innerHTML += renderCardHTML(element, indexOfTask);
            renderAssignedContacs(indexOfTask, element, 'assignedusers')
            getTypeLabelBoardColor(indexOfTask, 'labelBoardCard');
            calcTotalSubtask(indexOfTask, element);
        }
    }
}


/**
 * Highlights the column that is currently dragged over.
 * @param {string} id - Id of the column.
 */
function highlight(id) {
    const tableCards = document.querySelectorAll(".tabelle-card");

    for (let i = 0; i < tableCards.length; i++) {
        const tableCard = tableCards[i];
        if (tableCard.id == id) {
            tableCard.classList.add('drag-area-highlight');
        } else {
            tableCard.classList.remove('drag-area-highlight');
        }
    }
}

/**
 * Removes the highlight from all columns.
 */
function removeHighlight() {
    const tableCards = document.querySelectorAll(".tabelle-card");

    for (let i = 0; i < tableCards.length; i++) {
        const tableCard = tableCards[i];

        tableCard.classList.remove('drag-area-highlight');
    }
}

/**
 * Shows only the task cards whose title or description contains the search text.
 */
function filterTask() {
    let search = document.getElementById('searchInput').value.toLowerCase().trim();

    for (let index = 0; index < tasks.length; index++) {
        const description = tasks[index].description;
        const title = tasks[index].title;

        let taskElement = document.getElementById(`cardContainer${index}`);

        if (description.toLowerCase().includes(search) || title.toLowerCase().includes(search)) {
            taskElement.style.display = "block";
        } else {
            taskElement.style.display = "none";
        }
    }
}

/**
 * Renders the icons of the assigned contacts on a task card.
 * @param {number} i - Index of the task.
 * @param {Object} users - The task with the assigned contacts.
 * @param {string} path - Id prefix of the container.
 */
function renderAssignedContacs(i, users, path) {
    const assignedcontacts = document.getElementById(`${path}${i}`)
    if (users['Assigned To']) {
        for (let index = 0; index < users['Assigned To'].length; index++) {
            const name = users['Assigned To'][index];
            const shortname = shortNames(name);
            const color = getColorOfContact(name);

            assignedcontacts.innerHTML += renderAssignedContactsSmallCard(color, shortname);

            renderCurrentAssignedContactsNumber(i, users);
        }
    }
}

/**
 * Returns the icon path of a priority.
 * @param {string} priority - Priority like Low, Medium or Urgent.
 * @returns {string|undefined} Path of the icon.
 */
function choosePrioSymbol(priority) {
    // let chosedSymbol = document.getElementById('priorityImage').src;
    if (priority === 'Low') {
        return './assets/icons/priority-low.svg';
    } else if (priority === 'Medium') {
        return './assets/icons/priority-equal.svg';
    } else if (priority === 'Urgent') {
        return './assets/icons/priority-hight.svg';
    }
}

/**
 * Opens the add task dialog, or the add task page on small screens.
 * @param {string} progress - Progress the new task starts in.
 */
function openAddTaskDialog(progress) {
    let addTaskOverlay = document.getElementById('addTaskOverlay');

    if (window.innerWidth >= 825) {
        addTaskOverlay.innerHTML = renderAddtaskformHTML();
        addTaskOverlay.style.display = 'flex';
        data["progress"] = progress;
        returnCurrentDate()
    } else {
        window.location.href = "./add-task.html"
    }
}

/**
 * Closes the add task dialog.
 */
function closeAddTaskDialog() {
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addCloseAnimation()

    setTimeout(() => {
        addTaskOverlay.style.display = 'none';
        addTaskOverlay.innerHTML = '';
    }, 500);
}

/**
 * Colors the category label of a task by its category.
 * @param {number} indexOfTask - Index of the task.
 * @param {string} labelBoardID - Id prefix of the label element.
 */
function getTypeLabelBoardColor(indexOfTask, labelBoardID) {
    let color = tasks[indexOfTask]['category'];
    let bgcolor = typeColors[color.toLowerCase()] || '#A8A878'; // Standardfarbe, falls Typ nicht gefunden
    document.getElementById(labelBoardID + indexOfTask).style.backgroundColor = bgcolor;
}

/**
 * Opens the detail view of a task.
 * @param {number} indexOfTask - Index of the task.
 */
function showTaskOverlay(indexOfTask) {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';

    overlay.innerHTML = rendertaskOverlayHTML(indexOfTask);
    tableAssignedTo(indexOfTask);
    listSubtasks(indexOfTask);
    getTypeLabelBoardColor(indexOfTask, 'labelOverlay');
}

/**
 * Closes the detail view and resets the edit arrays.
 */
function closeTaskOverlay() {
    let overlay = document.getElementById('overlay');
    addCloseAnimation()
    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
        resetEditArray();
    }, 600);
}

/**
 * Renders the assigned contacts into the detail view.
 * @param {number} indexOfTask - Index of the task.
 */
function tableAssignedTo(indexOfTask) {
    let tableAssigned = document.getElementById('tableAssignedTo');
    tableAssigned.innerHTML = '';

    if (tasks[indexOfTask]['Assigned To'] !== '' && tasks[indexOfTask]['Assigned To']) {
        for (let index = 0; index < tasks[indexOfTask]['Assigned To'].length; index++) {
            const name = tasks[indexOfTask]['Assigned To'][index];
            const shortname = shortNames(name);
            const color = getColorOfContact(name);

            tableAssigned.innerHTML += renderAssignedNamesAndColorsBigCard(name, color, shortname);
        }
    }
}

/**
 * Shows the number of done subtasks on a task card.
 * @param {number} indexOfTask - Index of the task.
 * @param {Object} task - The task.
 */
function calcTotalSubtask(indexOfTask, task) {
    const subtask = task['subtask'];
    const cardSubtask = document.getElementById(`cardSubtasks${indexOfTask}`);
    let amount = 0;

    cardSubtask.innerHTML = '';

    if (subtask && subtask.length !== 0) {
        subtask.forEach(element => {
            if (element.state == true) { amount++ }
        });

        cardSubtask.innerHTML = totalSubtaskHTML(amount, subtask.length);
        calcProgressbarSubtasks(indexOfTask, task);
    } else {
        document.getElementById(`progressContainer${indexOfTask}`).classList.add('d-none')
    }
}

/**
 * Sets the width of the subtask progress bar.
 * @param {number} indexOfTask - Index of the task.
 * @param {Object} task - The task.
 */
function calcProgressbarSubtasks(indexOfTask, task) {
    const fillerProgressbar = document.getElementById(`fillerProgressbar${indexOfTask}`);
    const subtask = task['subtask'];
    const length = subtask.length;
    let amountProgressBar = 0;

    fillerProgressbar.innerHTML = '';

    for (let i = 0; i < subtask.length; i++) {
        const state = subtask[i].state;
        if (state) {
            amountProgressBar++;
        }
        const percentBar = (amountProgressBar / length) * 100;
        fillerProgressbar.style.width = `${percentBar}%`;
    }

}

/**
 * Renders the subtasks of a task into the detail view.
 * @param {number} indexOfTask - Index of the task.
 * @returns {boolean|undefined} False if the task has no subtasks.
 */
function listSubtasks(indexOfTask) {
    const subtask = document.getElementById('formSubtasks');
    subtask.innerHTML = '';

    if (tasks[indexOfTask]['subtask']) {
        for (let i = 0; i < tasks[indexOfTask]['subtask'].length; i++) {
            const element = tasks[indexOfTask]?.['subtask'][i] || '';

            subtask.innerHTML += renderSubTasksBigCars(i, element, indexOfTask)
        }
    } else {
        return false;
    }
}

/**
 * Returns the checked attribute for a done subtask.
 * @param {boolean} check - State of the subtask.
 * @returns {string|undefined} The text checked or nothing.
 */
function checkboxcheck(check) {
    if (check == true) {
        return 'checked'
    }
}

/**
 * Remembers which task is dragged.
 * @param {number} i - Index of the dragged task.
 */
function startDragging(i) {
    currentDraggedElement = i;
}

/**
 * Allows dropping on the target element.
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves the dragged task to a new column and saves it.
 * @param {string} progress - New progress of the task.
 */
function moveTo(progress) {
    tasks[currentDraggedElement]['progress'] = progress;
    saveAsSessionStorage();
    updateTaskTable('to do', 'tableToDo');
    updateTaskTable('in progress', 'tableInProgress');
    updateTaskTable('Await feedback', 'tableAwaitFeedback');
    updateTaskTable('Done', 'tableDone');
    saveChangedData();
}

/**
 * Deletes a task permanently.
 * @param {string|number} tasksindex - Index of the task.
 */
function delteTask(tasksindex) {
    closeTaskOverlay()
    tasks.splice(tasksindex, 1);
    saveChangedData()
    initBoard();
}

/**
 * Opens the edit form of a task.
 * @param {string|number} tasksindex - Index of the task.
 */
function editTask(tasksindex) {
    const overlay = document.getElementById('overlay');
    const currenttask = tasks[tasksindex];

    overlay.innerHTML = renderEditTasksHtml(tasksindex);
    currenttask['Assigned To'].forEach(element => {
        assignedToArray.push(element)
    });
    renderAssignedContacts()
    changePrio(`${currenttask.prio.toLowerCase()}`);

    if (currenttask['subtask']) {
        currenttask['subtask'].forEach(element => {
            subtaskArray.push(element.title)
        });
        renderSubTasks()
    }
    returnCurrentDate()
}