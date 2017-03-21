// Config for api endpoints
var config = {
    getUrl: '/getdata',
    postUrl: '/senddata'
};

// Auto detect user language
var userLang = navigator.language || navigator.userLanguage;

var translations = {
    'en': {
        'Back': 'Back',
        'Water properties': 'Water properties',
        'Electrodes': 'Electrodes',
        'Settings': 'Settings',
        'Water Hardness': 'Water Hardness',
        'Container CU Level': 'Container CU Level',
        'Turbidity': 'Turbidity',
        'PH': 'PH',
        'Water Temperature': 'Water Temperature',
        'Water Flow': 'Water Flow',
        'Water Color': 'Water Color',
        'Identification name': 'Identification name',
        'Water Volume': 'Water Volume',
        'Station SSID': 'Station SSID',
        'Station password': 'Station password',
        'Copper Released': 'Copper Released',
        'Container Capacity': 'Container Capacity',
        'Copper Electrode Mass': 'Copper Electrode Mass',
        'Water volume must be between 0 and 1000': 'Water volume must be between 0 and 1000',
        'Appliance name must be between 1 and 10 alphanumeric characters': 'Appliance name must be between 1 and 10 alphanumeric characters',
        'Appliance Name': 'Appliance Name',
        'Key must be HEX number between 00 00 00 00 and FF FF FF FF': 'Key must be HEX number between 00 00 00 00 and FF FF FF FF',
        'Submit': 'Submit',
        'The copper electrode needs to be replaced': 'The copper electrode needs to be replaced',
        'Short circuit detected on the Titanium electrode': 'Short circuit detected on the Titanium electrode',
        'Short circuit detected on the Copper electrode': 'Short circuit detected on the Copper electrode',
        'No water detected': 'No water detected',
        'No PH probe is attached': 'No PH probe is attached',
        'On Time': 'On Time',
        'The PH probe has been calibrated': 'The PH probe has been calibrated',
        'The PH probe is not calibrated': 'The PH probe is not calibrated',
        'Sleep mode': 'Sleep mode',
        'Electrolysis cycle': 'Electrolysis cycle',
        'Trial license expired': 'Trial license expired',
        'Trial license days left': 'Trial license days left',
        'Home': 'Home',
        'High cycle': 'High cycle',
        'Low cycle': 'Low cycle',
    },
    'fr': {
        'Back': 'Retour',
        'Water properties': 'Propriétés de l’eau',
        'Electrodes': 'Electrodes',
        'Settings': 'Paramétres',
        'Water Hardness': 'Duretée',
        'Container CU Level': 'Niveau de test cuivre',
        'Turbidity': 'Turbidité',
        'PH': 'PH',
        'Water Temperature': 'Température',
        'Water Flow': 'Débit',
        'Water Color': 'Couleur',
        'Identification name': 'Identifiant',
        'Water Volume': 'Volume d’eau',
        'Station SSID': 'SSID du Wifi',
        'Station password': 'Mot de passe du Wifi',
        'Copper Released': 'Qté de suivre en suspension',
        'Copper Electrode Mass': 'Masse de l’électrode cuivre',
        'Water volume must be between 0 and 1000': 'Le volume d’eau doit être compris entre 0 et 1000',
        'Appliance name must be between 1 and 10 alphanumeric characters': 'La longueur du nom ne peut dépasser 10 caractères',
        'Appliance Name': 'Nom',
        'Key must be HEX number between 00 00 00 00 and FF FF FF FF': 'LA clé doit être un nombre héxadécimal compris entre 00 00 00 00 et FF FF FF FF',
        'The copper electrode needs to be replaced': 'L’électrode de cuivre doit être remplacée',
        'Short circuit detected on the Titanium electrode': 'Court-circuit détecté sur l’électrode de Titanium', 'Short circuit detected on the Copper electrode': ' Court-circuit détecté sur l’électrode de cuivre',
        'No water detected': 'Eau non détectée',
        'No PH probe is attached': 'Aucune sonde de PH n’est présente',
        'On Time': 'En service depuis',
        'The PH probe has been calibrated': 'La sonde PH a été calibrée',
        'The PH probe is not calibrated': 'La sonde PH n’est pas calibrée',
        'Sleep mode': 'Mode veille',
        'Electrolysis cycle': 'Cycle d’électrolyse',
        'License expired': 'La licence est expirée',
        'Trial license days left': 'Durée d’expiration de la licence',
        'High cycle': 'Cycle rapide',
        'Low cycle': 'Cycle lent',
    },
    'de': {},
    'it': {},
    'es': {},
    'ru': {},
    'ar': {},
    'th': {}
};

// Extract all keys from default lang (used to auto fill untranslated words)
var translationKeys = Object.keys(translations.en);
// Get all language keys keys
var languageKeys = Object.keys(translations);
// Set default language
var selectedLanguage = 'en';

// If detected language is not null check if it exists in translations and select it
if (userLang != null) {
    userLang = userLang.toLowerCase();
    if (userLang.length > 2) {
        userLan = userLang.substr(2);
        if (languageKeys.indexOf(userLang) != -1) {
            selectedLanguage = userLang;
        }
    }
}

// Check local storage for language chosen by user if key is valid apply
// Language priority is (in same order): SAVED > DETECTED > DEFAULT
if (typeof(Storage) != undefined && localStorage != undefined) {
    var storageLang = localStorage.getItem('lang');
    if (storageLang != null && languageKeys.indexOf(storageLang) != -1) {
        selectedLanguage = storageLang;
    }
}

// Fill untranslated keys
for (var j = 0; languageKeys.length > j; j++) {
    if (languageKeys[j] === 'en') { continue; }
    for (var i = 0; translationKeys.length > i; i++) {
        if (translations[languageKeys[j]][translationKeys[i]] == null) {
            translations[languageKeys[j]][translationKeys[i]] = translations.en[translationKeys[i]];
        }
    }
}

// Gauge component
var progress = Vue.component('gauge', {
    // Load component html form dom
    template: document.getElementById('gauge').innerHTML,
    props: {
        'value': { type: Number, default: 0 },
        'max': { type: Number, default: 100 },
        'isph': {type: Boolean, default: false },
        'display': {type: String, default: null }
    },
    methods: {
        // Implement custom display of current value for gauge component
        customDisplay: function () {
            if (this.display === '%') {
                var value = ((this.value / this.max) * 100).toFixed(2).toString();
                while (value.length > 1 && value[value.length - 1] === '0') {
                    value = value.substr(0, value.length - 1);
                }
                if (value.length > 0 && value[value.length - 1] === '.') {
                    value = value.substr(0, value.length - 1);
                }
                return value + '%';
            }
        },
        // Calculate percentage of gauge size indicator
        size: function () { return (this.value / this.max) * 100; },
        // Calculate color for percentages (ignored for ph gauge)
        color: function () {
            if (this.isph) { return ''; }
            var index = Math.floor(this.size() / 25);
            if (index > 3) { index = 3; }
            return this.colors[index];
        }
    },
    data: function () {
        return {
            // Progress bar colors
            colors: ['#d9534f', '#fb9606', '#ecef34', '#5cb85c']
        };
    }
});

// Main component
var app = new Vue({
    el: '#app',
    mounted: function () {
        // On start initialize updater function that refreshes parameters in interval
        this._updater(false);
        this._setTitle();
    },
    watch: {
        // Watch view variable and update title
        view: function (val) { this._setTitle(); }
    },
    methods: {
        // Updates title depending on view variable
        _setTitle: function () {
            var title = this.lang[this.view];
            if (title == null) { title = this.view; }
            document.title = 'NewTS - ' + title.charAt(0).toUpperCase() + title.slice(1);
        },
        // Used to submit editable data on change of value or click on switch component
        // @var switchClick integer - bit to toggle
        _submit: function (switchClick) {
            // Check if all fields are valid before submitting
            var validationKeys = Object.keys(this.validations);
            for (var i = 0; validationKeys.length > i; i++) {
                if (this.validations[validationKeys[i]] !== '') {
                    return;
                }
            }
            // Setup request
            var reqBody = {
                Status: parseInt(this.status.Status),
                ApplianceName: this.status.ApplianceName,
                WaterVolume: parseInt(this.status.WaterVolume),
                Key1: this.status.Key1,
                Key2: this.status.Key2,
                Key3: this.status.Key3,
                StationSSID: this.status.StationSSID,
                StationPwd: this.status.StationPwd
            };
            // If trigger is switch toggle corresponding status bit
            if (switchClick != false) {
                switchClick = parseInt(switchClick);
                var mask = 1 << switchClick;
                reqBody.Status = reqBody.Status ^ mask;
            }
            // Finally send request to server and update data
            var req = this.$http.post(config.postUrl, reqBody, { headers: { 'Content-Type': 'application/json' } });
            req.then(function (res) {
                this._updater(true);
            }.bind(this), function (res) {
                this._updater(true);
            }.bind(this));
        },
        _globalClick: function () { this.langToggled = false; },
        // Key validation
        _validateHexKey: function (keyName) {
            var regexVal = /^[abcdef0-9]{8}$/i;
            if (!regexVal.test(this.status[keyName])) {
                this.validations[keyName] = this.lang['Key must be HEX number between 00 00 00 00 and FF FF FF FF'];
            } else {
                this.validations[keyName] = '';
            }
        },
        // Appliance name validation
        _validateApplianceName: function () {
            var regexVal = /^[a-z0-9]{1,10}$/i;
            if (!regexVal.test(this.status.ApplianceName)) {
                this.validations.ApplianceName = this.lang['Appliance name must be between 1 and 10 alphanumeric characters'];
            } else {
                this.validations.ApplianceName = '';
            }
        },
        // Volume validation
        _validateVolume: function () {
            if (this.status.WaterVolume < 0 || this.status.WaterVolume > 1000) {
                this.validations.WaterVolume = this.lang['Water volume must be between 0 and 1000'];
            } else {
                this.validations.WaterVolume = '';
            }
        },
        // Status updater which sends /getdata request to server in interval
        // @var forceOneUpdate boolean - force update if user is on settings view
        _updater: function (forceOneUpdate) {
            var req = this.$http.get(config.getUrl);
            req.then(
                function (res) {
                    // Disable update if user is on settings view to keep input changes
                    if (forceOneUpdate || ['settings'].indexOf(this.view) == -1) {
                        this.status = res.body;
                        // Prepare data to be displayed on frontend
                        if (this.status.OnTime != null) {
                            var onTimeToTime = function (seconds) {
                                var numdays = Math.floor(seconds / 86400);
                                var numhours = Math.floor((seconds % 86400) / 3600);
                                var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
                                var numseconds = ((seconds % 86400) % 3600) % 60;

                                if (numdays>0) sdays = "days"; else sdays = "day";
                                if (numhours>0) shours = "hours"; else shours = "hour";
                                if (numminutes>0) sminutes = "minutes"; else sminutes = "minute";

                                return {
                                    onTimeDisplayString: numdays + " " + sdays + ", " + numhours + " " + shours + ", " + numminutes + " " + sminutes + ", " + numseconds + " " + "s",
                                    numdays: numdays
                                };
                            };
                            var timeLeft = onTimeToTime(this.status.OnTime);
                            this.onTimeDisplayString = timeLeft.onTimeDisplayString;
                            if (timeLeft.numdays > 0) {
                                this.key1daysLeft = timeLeft.numdays - 30;
                                this.key2daysLeft = timeLeft.numdays - 60;
                                this.key3daysLeft = timeLeft.numdays - 90;
                            } else {
                                this.key1daysLeft = 0;
                                this.key2daysLeft = 0;
                                this.key3daysLeft = 0;
                            }
                        }
                        this.sleepMode = this._statusBitOn(18);
                        this.electrolysisCycleStatus = this._statusBitOn(19);
                    }
                    // Schedule new request
                    setTimeout(this._updater, this.updaterInterval);
                }.bind(this),
                function (res) {
                    // Schedule new request
                    setTimeout(this._updater, this.updaterInterval);
                }.bind(this)
            );
        },
        // Change language method activated when language is switched
        _changeLanguage: function (language) {
            this.activeLanguage = language;
            this.lang = translations[this.activeLanguage.toLowerCase()];
            this.langToggled = false;
            // Try to save selected language to local storage
            if (typeof(Storage) != undefined && localStorage != undefined) {
                localStorage.setItem('lang', language);
            }
            this._setTitle();
        },
        // Used for checking bit state of status variable
        _statusBitOn: function (position) {
            return (this.status.Status & Math.pow(2, position)) > 0;
        }
    },
    data: {
        view: 'Home', // active view
        onTimeDisplayString: '',
        sleepMode: null,
        electrolysisCycleStatus: null,
        key1daysLeft: null,
        key2daysLeft: null,
        key3daysLeft: null,
        status: {},
        validations: {
            WaterVolume: '',
            ApplianceName: '',
            Key1: '',
            Key2: '',
            Key3: ''
        },
        langToggled: false,
        lang: translations[selectedLanguage],
        languages: languageKeys,
        activeLanguage: selectedLanguage,
        updaterInterval: 5000
    }
});
