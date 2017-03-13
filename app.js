var userLang = navigator.language || navigator.userLanguage;

var translations = {
   'en-us': {
        'App name': 'App name',
        'Back': 'Back',
        'Water properties': 'Water properties',
        'Electrodes': 'Electrodes',
        'Settings': 'Settings',
        'Water Hardness': 'Water Hardness',
        'Copper Level': 'Copper Level',
        'Turbidity': 'Turbidity',
        'PH': 'PH',
        'Water Temperature': 'Water Temperature',
        'Water Flow': 'Water Flow',
        'Water Color': 'Water Color',
        'Identification name': 'Identification name',
        'Water Volume': 'Water Volume',
        'Station SSID': 'Station SSID',
        'Station password': 'Station password',
   },
   'hr': {
        'App name': 'App name',
        'Back': 'Nazad',
        'Water properties': 'Svojstva vode',
        'Electrodes': 'Elektrode',
        'Settings': 'Postavke',
        'Water Hardness': 'Tvrdoća vode',
        'Copper Level': 'Razina bakra',
        'Turbidity': 'Turbidity',
        'PH': 'PH',
        'Water Temperature': 'Temperatura vode',
        'Water Flow': 'Protok vode',
        'Water Color': 'Boja vode',
        'Identification name': 'Identifikacisko ime',
        'Water Volume': 'Volumen vode',
        'Station SSID': 'SSID Stanice',
        'Station password': 'Šifra stanice',
    }
};

var app = new Vue({
    el: '#app',

    mounted: function () {
        var req = this.$http.get('/mock.json');
        req.then(
            function (res) {
                this.status = res.body;
                console.log(res);
            }.bind(this),
            function (res) { console.log(res); }
        );
    },

    methods: {
        _changeLanguage: function () {
            this.lang = translations[this.activeLanguage.toLowerCase()];
        },
        _statusBitOn: function (position) {
        console.log("Position: ");
        console.log(this.status.Status);
        console.log(position);
        console.log(this.status.Status & Math.pow(2, position));
        console.log((this.status.Status & Math.pow(2, position)) > 0);
            return (this.status.Status & Math.pow(2, position)) > 0;
        },
    },

    data: {
        view: {
            active: 'home' //home
        },
        status: {},
        lang: (
            userLang != null && Object.keys(translations).indexOf(userLang) != -1 ?
            translations[userLang.toLowerCase()] :
            translations['en-us']
        ),
        languages: Object.keys(translations),
        activeLanguage: null,
    },

    computed: {
        statusBit0: function () { return this._statusBitOn(0); }
    }
});