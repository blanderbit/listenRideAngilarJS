'use strict';

angular.module('brands', []).component('brands', {
  templateUrl: 'app/modules/brands/brands.template.html',
  controllerAs: 'brands',
  controller: ['$timeout', '$translatePartialLoader', 'ENV', 'notification', 'mapConfigs', 'NgMap',
    function BrandsController($timeout, $tpl, ENV, notification, mapConfigs, NgMap) {

      var brands = this;
      $tpl.addPart(ENV.staticTranslation);

      brands.$onInit = function () {
        // variables
        brands.isMapView = false;
        brands.categoryIds = [];
        brands.selectedCategories = [];
        brands.filteredBrands = [];
        brands.data = [];
        brands.colorScheme = mapConfigs.colorScheme();
        // TODO: change to first picked Brand
        brands.mapOptions = {
          lat: 50.1176084,
          lng: 11.362239,
          zoom: 5
        };
        // methods
        brands.isIncludeCategory = isIncludeCategory;
        brands.filterChange = filterChange;
        brands.checkSelectedBrands = checkSelectedBrands;
        // invocations
        getData();
      };

      function getData() {
          brands.data = [
            {
                "id": 1,
                "logo": "/app/assets/ui_images/featured-tiles/ampler.jpg",
                "title": "Ampler",
                "tile_image": "/app/assets/ui_images/featured-tiles/ampler.jpg",
                "categories": [11, 14, 21],
                "pins": [
                  {
                    "lat": 52.5269957477477,
                    "lng": 13.403609690991
                    },
                  {
                    "lat": 52.5269957477477,
                    "lng": 13.403609690991
                    }
              ]
            },
            {
              "id": 2,
              "logo": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "title": "Rethink",
              "tile_image": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "categories": [21, 22, 31],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 3,
              "logo": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "title": "Vello",
              "tile_image": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "categories": [41,51,61],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 4,
              "logo": "/app/assets/ui_images/featured-tiles/ampler.jpg",
              "title": "Ampler",
              "tile_image": "/app/assets/ui_images/featured-tiles/ampler.jpg",
              "categories": [11, 14, 21],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 42.5269957477477,
                  "lng": 23.403609690991
                }
              ]
            },
            {
              "id": 5,
              "logo": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "title": "Rethink",
              "tile_image": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "categories": [21, 22, 31],
              "pins": [{
                  "lat": 12.5269957477477,
                  "lng": 10.403609690991
                },
                {
                  "lat": 12.5269957477477,
                  "lng": 15.403609690991
                }
              ]
            },
            {
              "id": 6,
              "logo": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "title": "Vello",
              "tile_image": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "categories": [41, 51, 61],
              "pins": [{
                  "lat": 11.5269957477477,
                  "lng": 5.403609690991
                },
                {
                  "lat": 25.5269957477477,
                  "lng": 80.403609690991
                }
              ]
            },
            {
              "id": 7,
              "logo": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "title": "Rethink",
              "tile_image": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "categories": [21, 22, 31],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 8,
              "logo": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "title": "Vello",
              "tile_image": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "categories": [41, 51, 61],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 9,
              "logo": "/app/assets/ui_images/featured-tiles/ampler.jpg",
              "title": "Ampler",
              "tile_image": "/app/assets/ui_images/featured-tiles/ampler.jpg",
              "categories": [11, 14, 21],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 10,
              "logo": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "title": "Rethink",
              "tile_image": "/app/assets/ui_images/featured-tiles/rethink.jpg",
              "categories": [21, 22, 31],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            },
            {
              "id": 11,
              "logo": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "title": "Vello",
              "tile_image": "/app/assets/ui_images/featured-tiles/vello.jpg",
              "categories": [41, 51, 61],
              "pins": [{
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                },
                {
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
                }
              ]
            }
          ]
          checkSelectedBrands();
          initializeGoogleMap();
      };

      function isIncludeCategory(brandCategories) {
        // show all brands if no categories picked
        if (!brands.categoryIds.length) return true;
        return !!_.intersection(brands.categoryIds, brandCategories).length;
      };

      function filterChange() {
        brands.checkSelectedBrands();
        $timeout(function () {
          refreshMarkerCluster(brands.map);
        }, 0);
      };

      function checkSelectedBrands() {
        brands.filteredBrands = [];
        // show all brands if no categories picked
        if (brands.categoryIds.length) {
          _.forEach(brands.data, function (brand) {
            if (_.intersection(brands.categoryIds, brand.categories).length) brands.filteredBrands.push(brand);
          });
        } else {
          brands.filteredBrands = brands.data;
        }
      }

      // ============================
      // >>>> START MAP FUNCTIONALITY
      // ============================


      function initializeGoogleMap() {
        // without timeout map will take an old array with bikes
        $timeout(function(){
          NgMap.getMap({ id: "searchMap" }).then(function (map) {
            // map.fitBounds(correctBounds());
            map.setZoom(map.getZoom());
            initMarkerClusterer(map);
            brands.map = map;
          });
        }, 0);
      }

      // Clear Markers, Add new and redraw map on each state update
      function refreshMarkerCluster(map) {
        var markers = [];
        _.forEach(brands.filteredBrands, function (brand) {
          _.forEach(brand.pins, function (pin) {
            markers.push(createMarkerForBrand(pin, map, brand));
          })
        });

        brands.clusterer.clearMarkers();
        /**
         * Add new markers and redraw a map
         * @param {Array} markers google.maps.Marker
         * @param {Boolean} opt_nodraw
         */
        brands.clusterer.addMarkers(markers, false);
      }

      function initMarkerClusterer(map) {
        var markers = [];

        _.forEach(brands.filteredBrands, function(brand){
          _.forEach(brand.pins, function(pin){
            markers.push(createMarkerForBrand(pin, map, brand));
          })
        });

        brands.mapMarkers = markers;

        var mcOptions = {
          styles: mapConfigs.clustersStyle()
        };
        brands.clusterer = new MarkerClusterer(map, markers, mcOptions);
        return brands.clusterer
      }

      function createMarkerForBrand(pin, map, brand) {
        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: 'app/assets/ui_icons/map/markers/Pin Map 56x56.png',
          // This marker is 56 pixels wide by 56 pixels high.
          size: new google.maps.Size(56,56),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (56/2, 56).
          anchor: new google.maps.Point(28, 56),
          // The label position inside marker
          labelOrigin: new google.maps.Point(28, 22)
          // scaledSize: new google.maps.Size(50, 50)
        };

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(pin.lat, pin.lng),
          id: brand.id,
          icon: image,
          title: brand.title,
          label: { text: brand.title, color: "white", fontSize: '13px', fontWeight: 'bold' }
        });

        google.maps.event.addListener(marker, 'click', function () {
          brands.selectedBrand = brand;
          map.showInfoWindow('searchMapWindow', this);
        });

        return marker;
      }

      // ============================
      // END MAP FUNCTIONALITY <<<<<<
      // ============================
    }
  ]
});
