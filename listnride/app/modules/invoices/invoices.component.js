'use strict';

angular.module('invoices',[]).component('invoices', {
    templateUrl: 'app/modules/invoices/invoices.template.html',
    controllerAs: 'invoices',
    controller: ['$localStorage', 'api', 'accessControl',
        function InvoicesController($localStorage, api, accessControl) {
            debugger
            // if (accessControl.requireLogin()) {
            //     return
            // }
            // var invoices = this;
            //
            // api.get('/users/' + $localStorage.userId ).then(
            //     function(response) {
            //     },
            //     function(error) {
            //         console.log("Error retrieving User", error);
            //     }
            // );
        }
    ]
});
