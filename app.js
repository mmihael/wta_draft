var userLang = navigator.language || navigator.userLanguage;
// French, German, English (default), Italian, Spanish, Thailandese, Russian, Arab
var translations = {
    'fr': {},
    'de': {},
    'it': {},
    'es': {},
    'ru': {},
    'ar': {},
    'th': {},
    'en': {
        'App name': 'App name',
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
    }
};

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
        this._updater();
    },

    methods: {
        _submit: function () { alert("TO-DO"); },
        _validateHexKey: function (keyName) {
            var regexVal = /^[abcdef0-9]{8}$/i;
            console.log(this.status[keyName]);
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
            console.log(this.validations.waterVolume);
        },
        _updater: function () {
            var req = this.$http.get('/mock.json');
            req.then(
                function (res) {
                    if (['settings'].indexOf(this.view.active) == -1) {
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
                function (res) { setTimeout(this._updater, this.updaterInterval); console.log(res); }.bind(this)
            );
        },
        _changeLanguage: function () {
            this.lang = translations[this.activeLanguage.toLowerCase()];
        },
        _statusBitOn: function (position) {
            return (this.status.Status & Math.pow(2, position)) > 0;
        }
    },

    data: {
        view: {
            active: 'home'
        },
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
        lang: (
            userLang != null && Object.keys(translations).indexOf(userLang) != -1 ?
            translations[userLang.toLowerCase()] :
            translations['en']
        ),
        languages: Object.keys(translations),
        activeLanguage: 'en',
        updaterInterval: 5000
    }
});
