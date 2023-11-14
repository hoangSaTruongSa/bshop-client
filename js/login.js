$(function () {
    $("#id01").css('display', 'block');
    setupEnterLoginEvent();
    setDefaultRememberme();
});

function setupEnterLoginEvent() {
    $("#username").on("keyup", function (event) {
        // enter key code = 13
        if (event.keyCode === 13) {
            login();
        }
    });

    $("#password").on("keyup", function (event) {
        // enter key code = 13
        if (event.keyCode === 13) {
            login();
        }
    });
}

function setDefaultRememberme() {
    var isRememberMe = storage.getRememberMe();
    document.getElementById("rememberMe").checked = isRememberMe;
}

function login() {
    // Get username & password
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // validate
    var validUsername = isValidUsername(username);
    var validPassword = isValidPassword(password);

    // format
    if (!validUsername || !validPassword) {
        return;
    }

    // validate username 6 -> 30 characters
    if (username.length < 6 || username.length > 50 || password.length < 6 || password.length > 50) {
        // show error message
        showLoginFailMessage();
        return;
    }

    callLoginAPI(username, password);
}

function callLoginAPI(username, password) {

    $.ajax({
        url: 'http://localhost:8080/api/v1/login',
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        },
        success: function (data, textStatus, xhr) {
            // save remember me
            var isRememberMe = document.getElementById("rememberMe").checked;
            storage.saveRememberMe(isRememberMe);

            // save data to storage
            // https://www.w3schools.com/html/html5_webstorage.asp
            storage.setItem("ID", data.id);
            storage.setItem("FULL_NAME", data.name);
            storage.setItem("USERNAME", username);
            storage.setItem("EMAIL", data.email);
            storage.setItem("PASSWORD", password);
            storage.setItem("ROLE", data.roles);

            // redirect to home page
            window.location.replace("http://127.0.0.1:5500/index.html");
        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                showLoginFailMessage();
            } else {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        }
    });
}

var error_message_username = "Please input!";
var error_message_password = "Please input!";

function isValidUsername(username) {

    if (!username) {
        // show error message
        showFieldErrorMessage("incorrect-mess", "username", error_message_username);
        return false;
    }

    hideFieldErrorMessage("incorrect-mess", "username");
    return true;
}

function isValidPassword(password) {

    if (!password) {
        // show error message
        showFieldErrorMessage("incorrect-mess", "password", error_message_password);
        return false;
    }

    hideFieldErrorMessage("incorrect-mess", "password");
    return true;
}

function showLoginFailMessage() {
    showFieldErrorMessage("incorrect-mess", "username", "Login fail!");
    showFieldErrorMessage("incorrect-mess", "password", "Login fail!");
}

function showFieldErrorMessage(messageId, inputId, message) {
    document.getElementById(messageId).innerHTML = message;
    document.getElementById(messageId).style.display = "block";
    document.getElementById(inputId).style.border = "1px solid red";
}

function hideFieldErrorMessage(messageId, inputId) {
    document.getElementById(messageId).style.display = "none";
    document.getElementById(inputId).style.border = "1px solid #ccc";
}

function showSuccessSnackBar(snackbarMessage) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = snackbarMessage;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}