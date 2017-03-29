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

            invoices.aza = [{
                id: "123",
                bike: "Example Pro bike",
                rental_period: "12.12.2017 - 17.12.2017",
                payout: "13.99 E",
                status: "Upcoming"
            }, {
                id: "124",
                bike: "Example Pro bike",
                rental_period: "12.12.2017 - 17.12.2017",
                payout: "13.99 E",
                status: "Upcoming"
            }, {
                id: "125",
                bike: "Example Pro bike",
                rental_period: "12.12.2017 - 17.12.2017",
                payout: "13.99 E",
                status: "Upcoming"
            }, {
                id: "126",
                bike: "Example Pro bike",
                rental_period: "12.12.2017 - 17.12.2017",
                payout: "13.99 E",
                status: "Upcoming"
            }, {
                id: "127",
                bike: "Example Pro bike",
                rental_period: "12.12.2017 - 17.12.2017",
                payout: "13.99 E",
                status: "Upcoming"
            }];

            api.get('/users/' + $localStorage.userId + "/report").then(
                function(response) {
                    invoices.transactions = response.data.transactions;
                },
                function(error) {
                    console.log("Error retrieving User", error);
                }
            );
        }
    ]
});
