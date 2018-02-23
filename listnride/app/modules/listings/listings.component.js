'use strict';

angular.module('listings', []).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: [
    '$mdDialog',
    '$analytics',
    '$timeout',
    '$mdToast',
    '$filter',
    '$translate',
    '$state',
    '$localStorage',
    '$mdMedia',
    'api',
    'accessControl',
    function ListingsController($mdDialog, $analytics, $timeout, $mdToast, $filter, $translate, $state, $localStorage, $mdMedia, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;
      
      listings.$onInit = function () {

        listings.maxTiles = 12;
        listings.status = '';
        listings.isDuplicating = false;

        if ($localStorage.listView === true) listings.listView = true;
        // fetch all bikes
        listings.get();

        listings.helper = {

          // local method to be called on duplicate success
          duplicateHelper: function (bike, duplicate_number) {
            api.post('/rides/' + bike.id + '/duplicate', {
              "quantity": duplicate_number
            }).then(function (response) {
              var job_id = response.data.job_id;
              listings.getStatus(bike, job_id, 'initialized');
              $mdToast.show(
                $mdToast.simple()
                  .textContent($translate.instant('toasts.duplicate-start'))
                  .hideDelay(4000)
                  .position('top center')
              );
            }, function () {
              $mdToast.show(
                $mdToast.simple()
                  .textContent($translate.instant('toasts.error'))
                  .hideDelay(4000)
                  .position('top center')
              );
            });
          },

          // local method containing logic for bike deletion
          deleteHelper: function (id) {
            api.delete("/rides/" + id).then(
              function (response) {
                _.remove(listings.mirror_bikes, function(n) {
                  return n.id === response.data.id;
                });
                listings.bikes = listings.mirror_bikes;
                if (listings.input) { listings.search() }
                $mdToast.show(
                  $mdToast.simple()
                    .textContent($translate.instant('toasts.bike-deleted'))
                    .hideDelay(4000)
                    .position('top center')
                );
                $analytics.eventTrack('List a Bike', { category: 'List Bike', label: 'Bike Removed' });
              },
              function (error) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent($translate.instant('toasts.pending-requests'))
                    .hideDelay(4000)
                    .position('top center')
                );
              }
            );
          }
        };
      };

      // local method to be used as duplicate dialog controller
      var DuplicateController = function () {
        var duplicate = this;
        duplicate.duplicate_number = 1;
        // cancel the dialog
        duplicate.cancelDialog = function () {
          $mdDialog.cancel();
        };
        // close the dialog succesfully
        duplicate.closeDialog = function () {
          $mdDialog.hide(parseInt(duplicate.duplicate_number));
        };
      };

      // local method to be used as delete controller
      var DeleteController = function (bikeId) {
        var deleteBikeDialog = this;
        // cancel dialog
        deleteBikeDialog.hide = function () {
          $mdDialog.hide();
        };
        // delete a bike after confirmation
        deleteBikeDialog.deleteBike = function () {
          listings.helper.deleteHelper(bikeId);
          $mdDialog.hide();
        }
      };

      var AvailabilityController = function (bike) {

        var availabilityDialog = this;
        availabilityDialog.inputs = [];
        availabilityDialog.isChanged = false;
        availabilityDialog.removedInputs = [];
        availabilityDialog.maxInputs = 5;
        availabilityDialog.isMaxInputs = false;
        availabilityDialog.addInput = addInput;
        availabilityDialog.destroyInput = destroyInput;
        availabilityDialog.removeInput = removeInput;
        availabilityDialog.create = create;
        availabilityDialog.update = update;
        availabilityDialog.destroy = destroy;
        availabilityDialog.close = close;
        availabilityDialog._checkMax = _checkMax;
        availabilityDialog.setData = setData;

        availabilityDialog.setData();

        //////////////////

        console.log(bike);

        function _checkMax() {
          availabilityDialog.isMaxInputs = availabilityDialog.inputs.length >= availabilityDialog.maxInputs ? true : false;
        }

        function setData(response) {

          var testGetData = [
            {
              id: 97,
              start_date: "2018-02-03T00:00:00.000Z",
              duration: 20,
              active: true
            },
            {
              id: 98,
              start_date: "2018-02-02T00:00:00.000Z",
              duration: 5,
              active: true
            },
            {
              id: 99,
              start_date: "2018-02-01T00:00:00.000Z",
              duration: 2,
              active: true
            }
          ];
          console.log()
          availabilityDialog.inputs = response ? response : testGetData; /* bike.availabilities */
          availabilityDialog._checkMax();
        }
        
        function addInput() {
          if (!availabilityDialog.isMaxInputs) {
            availabilityDialog.inputs.push({});
            availabilityDialog._checkMax();
          }
          console.log(availabilityDialog.isChanged);
        }

        function destroyInput(index){
          availabilityDialog.inputs.splice(index, 1);
          availabilityDialog._checkMax();
        }
        
        function removeInput(index) {
          if (availabilityDialog.inputs[index].id) {
            availabilityDialog.destroy(availabilityDialog.inputs[index].id);
          } else {
            destroyInput(index);
          }          
        }

        var testPostData = {
          'availabilities': [
            {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 5
            },
            {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 10
            },
            {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 20
            }
          ]
        };

        var testPutData = {
          'availabilities': {
            '94' : {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 5
            },
            '95': {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 10
            },
            '96': {
              'ride_id': bike.id,
              'start_date': '2015-07-10',
              'duration': 20
            }
          }
        };

        function update() {
          api.put('/rides/' + bike.id + '/availabilities/', testPutData).then(
            function (response) {
              $mdDialog.hide();
            },
            function (error) {
            }
          );
        }

        function create() {
          api.post('/rides/' + bike.id + '/availabilities/', testPostData).then(
            function (response) {
              $mdDialog.hide();
            },
            function (error) {

            }
          );
        }

        function destroy(id) {
          api.delete('/rides/' + bike.id + '/availabilities/' + id).then(
            function (response) {
              response = JSON.parse(response);  
              destroyInput(_.findIndex(availabilityDialog.inputs, { 'id': 'response.id' }));
            },
            function (error) {
              // @TODO: show error message
            }
          );
        }

        function close() {
          $mdDialog.hide();
        }

      };

      // search functionality in header of My Bikes (List View)
      listings.search = function () {
        listings.bikes = $filter('filter')(listings.mirror_bikes, filterFunction, { $: listings.input });
      };

      var filterFunction = function(bike) {
        //TODO improve search by reducing extra params from backend
        var val = listings.input.toLocaleLowerCase();
        return bike.name.toLocaleLowerCase().indexOf(val) > -1 || bike.city.toLocaleLowerCase().indexOf(val) > -1 || bike.brand.toLocaleLowerCase().indexOf(val) > -1;
      };

      // Redirect to bike list
      listings.listBike = function () {
        $state.go('list');
      };

      // bikes duplication takes long time
      // this method is used to keep checking status api
      // and fetch bikes once they are uploaded
      listings.getStatus = function (bike, jobId) {
        listings.isDuplicating = true;
        api.get('/rides/' + bike.id + '/status/' + jobId).then(function (response) {
          listings.status = response.data.status;
          // if status is not complete
          // keep checking the status api every 5 seconds
          if (listings.status !== 'complete') {
            // avoid self invocation of a function
            $timeout(function () {
              listings.getStatus(bike, jobId, listings.status)
            },
              // every 5 sec
              5000);
          }
          // once status is complete
          // bind new bikes with controller scope
          else if (listings.status === 'complete') {
            listings.isDuplicating = false;
            listings.get();
          }
        }, function (error) {
        });
      };

      // duplicate a bike
      listings.duplicate = function (bike, event) {
        var duplicateConfig = {
          templateUrl: 'app/modules/listings/views/list-view.duplicate.template.html',
          controller: DuplicateController,
          controllerAs: 'duplicate',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true,
          fullscreen: true
        };
        $mdDialog.show(duplicateConfig).then(function (duplicate_number) {
          listings.helper.duplicateHelper(bike, duplicate_number);
        }, function () {
        });
      };

      // delete a bike
      // asks for confirmation
      listings.delete = function (id, event) {
        $mdDialog.show({
          controller: DeleteController,
          controllerAs: 'deleteBikeDialog',
          templateUrl: 'app/modules/shared/listing-card/delete-bike-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            bikeId: id
          }
        });
      };

      listings.changeAvailability = function (bike, event) {
        $mdDialog.show({
          controller: AvailabilityController,
          controllerAs: 'availabilityDialog',
          templateUrl: 'app/modules/shared/listing-card/availability-bike-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          escapeToClose: false,
          locals: {
            bike: bike
          }
        });
      };

      // deactivate a bike
      // used only in List View
      // Tile View has its own implementation
      listings.deactivate = function (index) {
        var id = listings.bikes[index].id;
        listings.deactivated = true;
        api.put("/rides/" + id, { "ride": { "available": !listings.bikes[index].available } }).then(
          function () {
            listings.bikes[index].available = !listings.bikes[index].available;
          },
          function () {
            listings.deactivated = false;
          }
        );
      };

      // fetch bikes
      listings.get = function () {
        api.get('/users/' + $localStorage.userId + "/rides").then(
          function (response) {
            listings.bikes = response.data;
            listings.mirror_bikes = response.data;
            if (listings.input) { listings.search() }
            if (listings.listView === false) {
              listings.listView = listings.bikes.length >= listings.maxTiles && $mdMedia('gt-sm');
              $localStorage.listView = listings.listView;
            }
          },
          function (error) {
          }
        );
      };

      // Redirect to Edit Bike route
      listings.edit = function (id) {
        $state.go('edit', { bikeId: id });
      };

      // Redirect to View Bike route
      listings.view = function (id, event) {
        // stop event from propograting
        if (event && event.stopPropogation) event.stopPropogation();
        // sref
        $state.go('bike', { bikeId: id });
      };

      // save view mode in localstorage
      listings.changeListingMode = function(mode) {
          $localStorage.listView = mode;
      };
    }
  ]
});
