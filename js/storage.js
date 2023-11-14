var storage = {

    saveRememberMe(isRememberMe) {
        localStorage.setItem("IS_REMEMBER_ME", isRememberMe);
    },

    getRememberMe() {
        var rememberMeStr = localStorage.getItem("IS_REMEMBER_ME");
        if (rememberMeStr == null) {
            return true;
        }

        // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
        return JSON.parse(rememberMeStr.toLowerCase());
    },

    setItem(key, value) {
        if (this.getRememberMe()) {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    },

    getItem(key) {
        if (this.getRememberMe()) {
            return localStorage.getItem(key);
        } else {
            return sessionStorage.getItem(key);
        }
    },

    removeItem(key) {
        if (this.getRememberMe()) {
            return localStorage.removeItem(key);
        } else {
            return sessionStorage.removeItem(key);
        }
    }
};