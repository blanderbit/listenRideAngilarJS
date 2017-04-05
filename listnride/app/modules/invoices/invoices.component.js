'use strict';

angular.module('invoices',[]).component('invoices', {
    templateUrl: 'app/modules/invoices/invoices.template.html',
    controllerAs: 'invoices',
    controller: ['$localStorage', 'api', 'accessControl', '$translate',
        function InvoicesController($localStorage, api, accessControl, $translate) {
            if (accessControl.requireLogin()) {
                return
            }
            var invoices = this;
            invoices.ridesAsListerAny = true;
            invoices.ridesAsRiderAny = true;
            invoices.loadingRequests = true;

            api.get('/users/' + $localStorage.userId + "/reports").then(
                function(response) {
                    invoices.asLister = response.data.as_lister;
                    invoices.asRider = response.data.as_rider;
                    invoices.years = Object.keys(invoices.asRider).reverse();
                    invoices.ridesAny('rider');
                    invoices.ridesAny('lister');
                    invoices.loadingRequests = false;
                },
                function(error) {
                    invoices.loadingRequests = false;
                    console.log("Error retrieving User", error);
                }
            );

            invoices.parseDate = function (milliseconds) {
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(milliseconds);
                var day = date.getDate();
                var hours = date.getHours();
                var ampm = hours >= 12 ? 'pm' : 'am';
                var monthIndex = date.getMonth();
                var monthName = $translate.instant("shared." + monthNames[monthIndex]);
                return day + ' ' + monthName + ' - ' + hours + ' ' + ampm
            };

            invoices.getCsv = function (target) {
                api.get('/users/' + $localStorage.userId + "/transaction_csv?target=" + target).then(
                    function(response) {
                        var anchor = angular.element('<a/>');
                        anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                            target: '_blank',
                            download: 'Billings as ' + target + ' ' + moment().format('MMMM Do YYYY') + '.csv'
                        })[0].click();
                    },
                    function(error) {
                        console.log("Error retrieving CSV", error);
                    }
                );
            };

            invoices.ridesAny = function(target) {
                if (target == 'rider') {
                    invoices.ridesAsRiderAny = !_.isEmpty(invoices.asRider)
                } else {
                    invoices.ridesAsListerAny = !_.isEmpty(invoices.asLister)
                }
            };

            invoices.items = [];
            for (var i = 0; i < 100001; i++) {
                invoices.items.push(i);
            }
        }
    ]
});
