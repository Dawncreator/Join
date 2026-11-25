/**
 * Checks the login data and opens the summary page if they match a registered user.
 * @returns {Promise<void>} Resolves when the check is done.
 */
async function checkValidLogIn(){
    let users = await getData("user")
    let check = checkLoginData(users);     
  
    if ( check == !true) {    
      wrongUserOrPassword()
    } else {
      await loadTasksandContactsinfos(); 
      window.location.href = "./summary.html";
    }
  }

/**
 * Switches between the login and the sign up screen.
 */
function switchLoginSignupWindow() {
    document.getElementById('loginscreen').classList.toggle('d-none');
    document.getElementById('signupbutton').classList.toggle('d-none');
    document.getElementById('signup').classList.toggle('d-none');
}

/**
 * Compares the entered mail and password with all registered users.
 * @param {Object[]} users - Users loaded from Firebase.
 * @returns {boolean} True if a user matches.
 */
function checkLoginData(users){
  let check = false;
    users.forEach(element => { 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;        
        
      if (element.code == password && element.mail == email) {
        userAndPasswordMatch(element, email);
        check = true
      }
    });  
    return check  
}

/**
 * Stores the matching user in the session and remembers the mail if wanted.
 * @param {Object} element - The matching user.
 * @param {string} email - The entered mail address.
 */
function userAndPasswordMatch(element, email){  
  user = element.account;
  rememberMe(email);
  sessionStorage.setItem("user", user);   
}

/**
 * Shows the red border and error text for three seconds after a failed login.
 */
function wrongUserOrPassword(){
    document.getElementById('loginform').classList.add('wronglogin');
    document.getElementById('wronglogintext').classList.remove('d-none')

    setTimeout(()=> { 
      document.getElementById('loginform').classList.remove('wronglogin');
      document.getElementById('wronglogintext').classList.add('d-none')
      document.getElementById('password').value = '';
    } , 3000);
}

/**
 * Switches a password field between hidden and visible text.
 * @param {string} id - Id of the password input.
 */
function hideShowPassword(id){
  const password = document.getElementById(id);
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';

  password.setAttribute('type', type);
}

/**
 * Shows the eye icon only while the password field has content.
 * @param {string} id - Id of the password input.
 */
function addEyeIcons(id){
  const passwordfield = document.getElementById(`${id}`);  
  const icon = document.getElementById(`${id+'icon'}`)

  if (passwordfield.value == '') {
    passwordfield.classList.remove('eye');
    icon.classList.remove('pointer');
  } else {    
    passwordfield.classList.add('eye');
    icon.classList.add('pointer');
  }
}

/**
 * Checks whether both sign up passwords are equal and shows a message if not.
 * @returns {boolean} True if the passwords match.
 */
function checkPasswordMatch() {
  const firstPass = document.getElementById('setpassword').value;
  const confirmPass = document.getElementById('confirmpassword').value;

  if (firstPass === confirmPass ) {
    document.getElementById('confirmpassword').classList.remove('wronglogin');
    document.getElementById('passwordnomatch').classList.add('d-none')
    return true    
  } else if ( firstPass !== confirmPass ){    
    document.getElementById('confirmpassword').classList.add('wronglogin');
    document.getElementById('passwordnomatch').classList.remove('d-none')
    return false
  } else {
    return false
  }
}

/**
 * Logs in as guest and opens the summary page.
 * @returns {Promise<void>} Resolves when the data is loaded.
 */
async function guestLogIn() {
  sessionStorage.setItem("user", 'Guest')
  await loadTasksandContactsinfos(); 
  window.location.href = "./summary.html";
}

/**
 * Fills the mail field from the local storage if remember me was chosen.
 */
function remeberMeCheck() {
  const rmCheck = document.getElementById("remember"),
  emailInput = document.getElementById("email");

  if (localStorage.checkbox && localStorage.checkbox !== "") {
    rmCheck.setAttribute("checked", "checked");
    emailInput.value = localStorage.username;
  } else {
    rmCheck.removeAttribute("checked");
    emailInput.value = "";
  }
}

/**
 * Saves or clears the mail address in the local storage depending on the checkbox.
 * @param {string} emailInput - The entered mail address.
 */
function rememberMe(emailInput) {
  const rmCheck = document.getElementById("remember");

  if (rmCheck.checked && emailInput !== "") {
    localStorage.username = emailInput;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.username = "";
    localStorage.checkbox = "";
  }
}

/**
 * Saves the new user in Firebase and shows the success message.
 * @returns {Promise<void>} Resolves when the user is prepared for upload.
 */
async function signUp() {
  let username = document.getElementById('signupname').value;
  let emailadress = document.getElementById('signupmail').value;
  let password = document.getElementById('setpassword').value;
  let index = await getData("user");
  let path = "user/"+index.length;

  let data = {
    "account": username,
    "code": password,
    "mail": emailadress
  };

  putData(path,data);
  signUpSuccses()
}

/**
 * Shows the success message and returns to the login page.
 */
function signUpSuccses() {
  signUpDone = document.getElementById('signupdone').classList.toggle('d-none');

  setTimeout(()=> {signUpDone ; window.location.href = "./index.html"} , 2000);     
}

/**
 * Validates the sign up form and enables or disables the submit button.
 */
function checkSignUp() {
  const submitButton = document.getElementById('submitsignup');
  const checkarray = getSignUpIds();

  if (!document.getElementById('signupform').checkValidity()) {
      checkIfNotValid(checkarray);
      checkPasswordMatch()
      checkIfSignUpEmpty(checkarray)
    submitButton.disabled = true
  } else if (!checkPasswordMatch()) {
    submitButton.disabled = true
    checkPasswordMatch()    
  } else {
  checkIfNotValid(checkarray);
  submitButton.disabled = false
  }
}

/**
 * Shows or hides the error labels and red borders of the sign up fields.
 * @param {string[]} array - Ids of the sign up fields.
 */
function checkIfNotValid(array) {
  array.forEach(element => { if (!document.getElementById(element).checkValidity()) {

    if (document.getElementById(element+'label') !== undefined) {
      document.getElementById(element+'label').classList.remove('d-none')      
    } 
    document.getElementById(element).classList.add('wronglogin');
    
  } else {    
    if (document.getElementById(element+'label') !== undefined) {
      document.getElementById(element+'label').classList.add('d-none');      
    }
    document.getElementById(element).classList.remove('wronglogin');
    
  }    
  });
}

/**
 * Removes all error marks when the sign up fields are empty.
 * @param {string[]} arrayids - Ids of the sign up fields.
 */
function checkIfSignUpEmpty(arrayids) {

  if (document.getElementById(arrayids[0]).value == '' &&
      document.getElementById(arrayids[1]).value == '' &&
      document.getElementById(arrayids[2]).value == '') {
    arrayids.forEach(element => {
      if (document.getElementById(element+'label') !== undefined) {
        document.getElementById(element+'label').classList.add('d-none');      
      }
      document.getElementById(element).classList.remove('wronglogin');      
    });
  }
}

/**
 * Returns the ids of the sign up fields.
 * @returns {string[]} Ids of name, mail, password and checkbox.
 */
function getSignUpIds() {  
  const name = 'signupname';
  const email = 'signupmail';
  const password = 'setpassword';
  const checkbox = 'confirmread'  

  return [name,email,password, checkbox]
} 