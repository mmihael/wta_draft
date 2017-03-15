var userLang = navigator.language || navigator.userLanguage;

var translations = {
   'en-us': {
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
//   ,
//   'hr': {
//        'App name': 'App name',
//        'Back': 'Nazad',
//        'Water properties': 'Svojstva vode',
//        'Electrodes': 'Elektrode',
//        'Settings': 'Postavke',
//        'Water Hardness': 'Tvrdoća vode',
//        'Copper Level': 'Razina bakra',
//        'Turbidity': 'Turbidity',
//        'PH': 'PH',
//        'Water Temperature': 'Temperatura vode',
//        'Water Flow': 'Protok vode',
//        'Water Color': 'Boja vode',
//        'Identification name': 'Identifikacisko ime',
//        'Water Volume': 'Volumen vode',
//        'Station SSID': 'SSID Stanice',
//        'Station password': 'Šifra stanice',
//    }
};

var progress = Vue.component('gauge', {
    template: document.getElementById('gauge').innerHTML,
    props: {
        'value': { type: Number, default: 0 },
        'max': { type: Number, default: 100 },
        'isph': {type: Boolean, default: false }
    },
    methods: {
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
            var req = this.$http.get('/test.json');
            req.then(
                function (res) {
                    if (['settings'].indexOf(this.view.active) == -1) {
                        this.status = res.body;
                        if (this.status.OnTime != null) {
                            var date = new Date();
                            date.setTime(this.status.OnTime * 1000);
                            this.onTimeDisplayString = date.toUTCString();
                            var tillOnTime = date - new Date();
                            if (tillOnTime > 0) {
                                var daysleft = Math.ceil(tillOnTime / 86400000);
                                this.key1daysLeft = daysleft - 30;
                                this.key2daysLeft = daysleft - 60;
                                this.key3daysLeft = daysleft - 90;
                            } else {
                                this.key1daysLeft = 0;
                                this.key2daysLeft = 0;
                                this.key3daysLeft = 0;
                            }
                        }
                        this.sleepMode = this._statusBitOn(18);
                        this.electrolysisCycleStatus = this._statusBitOn(19);
                    }
                    console.log(res);
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
        },
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
            translations['en-us']
        ),
        languages: Object.keys(translations),
        activeLanguage: 'en-us',
        updaterInterval: 1000
    }
});
