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
        // variables
        listings.maxTiles = 12;
        listings.status = '';
        listings.isDuplicating = false;

        if ($localStorage.listView) listings.listView = true;


        // methods
        listings.getAllBikes = getAllBikes;

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

        // invocations
        listings.getAllBikes()
      };

      // CHILD CONTROLLERS

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

        // TODO: move this to a single file
        var AvailabilityController = function (bike, $scope) {
          var availabilityDialog = this;
          availabilityDialog.inputs = [];
          availabilityDialog.isChanged = false;
          availabilityDialog.removedInputs = [];
          availabilityDialog.maxInputs = 5;
          availabilityDialog.isMaxInputs = false;
          availabilityDialog.disabledDates = [];
          availabilityDialog.addInput = addInput;
          availabilityDialog.destroyInput = destroyInput;
          availabilityDialog.removeInput = removeInput;
          availabilityDialog.create = create;
          availabilityDialog.update = update;
          availabilityDialog.save = save;
          availabilityDialog.destroy = destroy;
          availabilityDialog.close = close;
          availabilityDialog._checkMax = _checkMax;
          availabilityDialog.setData = setData;
          availabilityDialog.takeDisabledDates = takeDisabledDates;
          availabilityDialog.requests = bike.requests;
          availabilityDialog.changeDate = changeDate;

          if (!bike.hasOwnProperty('availabilities')) bike.availabilities = {};
          availabilityDialog.setData();

          //////////////////

          function changeDate() {
            availabilityDialog.isChanged = true;
            availabilityDialog.disabledDates = availabilityDialog.takeDisabledDates();
          }

          function _getModel(item) {
            return {
              'ride_id': bike.id,
              'start_date': item.start_date,
              'duration': item.duration
            }
          }

          function _checkMax() {
            availabilityDialog.isMaxInputs = availabilityDialog.inputs.length >= availabilityDialog.maxInputs ? true : false;
          }

          function setData() {
            // clear array
            availabilityDialog.isChanged = false;
            availabilityDialog.inputs.length = 0;

            for (var id in bike.availabilities) {
              availabilityDialog.inputs.push({
                id: id,
                'start_date': bike.availabilities[id]['start_date'],
                'duration': bike.availabilities[id]['duration']
              })
            }
            // if it's no availabities let's create one clear range
            if (!availabilityDialog.inputs.length) availabilityDialog.addInput();

            availabilityDialog._checkMax();
            availabilityDialog.disabledDates = availabilityDialog.takeDisabledDates();
          }

          function updateData(data) {
            // update or create item in bike model
            _.forEach(data, function (item) {
              if (bike.availabilities.hasOwnProperty(item.id)) {
                angular.extend(bike.availabilities[item.id], item);
              } else {
                bike.availabilities[item.id] = item;
              }
            });

            availabilityDialog.setData();
          }

          function takeDisabledDates() {
            var disabled = [];
            _.forEach(availabilityDialog.inputs, function (item) {
              if (!item.start_date) return;
              var dateMoment = moment(new Date(item.start_date).setHours(0, 0, 0, 0));
              if (isNaN(dateMoment)) return;
              disabled.push({
                'start_at': dateMoment,
                'end_at': dateMoment.clone().add(item.duration, 'd')
              });
            });
            return disabled;
          }

          function addInput() {
            if (!availabilityDialog.isMaxInputs) {
              availabilityDialog.inputs.push({});
              availabilityDialog._checkMax();
            }
          }

          function destroyInput(index) {
            availabilityDialog.inputs.splice(index, 1);

            if (availabilityDialog.inputs.length < 1) {
              availabilityDialog.isChanged = false;
              availabilityDialog.addInput();
            }
            availabilityDialog.disabledDates = availabilityDialog.takeDisabledDates();
          }

          function removeInput(index) {
            // if input has 'id' it was saved, so we should call api to destroy it
            if (availabilityDialog.inputs[index].id) {
              availabilityDialog.destroy(availabilityDialog.inputs[index].id);
            } else {
              destroyInput(index);
            }
          }

          function showSuccessSavedMsg() {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.availability-success-saved'))
                .hideDelay(4000)
                .position('top center')
            )
          }

          function save() {
            if (!availabilityDialog.isChanged) return availabilityDialog.close();
            checkUpdated();
          }

          function checkUpdated() {
            var updateData = { 'availabilities': {} };
            var updatedItems = availabilityDialog.inputs.filter(function (item) {
              return item.hasOwnProperty('id') && item.hasOwnProperty('is_changed');
            });

            if (updatedItems.length) {
              _.forEach(updatedItems, function (item) {
                updateData['availabilities'][item.id] = _getModel(item);
              });
              update(JSON.stringify(updateData));
            } else {
              checkCreated();
            }
          }

          function checkCreated() {
            var newData = { 'availabilities': [] };
            var newItems = availabilityDialog.inputs.filter(function (item) {
              return !item.hasOwnProperty('id') && item.hasOwnProperty('is_changed');
            });

            if (newItems.length) {
              _.forEach(newItems, function (item) {
                newData['availabilities'].push(_getModel(item));
              });
              create(JSON.stringify(newData));
              return true;
            } else {
              return false;
            }
          }

          function update(data) {
            api.put('/rides/' + bike.id + '/availabilities/', data).then(
              function (response) {
                //TODO: rewrite by q.defer chain
                if (!checkCreated()) {
                  availabilityDialog.isChanged = false;
                  showSuccessSavedMsg();
                  updateData(response.data);
                }
              },
              function (error) {
                //TODO: error
              }
            );
          }

          function create(data) {
            api.post('/rides/' + bike.id + '/availabilities/', data).then(
              function (response) {
                updateData(response.data);
                //TODO: replace it to save function (q.defer chain)
                availabilityDialog.isChanged = false;
                showSuccessSavedMsg();
              },
              function (error) {
                //TODO: error
              }
            );
          }

          function destroy(id) {
            api.delete('/rides/' + bike.id + '/availabilities/' + id).then(
              function (response) {
                delete bike.availabilities[response.data.id];
                availabilityDialog.setData();
                // destroyInput(_.findIndex(availabilityDialog.inputs, { 'id': response.data.id }));
                $mdToast.show(
                  $mdToast.simple()
                    .textContent($translate.instant('toasts.range-success-delete'))
                    .hideDelay(4000)
                    .position('top center')
                )
              },
              function (error) {
                //TODO: show error message
              }
            );
          }

          function close() {
            $mdDialog.hide();
          }

        };

      // END OF CHILD CONTROLLERS

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
            listings.getAllBikes();
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
      function getAllBikes() {
        api.get('/users/' + $localStorage.userId + "/rides").then(
          function (response) {
            listings.bikes = response.data.bikes;
            // TODO: rewrite mirror bikes logic
            listings.mirror_bikes = response.data.bikes;
            if (listings.input) { listings.search() }
            if (!listings.listView) {
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
