/**
 * Shows the success message.
 */
function showMessage() {
    let popUp = document.getElementById('successfull-message');
    popUp.classList.remove('d-none');
    setTimeout(hideMessage, 1500);
}

/**
 * Hides the success message.
 */
function hideMessage() {
    let popUp = document.getElementById('successfull-message');
    popUp.classList.remove('slide-in');
    popUp.classList.add('slide-out');
    setTimeout(() => {
        popUp.classList.add('d-none');
        popUp.classList.remove('slide-out');
    }, 500);
}

/**
 * Shows the contact list again and resets the mobile button.
 */
function goBack() {
    let register = document.getElementById('contacts-register');
    let mobileButtonIcon = document.getElementById('relative-icon');
    register.classList.remove('d-none');
    mobileButtonIcon.src = './assets/icons/person_add.svg';
}

/**
 * Sorts the contacts by name.
 */
function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Marks a contact as active and renders the list.
 * @param {number} index - Index of the contact.
 */
function setActiveContact(index) {
    activeContactIndex = index;
    renderContactStripes();
}


/**
 * Clears the contact detail card.
 */
function clearContactCard() {
    let contactCard = document.getElementById('open-contact');
    contactCard.innerHTML = '';
}

/**
 * Returns the initials of a name.
 * @param {string} name - Name of the contact.
 * @returns {string} Up to two capital letters.
 */
function getInitials(name) {
    let nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    } else if (nameParts.length === 1) {
        return nameParts[0][0].toUpperCase();
    }
    return '';
}

/**
 * Creates the HTML of a contact entry including the letter heading.
 * @param {number} i - Index of the contact.
 * @param {boolean} isActive - True if the contact is selected.
 * @returns {string} The HTML.
 */
function contactRegisterHtml(i, isActive = false) {
    const currentInitial = contacts[i].name.charAt(0).toUpperCase();
    const fontStripeHtml = createFontStripeHtml(currentInitial, lastInitial);
    lastInitial = currentInitial;
    const contactStripeHtml = createContactStripeHtml(i, isActive);
    return `${fontStripeHtml}${contactStripeHtml}`;
}

/**
 * Removes a contact from the assigned contacts of all tasks.
 * @param {number} index - Index of the contact.
 */
function ereaseContactFromArrayAssigned(index) {
    const name = contacts[index].name;

    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];

        if (task['Assigned To'].filter(names => names == name) == name ) {
            let newassign = task['Assigned To'].filter(function(getname){return getname !== name} )
            if (newassign) {
                task['Assigned To'] = newassign;
            } else {
                task['Assigned To'] = [];
            }            
        } 
    }   
}

/**
 * Removes a leading 0 or country code from a phone number.
 * @param {string} number - Phone number from the input.
 * @returns {string} The cleaned number.
 */
function checkPhoneNumber(number) {
    
    if (number.charAt(0) == 0 ) {        
         return number.substring(1)
    } else if (number.charAt(0) == 4 ) {
        return number.substring(2)
    } else {
        return number
    }
} 

/**
 * Validates the contact form and enables or disables the submit button.
 * @param {string} id - Id of the form.
 */
function checkForm(id) {
    const submitbutton = document.getElementById('create-save-button');
    const checkidarray = getFormIds()

    if (document.getElementById(id).checkValidity()) {
        checkIfNotValidCreateOrEditContact(checkidarray);
        submitbutton.disabled = false
    } else {
        
        checkIfNotValidCreateOrEditContact(checkidarray);
        checkifCreateIsEmpty(checkidarray);
        submitbutton.disabled = true
    }
}

/**
 * Returns the ids of the contact form inputs.
 * @returns {string[]} Ids of name, mail and phone.
 */
function getFormIds() {
    const name = 'name-input';
    const email = 'mail-input';
    const phonenumber = 'phone-input'

    return [name,email,phonenumber]
}

/**
 * Shows or hides the error labels of the contact form.
 * @param {string[]} array - Ids of the form fields.
 */
function checkIfNotValidCreateOrEditContact(array) {
    array.forEach(element => { if (!document.getElementById(element).checkValidity()) {
        document.getElementById(element+'label').classList.remove('d-none')      
        document.getElementById(element).classList.add('wrong');        
      } else {  
        document.getElementById(element+'label').classList.add('d-none');
        document.getElementById(element).classList.remove('wrong');
      }    
      });
}

/**
 * Removes all error marks when the contact form is empty.
 * @param {string[]} arrayids - Ids of the form fields.
 */
function checkifCreateIsEmpty(arrayids) {
    if (document.getElementById(arrayids[0]).value == '' &&
        document.getElementById(arrayids[1]).value == '' &&
        document.getElementById(arrayids[2]).value == '') { 

        arrayids.forEach(element => {    
        document.getElementById(element+'label').classList.add('d-none');      
        document.getElementById(element).classList.remove('wronglogin');      
        });
    }
}