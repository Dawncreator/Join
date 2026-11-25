let assignedToArray = [];
let subtaskArray = [];

/**
 * Opens or closes the assigned to drop down menu.
 */
function showContactslistToAssign() {
  document.getElementById("contact-select").classList.toggle("visible");
  document.getElementById("anchorinput").classList.toggle("d-none");
  document.getElementById("anchorButton").classList.toggle("d-none");
  document.getElementById("anchoricon").classList.toggle("d-none");
  document.getElementById("anchorinput").value = "";
  filterContacts();
}

/**
 * Renders all contacts into the assigned to list.
 */
function renderAndloadContactsToAssign() {
  const list = document.getElementById("assignlist");
  list.innerHTML = "";

  for (let index = 0; index < contacts.length; index++) {
    const name = contacts[index]["name"];
    let shortname = shortNames(name);
    let color = contacts[index]["color"];

    list.innerHTML += renderHtmlContactLi(name, shortname, color);
  }
  checkboxChecked();
}

/**
 * Returns the first letter of each word of a name.
 * @param {string} name - Name of a contact or user.
 * @returns {string} The initials.
 */
function shortNames(name) {
  return name.match(/\b(\w)/g).join("");
}

/**
 * Adds a contact to the assigned array or removes it again.
 * @param {string} name - Name and checkbox id of the contact.
 */
function assignedToTasK(name) {
  const userchoise = assignedToArray.filter((assignedToArray) => assignedToArray == name);
  const checkstatus = document.getElementById(name).checked;

  if (userchoise.length == 0 && checkstatus === true) {
    assignedToArray.push(name);
    renderAssignedContacts();
  } else if (userchoise == name && checkstatus === false) {
    const assignedToArrayWithoutName = assignedToArray.filter(function (getname) {
      return getname !== name;
    });
    assignedToArray = assignedToArrayWithoutName;
    renderAssignedContacts();
  }
}

/**
 * Renders the icons of all assigned contacts.
 */
function renderAssignedContacts() {
  const assignedConntacts = document.getElementById("showassignedcontacts");
  assignedConntacts.innerHTML = "";

  assignedToArray.forEach((name) => {
    shortname = shortNames(name);
    color = getColorOfContact(name);

    assignedConntacts.innerHTML += renderAssignedContactshtml(shortname, color);
  });
}

/**
 * Filters the contact list by the search input.
 */
function filterContacts() {
  let search = document.getElementById("anchorinput").value.toLowerCase();
  let list = document.getElementById("assignlist");

  if (search.length >= 1) {
    list.innerHTML = "";
    searchfor(list, search);
  } else {
    renderAndloadContactsToAssign();
  }
}

/**
 * Renders the contacts whose name contains the search text.
 * @param {HTMLElement} list - List that shows the results.
 * @param {string} search - Search text in lower case.
 */
function searchfor(list, search) {
  for (let index = 0; index < contacts.length; index++) {
    const name = contacts[index]["name"];
    const shortname = shortNames(name);
    color = getColorOfContact(name);

    if (name.toLowerCase().includes(search)) {
      list.innerHTML += renderHtmlContactLi(name, shortname, color);
    }
  }
  checkboxChecked();
}

/**
 * Checks the checkboxes of all assigned contacts.
 */
function checkboxChecked() {
  assignedToArray.forEach((id) => {
    let nameid = document.getElementById(id);
    if (nameid !== null) {
      nameid.checked = true;
    }
  });
}

/**
 * Returns the color of a contact.
 * @param {string} name - Name of the contact.
 * @returns {string} The color code, or lightcoral if the contact is unknown.
 */
function getColorOfContact(name) {
  const filtercontacs = contacts.filter((contact) => contact.name == name);
  if (filtercontacs.length == 0) {
    return "lightcoral";
  } else {
    return filtercontacs[0]["color"];
  }
}

/**
 * Marks the chosen priority button as active.
 * @param {string} id - Id of the chosen priority button.
 */
function changePrio(id) {
  const urgentprio = document.getElementById("urgent").classList;
  const mediumprio = document.getElementById("medium").classList;
  const lowprio = document.getElementById("low").classList;

  resetPrio(urgentprio, mediumprio, lowprio);
  switchPrio(urgentprio, mediumprio, lowprio, id);
}

/**
 * Removes the active class from all priority buttons.
 * @param {DOMTokenList} urgentprio - Class list of the urgent button.
 * @param {DOMTokenList} mediumprio - Class list of the medium button.
 * @param {DOMTokenList} lowprio - Class list of the low button.
 */
function resetPrio(urgentprio, mediumprio, lowprio) {
  urgentprio.remove("urgentprioaktive");
  mediumprio.remove("mediumprioaktive");
  lowprio.remove("lowprioaktive");
}

/**
 * Activates the chosen priority and stores it in the data object.
 * @param {DOMTokenList} urgentprio - Class list of the urgent button.
 * @param {DOMTokenList} mediumprio - Class list of the medium button.
 * @param {DOMTokenList} lowprio - Class list of the low button.
 * @param {string} id - Id of the chosen priority button.
 */
function switchPrio(urgentprio, mediumprio, lowprio, id) {
  switch (id) {
    case "urgent":
      urgentprio.add("urgentprioaktive");
      data["prio"] = "Urgent";
      break;
    case "medium":
      mediumprio.add("mediumprioaktive");
      data["prio"] = "Medium";
      break;
    case "low":
      lowprio.add("lowprioaktive");
      data["prio"] = "Low";
      break;
    default:
      break;
  }
}

/**
 * Shows the subtask icons only while the subtask input has content.
 */
function changeIconsSubtask() {
  const inputfield = document.getElementById("subtaskinputfield").value;
  const subtasksicons = document.getElementById("subtasksicons").classList;

  if (inputfield !== "") {
    subtasksicons.remove("d-none");
  } else {
    subtasksicons.add("d-none");
  }
}

/**
 * Clears the subtask input field.
 */
function resetSubTasksInput() {
  const inputfield = document.getElementById("subtaskinputfield");

  inputfield.value = "";
  changeIconsSubtask();
}

/**
 * Adds the subtask input to the subtask array and renders the list.
 */
function addSubTaskToList() {
  const newsubtask = document.getElementById("subtaskinputfield");

  if (newsubtask.value !== "") {
    subtaskArray.push(newsubtask.value);
    renderSubTasks();
    newsubtask.value = "";
    changeIconsSubtask();
  }
}

/**
 * Renders all subtasks of the subtask array.
 */
function renderSubTasks() {
  const subtaskfield = document.getElementById("showsubtasks");

  subtaskfield.innerHTML = "";

  for (let index = 0; index < subtaskArray.length; index++) {
    const subtask = subtaskArray[index];
    subtaskfield.innerHTML += subTaskHtml(subtask, index);
  }
}

/**
 * Deletes a subtask from the subtask array.
 * @param {number} index - Position in the subtask array.
 */
function delteSubTask(index) {
  subtaskArray.splice(index, 1);
  renderSubTasks();
}

/**
 * Switches a subtask into edit mode.
 * @param {number} index - Position in the subtask array.
 */
function editSubTask(index) {
  document.getElementById(`dotsub${index}`).classList.toggle("d-none");
  document.getElementById(`subhover${index}`).classList.toggle("d-none");
  document.getElementById(`subtaskediticons${index}`).classList.toggle("d-none");
  document.getElementById(`subtask${index}`).disabled = false;
}

/**
 * Saves an edited subtask, or deletes it if the text is empty.
 * @param {number} index - Position in the subtask array.
 */
function saveEditSubtask(index) {
  const editsubtask = document.getElementById(`subtask${index}`).value;

  if (editsubtask !== "") {
    subtaskArray.splice(index, 1, editsubtask);
    renderSubTasks();
  } else {
    delteSubTask(index);
  }
}

/**
 * Adds or saves a subtask when the enter key is pressed.
 * @param {KeyboardEvent} e - The key event.
 * @param {string} check - Either create or edit.
 * @param {number} index - Position in the subtask array.
 */
function checkPressEnter(e, check, index) {
  if (e.keyCode == 13 && check == "create") {
    addSubTaskToList();
  } else if (e.keyCode == 13 && check == "edit") {
    saveEditSubtask(index);
  }
}

/**
 * Checks whether all required fields are filled.
 */
function checkRequiredfields() {
  const inputtitle = document.getElementById("inputtitle");
  const date = document.getElementById("inputdate");
  const category = document.getElementById("categoryselect");

  ifElseHelpFunctionCheckRequiedFields(inputtitle, date, category);
}

/**
 * Resets the whole add task form.
 */
function clearSide() {
  changePrio("medium");
  dataObjectReset();
  resetEditArray();
  renderAssignedContacts();
  resetInputfieldsToclearSide();
  renderSubTasks();
  checkRequiredfields();
}

/**
 * Empties all input fields of the add task form.
 */
function resetInputfieldsToclearSide() {
  document.getElementById("inputtitle").value = "";
  document.getElementById("inputdate").value = "";
  document.getElementById("categoryselect").value = "";
  document.getElementById("textfieldinput").value = "";
  resetSubTasksInput();
}

/**
 * Collects the form values, adds the new task and saves it to Firebase.
 */
function createNewTask() {
  if (!Array.isArray(tasks)) {
    tasks = [];
  }

  data["title"] = document.getElementById("inputtitle").value;
  data["duedate"] = document.getElementById("inputdate").value;
  data["category"] = document.getElementById("categoryselect").value;
  data["description"] = document.getElementById("textfieldinput").value;
  data["Assigned To"] = assignedToArray;
  subtaskArray.map((sub) => data["subtask"].push({ state: false, title: sub }));
  console.log("data.subtask", data.subtask);
  console.log("subtaskArray", subtaskArray);
  tasks.push(data);

  saveChangedData();
  linkToBoardOrReload();
}

/**
 * Shows the success message and opens the board page.
 */
function linkToBoardOrReload() {
  document.getElementById("createdtaskmessage").classList.remove("d-none");
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 2000);
}

/**
 * Empties the assigned contacts and subtask arrays.
 */
function resetEditArray() {
  assignedToArray = [];
  subtaskArray = [];
}

/**
 * Resets the data object to an empty task.
 * @returns {Object} The new empty data object.
 */
function dataObjectReset() {
  return (data = {
    "Assigned To": [],
    category: "",
    description: "",
    duedate: "",
    prio: "Medium",
    subtask: [],
    title: "",
    progress: "to do",
  });
}
