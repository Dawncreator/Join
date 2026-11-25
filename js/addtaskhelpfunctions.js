  /**
   * Saves the tasks in the session storage and Firebase and resets the data object.
   */
  function saveChangedData() {
    saveAsSessionStorage();
    putData("tasks",tasks);
    dataObjectReset()
}
  /**
   * Closes the assigned to drop down menu if it is open.
   */
  function checkAssignedDropDownWindowOpen() {
    const dropdownmenü = document.getElementById('contact-select');
     
    if (dropdownmenü) {
      const classList = Array.from(dropdownmenü.classList).filter(list => list == 'visible') 
      if (classList == 'visible') {
        showContactslistToAssign()
      }
    }
  }

/**
 * Stops a click from reaching the parent element.
 * @param {Event} event - The click event.
 */
function doNotClose(event) {
  event.stopPropagation();
}

/**
 * Sets today as the minimum of the date input.
 */
function returnCurrentDate() {
  const mindate = document.getElementById('inputdate');
  if (mindate) {

    let today = new Date();

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    
    
    mindate.setAttribute("min", `${today}`)
  }
}

  /**
   * Enables or disables the create button and marks missing required fields.
   * @param {HTMLInputElement} inputtitle - Title input field.
   * @param {HTMLInputElement} date - Due date input field.
   * @param {HTMLSelectElement} category - Category select field.
   */
  function ifElseHelpFunctionCheckRequiedFields(inputtitle,date,category) {
    if (inputtitle.value !== '' && date.value !== '' && category.value !== '' && checkDate(date) == true) {
        document.getElementById('createtask').disabled = false;
        removeRedBorderReqed(inputtitle,date,category);
    } else if(inputtitle.value == '' && date.value == '' && category.value == '') {
      document.getElementById('createtask').disabled = true;
      removeRedBorderReqed(inputtitle,date,category);
    } else {
      markMissingRequiredvalue(inputtitle);
      if (!checkDate(date)) {
        date.classList.add('borderred')
      }      
      markMissingRequiredvalue(category);
      document.getElementById('createtask').disabled = true;        
    } 

  }

  /**
   * Checks whether the due date is today or later.
   * @param {HTMLInputElement} date - Due date input field.
   * @returns {boolean} True if the date is valid.
   */
  function checkDate(date) {
    let date1 = new Date(date.value)
    let date2 = new Date(date.min)

    if (date1 >= date2) {
      return true
    } else {
      return false
    }
  }

  /**
   * Removes the red border from the required fields.
   * @param {HTMLInputElement} inputtitle - Title input field.
   * @param {HTMLInputElement} date - Due date input field.
   * @param {HTMLSelectElement} category - Category select field.
   */
  function removeRedBorderReqed(inputtitle,date,category) {
    inputtitle.classList.remove('borderred');
    date.classList.remove('borderred');
    category.classList.remove('borderred');
  }

  /**
   * Marks a field red if it is empty and removes the mark if it is filled.
   * @param {HTMLInputElement|HTMLSelectElement} field - Field to check.
   */
  function markMissingRequiredvalue(field) {
    if (field.value == '') {
      field.classList.add('borderred')
    } else {
      field.classList.remove('borderred') 
    }
  }