'use strict';

angular.module('listnride')
  .factory('bikeOptions', ['$translate', function ($translate) {
    return {
      accessoryOptions: function () {
        return [
          {model: "has_lock", label: "lock", iconFileName: "accessoire_lock.svg"},
          {model: "has_helmet", label: "helmet", iconFileName: "accessoire_helmet.svg"},
          {model: "has_lights", label: "lights", iconFileName: "accessoire_lights.svg"},
          {model: "has_basket", label: "basket", iconFileName: "accessoire_basket.svg"},
          {model: "has_trailer", label: "trailer", iconFileName: "accessoire_trailer.svg"},
          {model: "has_childseat", label: "childseat", iconFileName: "accessoire_childseat.svg"}
        ]
      },

      sizeOptions: function () {
        return [
          {value: 0, label: "Unisize"},
          {value: 155, label: "155 cm - 165 cm"},
          {value: 165, label: "165 cm - 175 cm"},
          {value: 175, label: "175 cm - 185 cm"},
          {value: 185, label: "185 cm - 195 cm"},
          {value: 195, label: "195 cm - 205 cm"}
        ];
      },

      sizeOptionsForSearch: function () {
        return [
          { value: -1, label: "-" },
          { value: 155, label: "155 cm - 165 cm" },
          { value: 165, label: "165 cm - 175 cm" },
          { value: 175, label: "175 cm - 185 cm" },
          { value: 185, label: "185 cm - 195 cm" },
          { value: 195, label: "195 cm - 205 cm" }
        ];
      },

      kidsSizeOptions: function () {
        return [
          {value: 85, label: "85 cm - 95 cm"},
          {value: 95, label: "95 cm - 105 cm"},
          {value: 105, label: "105 cm - 115 cm"},
          {value: 115, label: "115 cm - 125 cm"},
          {value: 125, label: "125 cm - 135 cm"},
          {value: 135, label: "135 cm - 145 cm"},
          {value: 145, label: "145 cm - 155 cm"}
        ];
      },

      categoryOptions: function () {
        return [
          {value: 1, label: "city", iconFileName: "biketype_1.svg"},
          {value: 2, label: "race", iconFileName: "biketype_2.svg"},
          {value: 3, label: "all terrain", iconFileName: "biketype_3.svg"},
          {value: 4, label: "kids", iconFileName: "biketype_4.svg"},
          {value: 5, label: "electro", iconFileName: "biketype_5.svg"},
          {value: 6, label: "special", iconFileName: "biketype_6.svg"}
        ];
      },

      allCategoriesOptions: function () {
        // Translate allCategoriesOptions fields (categories, subcategories)
        var categoriesTranslationKeys = [
          "list.category.city",
          "list.subcategory.1.dutch-bike",
          "list.subcategory.1.touring-bike",
          "list.subcategory.1.fixie",
          "list.subcategory.1.single-speed",

          "list.category.race",
          "list.subcategory.2.road-bike",
          "list.subcategory.2.triathlon",
          "list.subcategory.2.indoor",

          "list.category.all-terrain",
          "list.subcategory.3.tracking",
          "list.subcategory.3.enduro",
          "list.subcategory.3.freeride",
          "list.subcategory.3.cross-country",
          "list.subcategory.3.downhill",
          "list.subcategory.3.cyclocross",

          "list.category.kids",
          "list.subcategory.4.city",
          "list.subcategory.4.all-terrain",
          "list.subcategory.4.road",

          "list.category.electro",
          "list.subcategory.5.pedelec",
          "list.subcategory.5.e-bike",

          "list.category.special",
          "list.subcategory.6.folding-bike",
          "list.subcategory.6.tandem",
          "list.subcategory.6.cruiser",
          "list.subcategory.6.cargo-bike",
          "list.subcategory.6.recumbent",
          "list.subcategory.6.mono-bike",
        ];

        return $translate(categoriesTranslationKeys).then(function (translations) {
          return [
            {
              catId: 10,
              name: translations["list.category.city"],
              iconFileName: "biketype_1.svg",
              subcategories: [
                { id: 10, name: translations["list.subcategory.1.dutch-bike"] },
                { id: 11, name: translations["list.subcategory.1.touring-bike"] },
                { id: 12, name: translations["list.subcategory.1.fixie"] },
                { id: 13, name: translations["list.subcategory.1.single-speed"] }
              ]
            },
            {
              catId: 20,
              name: translations["list.category.race"],
              iconFileName: "biketype_2.svg",
              subcategories: [
                { id: 20, name: translations["list.subcategory.2.road-bike"] },
                { id: 21, name: translations["list.subcategory.2.triathlon"] },
                { id: 22, name: translations["list.subcategory.2.indoor"] }
              ]
            },
            {
              catId: 30,
              name: translations["list.category.all-terrain"],
              iconFileName: "biketype_3.svg",
              subcategories: [
                { id: 30, name: translations["list.subcategory.3.tracking"] },
                { id: 31, name: translations["list.subcategory.3.enduro"] },
                { id: 32, name: translations["list.subcategory.3.freeride"] },
                { id: 33, name: translations["list.subcategory.3.cross-country"] },
                { id: 34, name: translations["list.subcategory.3.downhill"] },
                { id: 35, name: translations["list.subcategory.3.cyclocross"] }
              ]
            },
            {
              catId: 40,
              name: translations["list.category.kids"],
              iconFileName: "biketype_4.svg",
              subcategories: [
                { id: 40, name: translations["list.subcategory.4.city"] },
                { id: 41, name: translations["list.subcategory.4.all-terrain"] },
                { id: 42, name: translations["list.subcategory.4.road"] }
              ]
            },
            {
              catId: 50,
              name: translations["list.category.electro"],
              iconFileName: "biketype_5.svg",
              subcategories: [
                { id: 50, name: translations["list.subcategory.5.pedelec"] },
                { id: 51, name: translations["list.subcategory.5.e-bike"] }
              ]
            },
            {
              catId: 60,
              name: translations["list.category.special"],
              iconFileName: "biketype_6.svg",
              subcategories: [
                { id: 60, name: translations["list.subcategory.6.folding-bike"] },
                { id: 61, name: translations["list.subcategory.6.tandem"] },
                { id: 62, name: translations["list.subcategory.6.cruiser"] },
                { id: 63, name: translations["list.subcategory.6.cargo-bike"] },
                { id: 64, name: translations["list.subcategory.6.recumbent"] },
                { id: 65, name: translations["list.subcategory.6.mono-bike"] }
              ]
            }
          ];
        });
      },

      subcategoryOptions: function () {
        return {
          "1": [
            {value: 0, label: "dutch-bike"},
            {value: 1, label: "touring-bike"},
            {value: 2, label: "fixie"},
            {value: 3, label: "single-speed"}
          ],
          "2": [
            {value: 0, label: "road-bike"},
            {value: 1, label: "triathlon"},
            {value: 2, label: "indoor"}
          ],
          "3": [
            {value: 0, label: "tracking"},
            {value: 1, label: "enduro"},
            {value: 2, label: "freeride"},
            {value: 3, label: "cross-country"},
            {value: 4, label: "downhill"},
            {value: 5, label: "cyclocross"}
          ],
          "4": [
            {value: 0, label: "city"},
            {value: 1, label: "all-terrain"},
            {value: 2, label: "road"}
          ],
          "5": [
            {value: 0, label: "pedelec"},
            {value: 1, label: "e-bike"}
          ],
          "6": [
            {value: 0, label: "folding-bike"},
            {value: 1, label: "tandem"},
            {value: 2, label: "cruiser"},
            {value: 3, label: "cargo-bike"},
            {value: 4, label: "recumbent"},
            {value: 5, label: "mono-bike"},
            {value: 6, label: "trailer"}
          ]
        };
      }
    };
  }]);
