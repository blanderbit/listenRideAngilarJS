'use strict';

angular.module('brands', []).component('brands', {
  templateUrl: 'app/modules/brands/brands.template.html',
  controllerAs: 'brands',
  controller: ['$translatePartialLoader', 'ENV', 'notification',
    function BrandsController($tpl, ENV, notification) {

      var brands = this;
      $tpl.addPart(ENV.staticTranslation);

      brands.$onInit = function () {
        // variables
        brands.isMapView = false;
        brands.categoryIds = [];
        brands.selectedCategories = [];
        brands.data = [];
        // methods
        brands.isIncludeCategory = isIncludeCategory;
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
                  "lat": 52.5269957477477,
                  "lng": 13.403609690991
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
              "id": 6,
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
      };

      function isIncludeCategory(brandCategories) {
        // if no categories were pick, we show all brands
        if (!brands.categoryIds.length) return true;
        return !!_.intersection(brands.categoryIds, brandCategories).length;
      };
    }
  ]
});
