var config = {
    getUrl: '/getdata',
    postUrl: '/senddata'
};

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
        'Electrolysis cycle status': 'Electrolysis cycle status',
        'Trial license expired': 'Trial license expired',
        'Trial license days left': 'Trial license days left',
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
        'Electrolysis cycle status': 'Cycle d’électrolyse',
        'License expired': 'La licence est expirée',
        'Trial license days left': 'Durée d’expiration de la licence'
    },
    'de': {},
    'it': {},
    'es': {},
    'ru': {},
    'ar': {},
    'th': {}
};

var translationKeys = Object.keys(translations.en);
var languageKeys = Object.keys(translations);
var selectedLanguage = 'en';
if (typeof(Storage) != undefined && localStorage != undefined) {
    var storageLang = localStorage.getItem('lang');
    if (storageLang != null && languageKeys.indexOf(storageLang) != -1) {
        selectedLanguage = storageLang;
    }
}

for (var j = 0; languageKeys.length > j; j++) {
    if (languageKeys[j] === 'en') { continue; }
    for (var i = 0; translationKeys.length > i; i++) {
        if (translations[languageKeys[j]][translationKeys[i]] == null) {
            translations[languageKeys[j]][translationKeys[i]] = translations.en[translationKeys[i]];
        }
    }
}

if (userLang != null) {
    userLang = userLang.toLowerCase();
    if (userLang.length > 2) {
        userLan = userLang.substr(2);
        if (languageKeys.indexOf(userLang) != -1) {
            selectedLanguage = userLang;
        }
    }
}

var progress = Vue.component('gauge', {
    template: document.getElementById('gauge').innerHTML,
    props: {
        'value': { type: Number, default: 0 },
        'max': { type: Number, default: 100 },
        'isph': {type: Boolean, default: false },
        'display': {type: String, default: null }
    },
    methods: {
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
        size: function () { return (this.value / this.max) * 100; },
        color: function () {
            if (this.isph) { return ''; }
            var index = Math.floor(this.size() / 25);
            if (index > 3) { index = 3; }
            return this.colors[index];
        }
    },
    data: function () {
        return {
            colors: ['#d9534f', '#fb9606', '#ecef34', '#5cb85c']
        };
    }
});

var app = new Vue({
    el: '#app',
    mounted: function () {
        this._updater(false);
        this._setTitle();
    },
    watch: {
        view: function (val) { this._setTitle(); }
    },
    methods: {
        _setTitle: function () {
            var title = this.lang[this.view];
            if (title == null) { title = this.view; }
            document.title = 'NewTS - ' + title.charAt(0).toUpperCase() + title.slice(1);
        },
        _submit: function (switchClick) {
            var validationKeys = Object.keys(this.validations);
            for (var i = 0; validationKeys.length > i; i++) {
                if (this.validations[validationKeys[i]] !== '') {
                    return;
                }
            }
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

            if (switchClick != false) {
                switchClick = parseInt(switchClick);
                var mask = 1 << switchClick;
                reqBody.Status = reqBody.Status ^ mask;
            }

            var req = this.$http.post(config.postUrl, reqBody, { headers: { 'Content-Type': 'application/json' } });
            req.then(function (res) {
                this._updater(true);
            }.bind(this), function (res) {
                this._updater(true);
            }.bind(this));
        },
        _globalClick: function () { this.langToggled = false; },
        _validateHexKey: function (keyName) {
            var regexVal = /^[abcdef0-9]{8}$/i;
            if (!regexVal.test(this.status[keyName])) {
                this.validations[keyName] = this.lang['Key must be HEX number between 00 00 00 00 and FF FF FF FF'];
            } else {
                this.validations[keyName] = '';
            }
        },
        _validateApplianceName: function () {
            var regexVal = /^[a-z0-9]{1,10}$/i;
            if (!regexVal.test(this.status.ApplianceName)) {
                this.validations.ApplianceName = this.lang['Appliance name must be between 1 and 10 alphanumeric characters'];
            } else {
                this.validations.ApplianceName = '';
            }
        },
        _validateVolume: function () {
            if (this.status.WaterVolume < 0 || this.status.WaterVolume > 1000) {
                this.validations.WaterVolume = this.lang['Water volume must be between 0 and 1000'];
            } else {
                this.validations.WaterVolume = '';
            }
        },
        _updater: function (forceOneUpdate) {
            var req = this.$http.get(config.getUrl);
            req.then(
                function (res) {
                    if (forceOneUpdate || ['settings'].indexOf(this.view) == -1) {
                        this.status = res.body;
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
                    setTimeout(this._updater, this.updaterInterval);
                }.bind(this),
                function (res) { setTimeout(this._updater, this.updaterInterval); }.bind(this)
            );
        },
        _changeLanguage: function (language) {
            this.activeLanguage = language;
            this.lang = translations[this.activeLanguage.toLowerCase()];
            this.langToggled = false;
            if (typeof(Storage) != undefined && localStorage != undefined) {
                localStorage.setItem('lang', language);
            }
            this._setTitle();
        },
        _statusBitOn: function (position) {
            return (this.status.Status & Math.pow(2, position)) > 0;
        }
    },
    data: {
        view: 'home',
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
