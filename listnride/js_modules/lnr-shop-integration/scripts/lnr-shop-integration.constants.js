/* global
        $
*/
var lnrConstants = {
  env: 'production',
  lnrStyles: "https://s3.eu-central-1.amazonaws.com/listnride-cdns/lnr-shop-integration.min.css",
  lnrStylesLocal: "styles/lnr-shop-integration.css",
  introText: {
    // english intro text
    en: 'The bikes below are currently for you available to rent. ' +
    'You can simply click on the bike you&rsquo;d like to rent and book it directly online. ' +
    'We will have the bike awaiting your pick-up!',
    // deutsch intro text
    //
    de: 'Diese Fahrr&auml;der bieten wir aktuell zum Vermieten an. ' +
    'Durch klicken auf das gew&uuml;nschte Fahrrad k&ouml;nnen Sie einfach das Rad direkt online buchen. ' +
    'Das Fahrrad ist somit f&uuml;r Sie reserviert',
    // dutch intro text
    nl: 'De onderstaande fietsen bieden wij momenteel te huur aan. ' +
    'U kunt de fietsen eenvoudig online boeken, door op de gewenst fiets te klikken. ' +
    'De fiets is na de boeking voor uw gereserveerd. '
  },

  // translation object
  translate: {
    all: {
      "en": 'All',
      "de": 'Alle',
      "nl": 'Alles',
      "selected": ''
    }
  },

  // shop solution for staging and production
  staging_shop_url: "https://listnride-staging.herokuapp.com/v2/shop_solutions",
  production_shop_url: "https://api.listnride.com/v2/shop_solutions",

  // users for staging and production
  staging_users: "https://listnride-staging.herokuapp.com/v2/users/",
  production_users: "https://api.listnride.com/v2/users/",

  // root url for svg files
  svgUrlRoot: 'https://s3.eu-central-1.amazonaws.com/listnride-cdn/icons/biketype_',

  // map of the categories for en, de and nl languages
  subCategory: {
    // subcategory - english
    en: {
      "1": {
        "dutch-bike": "Dutch Bike",
        "touring-bike": "Touring Bike",
        "fixie": "Fixie",
        "single-speed": "Single Speed"
      },
      "2": {
        "road-bike": "Road Bike",
        "triathlon": "Triathlon",
        "indoor": "Indoor"
      },
      "3": {
        "tracking": "Tracking",
        "enduro": "Enduro",
        "freeride": "Freeride",
        "cross-country": "Cross Country",
        "downhill": "Downhill",
        "cyclocross": "Cyclocross"
      },
      "4": {
        "city": "City",
        "all-terrain": "All Terrain",
        "road": "Road"
      },
      "5": {
        "pedelec": "Pedelec",
        "e-bike": "E-Bike"
      },
      "6": {
        "folding-bike": "Folding Bike",
        "tandem": "Tandem",
        "cruiser": "Cruiser",
        "cargo-bike": "Cargo Bike",
        "recumbent": "Recumbent",
        "mono-bike": "Mono Bike"
      }
    },
    // subcategory - german
    de: {
      "1": {
        "dutch-bike": "Hollandrad",
        "touring-bike": "Touringrad",
        "fixie": "Fixie",
        "single-speed": "Single Speed"
      },
      "2": {
        "road-bike": "Rennrad",
        "triathlon": "Triathlonrad",
        "indoor": "Bahnrad"
      },
      "3": {
        "tracking": "Tracking",
        "enduro": "Enduro",
        "freeride": "Freeride",
        "cross-country": "Cross Country",
        "downhill": "Downhill",
        "cyclocross": "Cyclocross"
      },
      "4": {
        "city": "Stadt",
        "all-terrain": "Gelände",
        "road": "Strasse"
      },
      "5": {
        "pedelec": "Pedelec",
        "e-bike": "E-Bike"
      },
      "6": {
        "folding-bike": "Faltrad",
        "tandem": "Tandem",
        "cruiser": "Cruiser",
        "cargo-bike": "Lastenrad",
        "recumbent": "Liegerad",
        "mono-bike": "Einrad"
      }
    },
    // subcategory - dutch
    nl: {
      "1": {
        "dutch-bike": "Stadsfiets",
        "touring-bike": "Touringfiets",
        "fixie": "Fixie",
        "single-speed": "Single Speed"
      },
      "2": {
        "road-bike": "Racefiets",
        "triathlon": "Triathlonfiets",
        "indoor": "Baanfiets"
      },
      "3": {
        "tracking": "Tracking",
        "enduro": "Enduro",
        "freeride": "Freeride",
        "cross-country": "Cross Country",
        "downhill": "Downhill",
        "cyclocross": "Cyclocross"
      },
      "4": {
        "city": "Stad",
        "all-terrain": "All-terrain",
        "road": "race"
      },
      "5": {
        "pedelec": "Speed Pedelec",
        "e-bike": "Elektrische fiets"
      },
      "6": {
        "folding-bike": "vouwfiets",
        "tandem": "Tandem",
        "cruiser": "Cruiser",
        "cargo-bike": "transportfiets",
        "recumbent": "Ligfiets",
        "mono-bike": "Eenwieler"
      }
    }
  },

  mockUserApiResponse: {
    "id": 1013,
    "first_name": "Johannes",
    "email": "***",
    "last_name": "Stuhler",
    "acs_id": "55c71feae01404461d1670bd",
    "rating_lister": 5.0,
    "rating_rider": 5.0,
    "profile_picture": {
      "profile_picture": {
        "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1013/01452228225.jpeg"
      }
    },
    "street": "",
    "zip": "",
    "city": "M&uuml;nchen",
    "country": "Deutschland",
    "lat": null,
    "lng": null,
    "status": 3,
    "phone_number": "***",
    "description": "I can often be found road cycling. If possible approaching or passing the nearby alps. I enjoy the contact with nature. I found a classic 1998 Klein Quantum Race 10 years ago, and ever since used it for training and various triathlon competitions, a great bike.",
    "has_payout_method": true,
    "current_payout_method": {
      "family": 2,
      "details": "j.stuhler@gmx.de"
    },
    "has_address": false,
    "has_phone_number": true,
    "confirmed_phone": true,
    "has_description": true,
    "balance": 0,
    "active": true,
    "ref_code": "Johannes_PKAK",
    "unread_messages": 2,
    "password_hashed": null,
    "has_business": false,
    "pretty_phone_number": "",
    "rides": [
      {
        "id": 253,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/253/1461496311-21461496285.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/253/large_1461496311-21461496285.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/253/medium_1461496311-21461496285.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/253/small_1461496311-21461496285.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/253/thumb_1461496311-21461496285.jpeg"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/253/1461496311-01461496285.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/253/large_1461496311-01461496285.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/253/medium_1461496311-01461496285.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/253/small_1461496311-01461496285.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/253/thumb_1461496311-01461496285.jpeg"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/253/1461496311-31461496285.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/253/large_1461496311-31461496285.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/253/medium_1461496311-31461496285.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/253/small_1461496311-31461496285.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/253/thumb_1461496311-31461496285.jpeg"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/253/1461496311-11461496285.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/253/large_1461496311-11461496285.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/253/medium_1461496311-11461496285.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/253/small_1461496311-11461496285.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/253/thumb_1461496311-11461496285.jpeg"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/253/1461496311-41461496285.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/253/large_1461496311-41461496285.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/253/medium_1461496311-41461496285.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/253/small_1461496311-41461496285.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/253/thumb_1461496311-41461496285.jpeg"
            }
          }
        },
        "name": "Diverge DSW CEN",
        "brand": "Specialized",
        "category": 35,
        "description": "Made for all-day rides over the roughest tracks out there, the Diverge Comp DSW features exclusive welding technology that allows for the frame to be lighter and more prepared for rugged rides than its peers. It's also been built-up with the value-packed 105 groupset and hydraulic brakes.\r\n\r\nFrame Size: 61 \r\nCassette: Shimano 105, 11-speed, 11-32\r\nFork: Specialized FACT carbon \r\nBreak: Shimano BR-785, hydraulic disc\r\nTires: Specialized Roubaix Pro, 120TPI 28\r\n\r\n",
        "size": 185,
        "price_from": 27,
        "rating_average": 0.0
        , "country": "deutschland", "city": "Berlin"
      },
      {
        "id": 36,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/36/1436634312-152506_3262.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/36/large_1436634312-152506_3262.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/36/medium_1436634312-152506_3262.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/36/small_1436634312-152506_3262.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/36/thumb_1436634312-152506_3262.JPG"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/36/1436634312-152506_3263.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/36/large_1436634312-152506_3263.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/36/medium_1436634312-152506_3263.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/36/small_1436634312-152506_3263.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/36/thumb_1436634312-152506_3263.JPG"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/36/1436634312-152506_3264.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/36/large_1436634312-152506_3264.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/36/medium_1436634312-152506_3264.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/36/small_1436634312-152506_3264.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/36/thumb_1436634312-152506_3264.JPG"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/36/1436634312-152506_3268.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/36/large_1436634312-152506_3268.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/36/medium_1436634312-152506_3268.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/36/small_1436634312-152506_3268.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/36/thumb_1436634312-152506_3268.JPG"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/36/1436634312-152506_3272.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/36/large_1436634312-152506_3272.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/36/medium_1436634312-152506_3272.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/36/small_1436634312-152506_3272.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/36/thumb_1436634312-152506_3272.JPG"
            }
          }
        },
        "name": "Taiga",
        "brand": "Steppenwolf",
        "category": 31,
        "description": "Sportlicher, raceorientierter Mountainbike Rahmen. Shimano XT Ausstattung, Rock Shox Gabele. Angenehme Sitzposition und gute Fahreigenschaften besonders gut f&uuml;r längere Crosscountry Fahrten. ",
        "size": 175,
        "price_from": 14,
        "rating_average": 5.0, 
        "country": "deutschland", 
        "city": "M&uuml;nchen"
      },
      {
        "id": 34,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/34/1436632663-150207_3298.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/34/large_1436632663-150207_3298.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/34/medium_1436632663-150207_3298.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/34/small_1436632663-150207_3298.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/34/thumb_1436632663-150207_3298.JPG"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/34/1436632663-150207_3309.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/34/large_1436632663-150207_3309.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/34/medium_1436632663-150207_3309.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/34/small_1436632663-150207_3309.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/34/thumb_1436632663-150207_3309.JPG"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/34/1436632663-150207_3303.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/34/large_1436632663-150207_3303.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/34/medium_1436632663-150207_3303.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/34/small_1436632663-150207_3303.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/34/thumb_1436632663-150207_3303.JPG"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/34/1436632663-150207_3301.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/34/large_1436632663-150207_3301.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/34/medium_1436632663-150207_3301.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/34/small_1436632663-150207_3301.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/34/thumb_1436632663-150207_3301.JPG"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/34/1436632663-150207_3308.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/34/large_1436632663-150207_3308.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/34/medium_1436632663-150207_3308.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/34/small_1436632663-150207_3308.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/34/thumb_1436632663-150207_3308.JPG"
            }
          }
        },
        "name": "1998 Quantum Race",
        "brand": "Klein",
        "category": 20,
        "description": "Ein wunderschöner und extrem leichter Klassiker. Gut erhaltenes Klein Quantum Race Baujahr 1998 Rennrad mit kompletter Dura Ace Ausstattung, Syncros Vorbau und Mavic Ksyrium Elite S Laufrädern. Flite Tintanium Sattel und Look Pedale.",
        "size": 185,
        "price_from": 29,
        "rating_average": 0.0
        , "country": "deutschland", "city": "Frankfurt"
      },
      {
        "id": 77,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/77/1437600261-31437600247.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/77/large_1437600261-31437600247.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/77/medium_1437600261-31437600247.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/77/small_1437600261-31437600247.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/77/thumb_1437600261-31437600247.jpeg"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/77/1437600261-11437600247.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/77/large_1437600261-11437600247.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/77/medium_1437600261-11437600247.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/77/small_1437600261-11437600247.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/77/thumb_1437600261-11437600247.jpeg"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/77/1437600261-41437600247.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/77/large_1437600261-41437600247.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/77/medium_1437600261-41437600247.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/77/small_1437600261-41437600247.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/77/thumb_1437600261-41437600247.jpeg"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/77/1437600261-21437600247.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/77/large_1437600261-21437600247.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/77/medium_1437600261-21437600247.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/77/small_1437600261-21437600247.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/77/thumb_1437600261-21437600247.jpeg"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/77/1437600261-01437600247.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/77/large_1437600261-01437600247.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/77/medium_1437600261-01437600247.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/77/small_1437600261-01437600247.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/77/thumb_1437600261-01437600247.jpeg"
            }
          }
        },
        "name": "Ludwig",
        "brand": "Vorbauer",
        "category": 11,
        "description": "Stadt und Landrad der Marke Vorbauer, mit 5-Gang Fichtel und Sachs Kettenschaltung mit Freilauf. Verblasste Dekors und untypische Komponenten formen dieses Rad.",
        "size": 175,
        "price_from": 8,
        "rating_average": 0.0
        , "country": "deutschland", "city": "Rosenheim"
      },
      {
        "id": 272,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/272/1465656483-21465656466.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/272/large_1465656483-21465656466.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/272/medium_1465656483-21465656466.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/272/small_1465656483-21465656466.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/272/thumb_1465656483-21465656466.jpeg"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/272/1465656483-01465656466.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/272/large_1465656483-01465656466.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/272/medium_1465656483-01465656466.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/272/small_1465656483-01465656466.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/272/thumb_1465656483-01465656466.jpeg"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/272/1465656483-31465656466.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/272/large_1465656483-31465656466.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/272/medium_1465656483-31465656466.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/272/small_1465656483-31465656466.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/272/thumb_1465656483-31465656466.jpeg"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/272/1465656483-11465656466.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/272/large_1465656483-11465656466.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/272/medium_1465656483-11465656466.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/272/small_1465656483-11465656466.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/272/thumb_1465656483-11465656466.jpeg"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/272/1465656483-41465656466.jpeg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/272/large_1465656483-41465656466.jpeg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/272/medium_1465656483-41465656466.jpeg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/272/small_1465656483-41465656466.jpeg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_5/272/thumb_1465656483-41465656466.jpeg"
            }
          }
        },
        "name": "WOOM 1",
        "brand": "WOOM",
        "category": 40,
        "description": "Laufrad 12\" | 1,5-3,5 Jahre | 82-100cm | 3,5kg\r\n\r\nDas Laufrad WOOM 1 ist der ideale Partner um den ersten Kontakt zu den zwei Rädern herzustellen, die den Erlebnishorizont unserer Kleinsten wie kein anderes Spielzeug erweitert. ",
        "size": 85,
        "price_from": 7,
        "rating_average": 0.0
        , "country": "deutschland", "city": "M&uuml;nchen"
      },
      {
        "id": 659,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/659/1487247379-Brompton_H6RD__02.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/659/large_1487247379-Brompton_H6RD__02.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/659/medium_1487247379-Brompton_H6RD__02.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/659/small_1487247379-Brompton_H6RD__02.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/659/thumb_1487247379-Brompton_H6RD__02.JPG"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/659/1487247379-Brompton_H6RD__03.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/659/large_1487247379-Brompton_H6RD__03.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/659/medium_1487247379-Brompton_H6RD__03.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/659/small_1487247379-Brompton_H6RD__03.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/659/thumb_1487247379-Brompton_H6RD__03.JPG"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/659/1487247379-Brompton_H6RD__04.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/659/large_1487247379-Brompton_H6RD__04.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/659/medium_1487247379-Brompton_H6RD__04.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/659/small_1487247379-Brompton_H6RD__04.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/659/thumb_1487247379-Brompton_H6RD__04.JPG"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/659/1487247379-Brompton_H6RD__01.JPG",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/659/large_1487247379-Brompton_H6RD__01.JPG"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/659/medium_1487247379-Brompton_H6RD__01.JPG"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/659/small_1487247379-Brompton_H6RD__01.JPG"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/659/thumb_1487247379-Brompton_H6RD__01.JPG"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": null,
            "large": {
              "url": null
            },
            "medium": {
              "url": null
            },
            "small": {
              "url": null
            },
            "thumb": {
              "url": null
            }
          }
        },
        "name": "H6RD Grey",
        "brand": "Brompton",
        "category": 60,
        "description": "Brompton H6RD grey mit Vollausstattung - mit dem Brompton H-Lenker f&uuml;r bequemes, aufrechtes Fahren und f&uuml;r größere Fahrer. Das Brompton ist das ideale Fahrrad f&uuml;r alle Situationen, in denen flexible Mobilität gefragt ist.\r\n\r\n- 6 Gang-Schaltung Brompton Wide Range\r\n- Teleskopsattelst&uuml;tze f&uuml;r große Fahrer\r\n- Lichtanlage mit Shimano Nabendynamo\r\n- Einstiegshöhe: ca. 58 cm\r\n- Packmaß: 57 x 59 x 27 cm\r\n- Gewicht: 12,7 kg\r\n- Erhöhter Lenker",
        "size": 175,
        "price_from": 12,
        "rating_average": 5.0
        , "country": "deutschland", "city": "M&uuml;nchen"
      },
      {
        "id": 35,
        "user_id": 1013,
        "image_file_1": {
          "image_file_1": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/35/1436633406-LnR_how_to_photograph_your_bike_02.jpg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/35/large_1436633406-LnR_how_to_photograph_your_bike_02.jpg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/35/medium_1436633406-LnR_how_to_photograph_your_bike_02.jpg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/35/small_1436633406-LnR_how_to_photograph_your_bike_02.jpg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/35/thumb_1436633406-LnR_how_to_photograph_your_bike_02.jpg"
            }
          }
        },
        "image_file_2": {
          "image_file_2": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/35/1436633406-LnR_how_to_photograph_your_bike_01.jpg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/35/large_1436633406-LnR_how_to_photograph_your_bike_01.jpg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/35/medium_1436633406-LnR_how_to_photograph_your_bike_01.jpg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/35/small_1436633406-LnR_how_to_photograph_your_bike_01.jpg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_2/35/thumb_1436633406-LnR_how_to_photograph_your_bike_01.jpg"
            }
          }
        },
        "image_file_3": {
          "image_file_3": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/35/1436633406-LnR_how_to_photograph_your_bike_04.jpg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/35/large_1436633406-LnR_how_to_photograph_your_bike_04.jpg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/35/medium_1436633406-LnR_how_to_photograph_your_bike_04.jpg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/35/small_1436633406-LnR_how_to_photograph_your_bike_04.jpg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_3/35/thumb_1436633406-LnR_how_to_photograph_your_bike_04.jpg"
            }
          }
        },
        "image_file_4": {
          "image_file_4": {
            "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/35/1436633406-LnR_how_to_photograph_your_bike_05.jpg",
            "large": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/35/large_1436633406-LnR_how_to_photograph_your_bike_05.jpg"
            },
            "medium": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/35/medium_1436633406-LnR_how_to_photograph_your_bike_05.jpg"
            },
            "small": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/35/small_1436633406-LnR_how_to_photograph_your_bike_05.jpg"
            },
            "thumb": {
              "url": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_4/35/thumb_1436633406-LnR_how_to_photograph_your_bike_05.jpg"
            }
          }
        },
        "image_file_5": {
          "image_file_5": {
            "url": null,
            "large": {
              "url": null
            },
            "medium": {
              "url": null
            },
            "small": {
              "url": null
            },
            "thumb": {
              "url": null
            }
          }
        },
        "name": "2013 Jake the Snake",
        "brand": "Kona",
        "category": 35,
        "description": "Robuster Alu-Crosser mit Carbongabel, Shimano 105er Ausstattung und Schwalbe Marathon Bereifung. Laufruhe und angenehme Sitzposition, aber renntauglicher Ausstattung f&uuml;r Langstrecke, im Gelände oder f&uuml;r die City. ",
        "size": 175,
        "price_from": 14,
        "rating_average": 5.0
        , "country": "deutschland", "city": "Berlin"
      }
    ],
    "ratings": [
      {
        "author_id": 1744,
        "score": 5.0,
        "message": "Kommunikation und Rad&uuml;bergabe hat super gepasst. Das Rad kam in einwandfreiem Zustand zur&uuml;ck. Gerne Wieder.",
        "created_at": "2017-10-18T17:19:45.045Z",
        "author_full_name": "Norman Woltersdorf",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1744/Bildschirmfoto_2016-11-21_um_11.44.25.png"
      },
      {
        "author_id": 3619,
        "score": 5.0,
        "message": "it was a good experience to rent the brompton in Munich",
        "created_at": "2017-10-17T11:22:21.753Z",
        "author_full_name": "Stefano Palenga",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/3619/11187753_982260991784573_346730956062331739_o.jpg"
      },
      {
        "author_id": 3595,
        "score": 5.0,
        "message": "Hat trotz einer spontanen Buchung alles schnell und unkompliziert funktioniert. Gerne Wieder!",
        "created_at": "2017-09-28T14:44:05.389Z",
        "author_full_name": "Valeri Orschlet",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/3595/10885370_10204431659340267_1631264854449161786_n.jpg"
      },
      {
        "author_id": 2492,
        "score": 5.0,
        "message": "Danke Johannes f&uuml;r die Organisation des Rides und nat&uuml;rlich auch f&uuml;r die Meinung des Pradello",
        "created_at": "2017-09-25T17:39:16.575Z",
        "author_full_name": "Michael Freidank",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/2492/IMG_3879.JPG"
      },
      {
        "author_id": 1858,
        "score": 5.0,
        "message": "Danke Johannes f&uuml;r das ausleihen meines Radls.. bis zum nächsten mal ;)!",
        "created_at": "2017-07-11T18:02:06.049Z",
        "author_full_name": "Schicke M&uuml;tze",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1858/Schickem_tze_lr.jpg"
      },
      {
        "author_id": 2353,
        "score": 5.0,
        "message": "Vielen Dank f&uuml;r die nette und unkomplizierte Abwicklung! Hatte 'ne schöne Fahrt auf 'nem tollen Rad!",
        "created_at": "2017-05-20T14:43:37.653Z",
        "author_full_name": "Dominik Sacher",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/2353/IMG-20170422-WA0022.jpg"
      },
      {
        "author_id": 1917,
        "score": 5.0,
        "message": "Johannes was very friendly and returned the bike on time and in a perfect state!",
        "created_at": "2017-03-21T09:26:47.045Z",
        "author_full_name": "A-Bike Rental \u0026 Tours",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1917/abikerental_medium.png"
      },
      {
        "author_id": 1864,
        "score": 5.0,
        "message": "Alles Super ! Rad kam zum vereinbarten Termin unversehrt und gereinigt zur&uuml;ck. Gerne wieder !",
        "created_at": "2017-02-15T20:06:22.140Z",
        "author_full_name": "mallorca-on-bike Can Picafort",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1864/WP_20161006_11_00_42_Pro.jpg"
      },
      {
        "author_id": 1485,
        "score": 5.0,
        "message": null,
        "created_at": "2016-07-11T18:26:00.285Z",
        "author_full_name": "Bastian M&uuml;ller",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1485/2016-07-05_07.08.10.jpg"
      },
      {
        "author_id": 1485,
        "score": 5.0,
        "message": null,
        "created_at": "2016-07-11T18:26:00.265Z",
        "author_full_name": "Bastian M&uuml;ller",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1485/2016-07-05_07.08.10.jpg"
      },
      {
        "author_id": 1001,
        "score": 5.0,
        "message": null,
        "created_at": "2016-06-19T21:40:16.343Z",
        "author_full_name": "Moritz Hofmann",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1001/IMG_8363.png"
      },
      {
        "author_id": 1001,
        "score": 5.0,
        "message": null,
        "created_at": "2016-06-19T21:40:08.817Z",
        "author_full_name": "Moritz Hofmann",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1001/IMG_8363.png"
      },
      {
        "author_id": 1422,
        "score": 5.0,
        "message": null,
        "created_at": "2016-06-13T18:23:25.706Z",
        "author_full_name": "Martin Friedl",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1422/Zusatzgrafik-Fakten.jpg"
      },
      {
        "author_id": 1345,
        "score": 4.0,
        "message": null,
        "created_at": "2016-04-17T14:29:28.431Z",
        "author_full_name": "Velo Berlin",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1345/logo.jpg"
      },
      {
        "author_id": 1282,
        "score": 5.0,
        "message": null,
        "created_at": "2016-03-20T14:25:08.137Z",
        "author_full_name": "listnride auf der BFS",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1282/bfs_logo_square_360.png"
      },
      {
        "author_id": 1282,
        "score": 5.0,
        "message": null,
        "created_at": "2016-03-19T13:23:59.309Z",
        "author_full_name": "listnride auf der BFS",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1282/bfs_logo_square_360.png"
      },
      {
        "author_id": 1235,
        "score": 5.0,
        "message": null,
        "created_at": "2016-02-02T12:01:28.216Z",
        "author_full_name": "Moritz Hofmann",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1235/10356424_965656873446409_4606874922924615135_n.jpg"
      },
      {
        "author_id": 1235,
        "score": 5.0,
        "message": null,
        "created_at": "2016-02-02T12:01:26.958Z",
        "author_full_name": "Moritz Hofmann",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1235/10356424_965656873446409_4606874922924615135_n.jpg"
      },
      {
        "author_id": 1062,
        "score": 5.0,
        "message": null,
        "created_at": "2015-08-02T17:25:53.513Z",
        "author_full_name": "Christopher - Samstag Rad Lewis",
        "author_profile_picture": "https://listnride.s3.eu-central-1.amazonaws.com/uploads/user/profile_picture/1062/01437505123.jpeg"
      }
    ]
  },

  getLnrRides: function () {
    return lnrConstants.rides;
  }
};
