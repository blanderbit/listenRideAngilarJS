'use strict';

angular.module('invoices',[]).component('invoices', {
    templateUrl: 'app/modules/invoices/invoices.template.html',
    controllerAs: 'invoices',
    controller: ['$localStorage', 'api', 'accessControl', '$translate', '$window',
      function InvoicesController($localStorage, api, accessControl, $translate, $window) {
        if (accessControl.requireLogin()) { return }

        var invoices = this;
        invoices.ridesAsListerAny = true;
        invoices.ridesAsRiderAny = true;
        invoices.loadingRequests = true;
        invoices.filtersType = 'lister';

        api.get('/users/' + $localStorage.userId + "/reports").then(
          function(response) {
            invoices.asLister = response.data.as_lister;
            invoices.asRider = response.data.as_rider;
            invoices.yearsRider = Object.keys(invoices.asRider).reverse();
            invoices.yearsLister = Object.keys(invoices.asLister).reverse();
            invoices.ridesAny('rider');
            invoices.ridesAny('lister');
            invoices.loadingRequests = false;
          },
          function(error) {
            invoices.loadingRequests = false;
          }
        );

        invoices.parseDate = function (milliseconds) {
          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var date = new Date(milliseconds);
          var day = date.getDate();
          var hours = date.getHours();
          // var ampm = hours >= 12 ? 'pm' : 'am';
          var monthIndex = date.getMonth();
          var monthName = $translate.instant("shared." + monthNames[monthIndex]);
          return day + ' ' + monthName + ', ' + hours + ':00'
        };

        invoices.getCsv = function (target) {
          var fileName = 'Billings as ' + target + ' ' + moment().format('MMMM Do YYYY') + '.csv';
            api.get('/users/' + $localStorage.userId + "/transaction_csv?target=" + target, 'blob').then(
              function(response) {
                downloadAttachment(fileName, response.data, 'application/csv');
              },
              function(error) {
              }
            );
        };

        invoices.getPdf = function(id, target) {
          var fileName = 'Invoice ' + id + ' ' + moment().format('MMMM Do YYYY') + '.pdf';
          api.get('/users/' + $localStorage.userId + '/invoices/' + id + '?target=' + target, 'blob').then(function (result) {
            downloadAttachment(fileName, result.data, 'application/pdf')
          });
        };

        function downloadAttachment(fileName, data, type) {
          var a = document.createElement('a');
          var file = new Blob([data], {type: type});
          var fileURL = window.URL.createObjectURL(file);
          a.href = fileURL;
          a.download = fileName;
          a.click();
        }

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

        invoices.filterInvoices = function (type) {
          invoices.filtersType = type;
        };
      }
    ]
});
