'use strict';

angular.module('listnride')
  .factory('bikeOptions', ['$translate', function ($translate) {
    return {
      // All accessories keys
      accessoriesTranslationKeys: function () {
        return [
          "list.accessories.lock",
          "list.accessories.helmet",
          "list.accessories.lights",
          "list.accessories.basket",
          "list.accessories.trailer",
          "list.accessories.childseat",
          "list.accessories.gps"
        ];
      },

      accessoryOptions: function () {
        return $translate(this.accessoriesTranslationKeys()).then(function (translations) {
          return [
            { model: "lock", label: "lock", iconFileName: "accessoire_lock.svg", name: translations["list.accessories.lock"] },
            { model: "helmet", label: "helmet", iconFileName: "accessoire_helmet.svg", name: translations["list.accessories.helmet"] },
            { model: "lights", label: "lights", iconFileName: "accessoire_lights.svg", name: translations["list.accessories.lights"] },
            { model: "basket", label: "basket", iconFileName: "accessoire_basket.svg", name: translations["list.accessories.basket"] },
            { model: "trailer", label: "trailer", iconFileName: "accessoire_trailer.svg", name: translations["list.accessories.trailer"]} ,
            { model: "childseat", label: "childseat", iconFileName: "accessoire_childseat.svg", name: translations["list.accessories.childseat"] },
            { model: "gps", label: "gps", iconFileName: "accessoire_gps.svg", name: translations["list.accessories.gps"] }
          ];
        })
      },

      sizeOptions: function () {
        return [
          { value: 0, label: $translate.instant("search.unisize")},
          { value: 155, label: "155 cm - 165 cm" },
          { value: 165, label: "165 cm - 175 cm" },
          { value: 175, label: "175 cm - 185 cm" },
          { value: 185, label: "185 cm - 195 cm" },
          { value: 195, label: "195 cm - 205 cm" }
        ];
      },

      sizeOptionsForSearch: function () {
        return [
          { value: -1, label: "-" },
          { value: 0, label: $translate.instant("search.unisize")},
          { value: 155, label: "155 cm - 165 cm" },
          { value: 165, label: "165 cm - 175 cm" },
          { value: 175, label: "175 cm - 185 cm" },
          { value: 185, label: "185 cm - 195 cm" },
          { value: 195, label: "195 cm - 205 cm" }
        ];
      },

      kidsSizeOptions: function () {
        return [
          { value: 85, label: "85 cm - 95 cm" },
          { value: 95, label: "95 cm - 105 cm" },
          { value: 105, label: "105 cm - 115 cm" },
          { value: 115, label: "115 cm - 125 cm" },
          { value: 125, label: "125 cm - 135 cm" },
          { value: 135, label: "135 cm - 145 cm" },
          { value: 145, label: "145 cm - 155 cm" }
        ];
      },

      // All categories and subcategories keys
      categoriesTranslationKeys: function () {
        return [
          "list.category.urban",
          "list.subcategory.1.city-bike",
          "list.subcategory.1.dutch-bike",
          "list.subcategory.1.single-speed",

          "list.category.e-bike",
          "list.subcategory.2.e-city-bike",
          "list.subcategory.2.e-touring-bike",
          "list.subcategory.2.e-cargo-bike",
          "list.subcategory.2.e-mountain-bike",
          "list.subcategory.2.e-road-bike",
          "list.subcategory.2.e-folding-bike",
          "list.subcategory.2.e-scooter",

          "list.category.road",
          "list.subcategory.3.road-bike",
          "list.subcategory.3.triathlon-bike",
          "list.subcategory.3.touring-bike",
          "list.subcategory.3.fixed-gear-bike",

          "list.category.all-terrain",
          "list.subcategory.4.mtb-hardtail",
          "list.subcategory.4.mtb-fullsuspension",
          "list.subcategory.4.cyclocross-bike",
          "list.subcategory.4.gravel-bike",

          "list.category.transport",
          "list.subcategory.5.cargo-bike",
          "list.subcategory.5.bike-trailer",
          "list.subcategory.5.bike-child-seat",
          "list.subcategory.5.bike-car-rack",
          "list.subcategory.5.bike-travel-bag",

          "list.category.kids",
          "list.subcategory.6.city-bike",
          "list.subcategory.6.all-terrain-bike",
          "list.subcategory.6.road-bike",
          "list.subcategory.6.bogie-wheel",

          "list.category.special",
          "list.subcategory.7.folding-bike",
          "list.subcategory.7.recumbent-bike",
          "list.subcategory.7.tandem-bike",
          "list.subcategory.7.longtail-bike",
          "list.subcategory.7.scooter"
        ];
      },

      allCategoriesOptions: function () {
        return $translate(this.categoriesTranslationKeys()).then(function (translations) {
          return [
            {
              catId: 10,
              name: translations["list.category.urban"],
              iconFileName: "biketype_1.svg",
              subcategories: [
                { id: 10, name: translations["list.subcategory.1.city-bike"] },
                { id: 11, name: translations["list.subcategory.1.dutch-bike"] },
                { id: 12, name: translations["list.subcategory.1.single-speed"] }
              ]
            }, {
              catId: 20,
              name: translations["list.category.e-bike"],
              iconFileName: "biketype_2.svg",
              subcategories: [
                { id: 20, name: translations["list.subcategory.2.e-city-bike"] },
                { id: 21, name: translations["list.subcategory.2.e-touring-bike"] },
                { id: 22, name: translations["list.subcategory.2.e-cargo-bike"] },
                { id: 23, name: translations["list.subcategory.2.e-mountain-bike"] },
                { id: 24, name: translations["list.subcategory.2.e-road-bike"] },
                { id: 25, name: translations["list.subcategory.2.e-folding-bike"] },
                { id: 26, name: translations["list.subcategory.2.e-scooter"] }
              ]
            }, {
              catId: 30,
              name: translations["list.category.road"],
              iconFileName: "biketype_3.svg",
              subcategories: [
                { id: 30, name: translations["list.subcategory.3.road-bike"] },
                { id: 31, name: translations["list.subcategory.3.triathlon-bike"] },
                { id: 32, name: translations["list.subcategory.3.touring-bike"] },
                { id: 33, name: translations["list.subcategory.3.fixed-gear-bike"] }
              ]
            }, {
              catId: 40,
              name: translations["list.category.all-terrain"],
              iconFileName: "biketype_4.svg",
              subcategories: [
                { id: 40, name: translations["list.subcategory.4.mtb-hardtail"] },
                { id: 41, name: translations["list.subcategory.4.mtb-fullsuspension"] },
                { id: 42, name: translations["list.subcategory.4.cyclocross-bike"] },
                { id: 43, name: translations["list.subcategory.4.gravel-bike"] }
              ]
            }, {
              catId: 50,
              name: translations["list.category.transport"],
              iconFileName: "biketype_5.svg",
              subcategories: [
                { id: 50, name: translations["list.subcategory.5.cargo-bike"] },
                { id: 51, name: translations["list.subcategory.5.bike-trailer"] },
                { id: 52, name: translations["list.subcategory.5.bike-child-seat"] },
                { id: 53, name: translations["list.subcategory.5.bike-car-rack"] },
                { id: 54, name: translations["list.subcategory.5.bike-travel-bag"] }
              ]
            }, {
              catId: 60,
              name: translations["list.category.kids"],
              iconFileName: "biketype_6.svg",
              subcategories: [
                { id: 60, name: translations["list.subcategory.6.city-bike"] },
                { id: 61, name: translations["list.subcategory.6.all-terrain-bike"] },
                { id: 62, name: translations["list.subcategory.6.road-bike"] },
                { id: 63, name: translations["list.subcategory.6.bogie-wheel"] }
              ]
            }, {
              catId: 70,
              name: translations["list.category.special"],
              iconFileName: "biketype_7.svg",
              subcategories: [
                { id: 70, name: translations["list.subcategory.7.folding-bike"] },
                { id: 71, name: translations["list.subcategory.7.recumbent-bike"] },
                { id: 72, name: translations["list.subcategory.7.tandem-bike"] },
                { id: 73, name: translations["list.subcategory.7.longtail-bike"] },
                { id: 74, name: translations["list.subcategory.7.scooter"] }
              ]
            }
          ];
        });
      },

      // TODO: remove urlOld, when @alexander will know about keywords
      allCategoriesOptionsSeo: function () {
        return $translate(this.categoriesTranslationKeys()).then(function (translations) {
          return [
            {
              urlOld: 'city',
              url: 'urban',
              name: translations["list.category.urban"],
              imgFilePath: "app/assets/ui_images/seo/city.jpg",
              subcategories: '10,11,12'
            }, {
              urlOld: 'electric',
              url: 'e-bike',
              name: translations["list.category.e-bike"],
              imgFilePath: "app/assets/ui_images/seo/electric.jpg",
              subcategories: '20,21,22,23,24,25,26'
            }, {
              urlOld: 'race',
              url: 'road',
              name: translations["list.category.road"],
              imgFilePath: "app/assets/ui_images/seo/race.jpg",
              subcategories: '30,31,32,33'
            }, {
              url: 'all-terrain',
              name: translations["list.category.all-terrain"],
              imgFilePath: "app/assets/ui_images/seo/all-terrain.jpg",
              subcategories: '40,41,42,43'
            }, {
              url: 'transport',
              name: translations["list.category.transport"],
              // TODO: Add image for transport
              imgFilePath: "",
              subcategories: '50,51,52,53,54'
            }, {
              url: 'kids',
              name: translations["list.category.kids"],
              imgFilePath: "app/assets/ui_images/seo/kids.jpg",
              subcategories: '60,61,62,63'
            }, {
              url: 'special',
              name: translations["list.category.special"],
              imgFilePath: "app/assets/ui_images/seo/special.jpg",
              subcategories: '70,71,72,73,74'
            }
          ];
        });
      }
    };
  }]);
