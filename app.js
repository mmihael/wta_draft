var userLang = navigator.language || navigator.userLanguage;

var translations = {
   'en-us': {
       'App name': 'App name',
       'Water properties': 'Water properties',
       'Electrodes': 'Electrodes',
       'Settings': 'Settings',
       'Water Hardness': 'Water Hardness',
       'Copper Level': 'Copper Level',
       'Turbidity': 'Turbidity',
       'PH': 'PH',
   },
   'en': {
        'App name': 'Appname',
        'Water properties': 'Waterproperties',
        'Electrodes': 'Electrodes',
        'Settings': 'Settings'
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
        }
    },

    data: {
        view: {
            active: 'waterProperties' //home
        },
        status: {},
        lang: (userLang != null ? translations[userLang.toLowerCase()] : translations['en-us']),
        languages: Object.keys(translations),
        activeLanguage: null,
    }
});