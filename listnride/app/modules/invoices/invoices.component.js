'use strict';

angular.module('invoices',[]).component('invoices', {
    templateUrl: 'app/modules/invoices/invoices.template.html',
    controllerAs: 'invoices',
    controller: ['$localStorage', 'api', 'accessControl',
        function InvoicesController($localStorage, api, accessControl) {
            if (accessControl.requireLogin()) {
                return
            }
            var invoices = this;

            // api.get('/users/' + $localStorage.userId + "/reports").then(
            //     function(response) {
            //         invoices.asLister = response.data.as_lister;
            //         invoices.asRider = response.data.as_rider;
            //     },
            //     function(error) {
            //         console.log("Error retrieving User", error);
            //     }
            // );

            invoices.items = [];
            for (var i = 0; i < 100001; i++) {
                invoices.items.push(i);
            }
        }
    ]
});
