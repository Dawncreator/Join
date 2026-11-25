let lastInitial = '';
let activeContactIndex = null;
let index = 1;
let lastviewcontact = '';

/**
 * Sorts and renders the contacts on page load.
 */
function init() {
    sortContacts();
    renderContactStripes();
}



/**
 * Renders the contact list.
 */
function renderContactStripes() {
    let contactContainer = document.getElementById('contacts-register');
    contactContainer.innerHTML = /*Html*/`<div class="register-button-container subtext">
        <button class="button-filled-large register-add-button" onclick="showOverlay()">Add new contact</button> </div>`;
    lastInitial = '';
    sortContacts();
    for (let i = 0; i < contacts.length; i++) {
        contactContainer.innerHTML += contactRegisterHtml(i, i === activeContactIndex);
    }
}

/**
 * Renders the detail card of a contact.
 * @param {number} index - Index of the contact.
 * @returns {number|undefined} The index of the shown contact.
 */
function renderContactCard(index) {
    let contactCard = document.getElementById('open-contact');
    contactCard.innerHTML = '';
    if (contacts[index]) {
        contactCard.innerHTML = contactCardHtml(contacts[index], index);
        setActiveContact(index);
        applyAnimation(contactCard);
        return lastviewcontact = index;
    } else {
        console.error(`No contact found for index ${index}`);
    }
}

/**
 * Plays the slide in animation of the contact card on wide screens.
 * @param {HTMLElement} contactCard - The contact card element.
 */
function applyAnimation(contactCard) {
    if (window.innerWidth > 825) {
        contactCard.classList.remove('slide-in');
        void contactCard.offsetWidth; // Trigger reflow
        contactCard.classList.add('slide-in');
    }
}

/**
 * Hides an element if the contact is the logged in user.
 * @param {number} index - Index of the contact.
 * @returns {string|undefined} Inline style that hides the element.
 */
function checkIfContactisActualUser(index) {
    const contact = contacts[index].name;
    if (contact == user) {
        return /*html*/`style="display:none"`
    } 
}

/**
 * Keeps the name of the logged in user when a contact is edited.
 * @param {string} inputvalue - Value of the name field.
 * @param {string} index - Index of the contact.
 * @returns {string} The name to save.
 */
function dontRenameUser(inputvalue,index) {
    const contact = contacts[index].name
    if (contact == user) {
        return user
    } else {
        return inputvalue
    }    
}

/**
 * Opens the create contact overlay.
 */
function showOverlay() {
    let overlay = document.getElementById('overlay');
    const overlaycontainer = document.getElementById('overlaycontainer');
    overlaycontainer.classList.remove('d-none');
    overlay.classList.remove('d-none');
    overlay.classList.remove('fade-out');
    overlay.classList.remove('slide-out');
    overlay.classList.remove('hide');
    overlay.innerHTML = overlayHtml();
}

/**
 * Closes the overlay with the slide out effect.
 */
function closeOverlaySlide() {
    let overlay = document.getElementById('overlay');
    const overlaycontainer = document.getElementById('overlaycontainer');
    
    let mobileButton = document.getElementById('mobile-button-container');
    overlay.classList.add('slide-out');
    setTimeout(function () {
        overlaycontainer.classList.add('d-none');
        overlay.classList.add('d-none');
    }, 500);
    mobileButton.classList.remove('hide');
}

/**
 * Fades out the overlay.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {boolean} isMobile - True on small screens.
 */
function fadeOutOverlay(overlay, isMobile) {
    overlay.classList.add('fade-out');
    if (isMobile) {
        overlay.addEventListener('animationend', function handler() {
            overlay.classList.add('d-none');
            overlay.removeEventListener('animationend', handler);
        });
    } else {
        setTimeout(() => {
            overlay.classList.add('d-none');
            overlay.classList.remove('fade-out');
        }, 500);
    }
}

/**
 * Closes the overlay with the fade out effect.
 */
function closeOverlayFade() {
    let overlay = document.getElementById('overlay');
    let mobileButton = document.getElementById('mobile-button-container');
    let isMobile = window.matchMedia("(max-width: 825px)").matches;
    const overlaycontainer = document.getElementById('overlaycontainer');
    overlay.classList.add('fade-out');
    if (isMobile) {
        handleMobileOverlay(overlay);
        goBack()
    } else {
        
        handleDesktopOverlay(overlay);
    }
    mobileButton.classList.remove('hide');
    setTimeout(() => {
        overlaycontainer.classList.add('d-none');
    }, 1000);   
}

/**
 * Hides the overlay after its animation on small screens.
 * @param {HTMLElement} overlay - The overlay element.
 */
function handleMobileOverlay(overlay) {
    overlay.addEventListener('animationend', function handler() {
        overlay.classList.add('d-none');
        overlay.removeEventListener('animationend', handler);
    });
}

/**
 * Hides the overlay after a delay on wide screens.
 * @param {HTMLElement} overlay - The overlay element.
 */
function handleDesktopOverlay(overlay) {
    setTimeout(() => {
        overlay.classList.add('d-none');
        overlay.classList.remove('fade-out');
    }, 500);
}

/**
 * Creates a new contact from the form and saves it.
 */
function createContact() {
    let [nameInput, mailInput, phoneInput] = ['name-input', 'mail-input', 'phone-input'].map(id => document.getElementById(id));
    let [name, mail, phonenumber] = [nameInput.value, mailInput.value, phoneInput.value];
    phonenumber = checkPhoneNumber(phonenumber);

    contacts.push({
        mail, name, phonenumber,
        color: getRandomColor(),
        initials: getInitials(name)
    });
    nameInput.value = mailInput.value = phoneInput.value = '';
    
    saveChangedDataContacts()
    closeOverlayFade();
    showMessage();
    renderContactStripes();
}

/**
 * Opens the overlay to edit a contact.
 * @param {number} index - Index of the contact.
 */
function editContact(index) {
    let contact = contacts[index];
    let overlay = document.getElementById('overlay');
    overlay.innerHTML = overlayHtml(contact, index);
    overlay.classList.remove('d-none', 'hide');
    setTimeout(() => {
        document.getElementById('create-save-button').innerHTML = 'Save';
        document.getElementById('edit-subtext').classList.add('d-none');
        document.getElementById('name-input').value = contact.name;
        document.getElementById('mail-input').value = contact.mail;
        document.getElementById('phone-input').value = contact.phonenumber;
    }, 0);
    checkForm('createandeditform')
}


/**
 * Creates or saves a contact depending on the button text.
 */
function chooseCreateOrSave() {
    let button = document.getElementById('create-save-button');
    let text = button.innerHTML;
    if (text === 'Create Contact') {
        createContact();
    } else if (text === 'Save') {
        saveContact();     
        renderContactCard(lastviewcontact);
        closeMobileEditMenu()
        goBack()
    }
}

/**
 * Saves the edited contact.
 */
function saveContact() {
    let index = document.getElementById('contact-index').value;
    const color = document.getElementById('contact-color').value
    let [nameInput, mailInput, phoneInput] = ['name-input', 'mail-input', 'phone-input'].map(id => document.getElementById(id));
    let [name, mail, phonenumber] = [ dontRenameUser(nameInput.value,index), mailInput.value, phoneInput.value];
    phonenumber = checkPhoneNumber(phonenumber);
    let contactData = { mail, name, phonenumber, color };    
    if (index) {
        contacts[index] = contactData;
        saveChangedDataContacts()
    } else {
        contacts.push(contactData);
        saveChangedDataContacts()
    }
    nameInput.value = mailInput.value = phoneInput.value = '';
    closeOverlayFade();
    renderContactStripes();
}

/**
 * Deletes a contact and removes it from all tasks.
 * @param {number} index - Index of the contact.
 */
function deleteContact(index) {
    ereaseContactFromArrayAssigned(index)
    contacts.splice(index, 1);    
    saveChangedDataContacts()
    setTimeout(()=> {window.location.href = "./contacts.html"} , 500);
}

/**
 * Slides the mobile edit menu out.
 */
function toggleMenu() {
    const menu = document.getElementById('mobile-edit-menu');
    menu.classList.add('slide-out');
}

/**
 * Switches to the contact view on small screens.
 */
function toggleClass() {
    if (window.innerWidth <= 825) {
        let register = document.getElementById('contacts-register');
        let mobileButtonIcon = document.getElementById('relative-icon');
        register.classList.add('d-none');
        mobileButtonIcon.src = './assets/icons/burger-menu.svg';
    }
}

/**
 * Shows the mobile edit menu or the create overlay.
 */
function showMobileEditMenu() {
    let popUp = document.getElementById('mobile-edit-menu');
    let mobileButtonIcon = document.getElementById('relative-icon');
    let mobileButton = document.getElementById('mobile-button-container');
    if (popUp && mobileButtonIcon && mobileButton) {
        let iconSrc = mobileButtonIcon.src.split('/').pop();
        if (iconSrc === 'burger-menu.svg') {
            popUp.classList.remove('slide-out');
            popUp.classList.add('slide-in');
            popUp.classList.remove('d-none');
            popUp.innerHTML = mobileMenuPopUpHtml(lastviewcontact);
        } else {
            showOverlay();
        }
    }
}

/**
 * Closes the mobile edit menu.
 */
function closeMobileEditMenu() {
    let popUp = document.getElementById('mobile-edit-menu');
        popUp.classList.add('slide-out');
        setTimeout(() => {
            popUp.classList.add('d-none');
        }, 100);

}