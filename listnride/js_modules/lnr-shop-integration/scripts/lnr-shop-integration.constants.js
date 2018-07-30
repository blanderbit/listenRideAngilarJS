var lnrConstants = {
  // environments: staging, production
  env: 'production',
  version: '?1.007',
  // shop solution for staging and production
  shopUrl: {
    "staging": {
      "en": "https://www.staging.listnride.com/booking",
      "de": "https://www.staging.listnride.de/booking",
      "nl": "https://www.staging.listnride.nl/booking",
      "es": "https://www.staging.listnride.es/booking",
      "it": "https://www.staging.listnride.it/booking"
    },
    "production": {
      "en": "https://www.listnride.com/booking",
      "de": "https://www.listnride.de/booking",
      "nl": "https://www.listnride.nl/booking",
      "es": "https://www.listnride.es/booking",
      "it": "https://www.listnride.it/booking"
    }
  },
  // users for staging and production
  users: {
    "staging": "https://listnride-staging.herokuapp.com/v2/users/",
    "production": "https://api.listnride.com/v2/users/"
  },
  // root url for svg files
  svgUrlRoot: 'https://s3.eu-central-1.amazonaws.com/listnride-cdn/icons/biketype_',
  // local, staging and production styles
  lnrStyles: {
    "local": "styles/lnr-shop-integration.css",
    "staging": "https://s3.eu-central-1.amazonaws.com/listnride-cdn/lnr-shop-integration_staging.min.css",
    "production": "https://s3.eu-central-1.amazonaws.com/listnride-cdn/lnr-shop-integration.min.css"
  },
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
    allLocations: {
      "en": 'All locations',
      "de": 'Alle Standorte',
      "nl": 'Alle locaties',
      "selected": {}
    },
    allSizes: {
      "en": 'All sizes',
      "de": 'Alle Gr&ouml;&szlig;en',
      "nl": 'Alle maten',
      "selected": {}
    }
  },
  // map of the categories for en, de and nl languages
  subCategory: {
    // subcategory - english
    en: {
      "1": [
        "Dutch Bike",
        "Touring Bike",
        "Fixed Gear Bike",
        "Single Speed Bike",
        "City Bike"
      ],
      "2": [
        "Road Bike",
        "Triathlon",
        "Indoor",
        "E-City Bike",
        "E-Touring Bike",
        "E-Cargo Bike",
        "E-Mountain Bike",
        "E-Road Bike",
        "E-Folding Bike",
        "E-Scooter"
      ],
      "3": [
        "Trekking",
        "Enduro",
        "Freeride",
        "Cross Country",
        "Downhill",
        "Cyclocross",
        "Road Bike",
        "Triathlon Bike",
        "Touring Bike",
        "Fixed Gear Bike"
      ],
      "4": [
        "City",
        "All Terrain",
        "Road",
        "MTB Hardtail",
        "MTB Fullsuspension",
        "Cyclocross Bike",
        "Gravel Bike"
      ],
      "5": [
        "Pedelec",
        "E-Bike",
        "Cargo Bike",
        "Bike Trailer",
        "Bike Child Seat",
        "Bike Car Rack",
        "Bike Travel Bag"
      ],
      "6": [
        "Folding Bike",
        "Tandem",
        "Cruiser",
        "Cargo Bike",
        "Recumbent",
        "Mono Bike",
        "Trailer",
        "City Bike",
        "All Terrain Bike",
        "Road Bike",
        "Bogie Wheel"
      ],
      "7": [
        "Folding Bike",
        "Recumbent Bike",
        "Tandem Bike",
        "Longtail Bike",
        "Scooter"
      ]
    },
    // subcategory - german
    de: {
      "1": [
        "Hollandrad",
        "Touringrad",
        "Fixed-Gear-Rad",
        "Single-Speed-Rad",
        "Stadtrad"
      ],
      "2": [
        "Rennrad",
        "Triathlonrad",
        "Bahnrad",
        "E-City-Rad",
        "E-Touringrad",
        "E-Cargo-Rad",
        "E-Mountainbike",
        "E-Rennrad",
        "E-Faltrad",
        "E-Roller"
      ],
      "3": [
        "Trekking",
        "Enduro",
        "Freeride",
        "Cross Country",
        "Downhill",
        "Cyclocross",
        "Rennrad",
        "Triathlonrad",
        "Touringrad",
        "Fixed-Gear-Rad"
      ],
      "4": [
        "Stadt",
        "Gelände",
        "Strasse",
        "MTB Hardtail",
        "MTB Fullsuspension",
        "Cyclocross-Rad",
        "Gravel-Rad"
      ],
      "5": [
        "Pedelec",
        "E-Bike",
        "Lastenrad",
        "Radanhänger",
        "Kinderfahrradsitz",
        "Fahrradträger Auto",
        "Fahrrad-Transporttasche"
      ],
      "6": [
        "Faltrad",
        "Tandem",
        "Cruiser",
        "Lastenrad",
        "Liegerad",
        "Einrad",
        "Anhänger",
        "Stadtrad",
        "Mountainbike",
        "Rennrad",
        "Laufrad"
      ],
      "7": [
        "Faltrad",
        "Liegerad",
        "Tandem",
        "Longtail-Rad",
        "Roller"
      ]
    },
    // subcategory - dutch
    nl: {
      "1": [
        "Omafiets",
        "Touringfiets",
        "Fixie",
        "Single Speed Fiets",
        "Stadsfiets"
      ],
      "2": [
        "Racefiets",
        "Triathlon",
        "Baanfiets",
        "E-stadsfiets",
        "E-Touring Fiets",
        "E-Bakfiets",
        "E-mountainbike",
        "E-racefiets",
        "E-vouwfiets",
        "E-Step"
      ],
      "3": [
        "Trekking",
        "Enduro",
        "Freeride",
        "Cross Country",
        "Downhill",
        "Cyclocross",
        "Racefiets",
        "Triatlonfiets",
        "Touringfiets",
        "Baanfiets"
      ],
      "4": [
        "Stad",
        "All-terrain",
        "race",
        "MTB Hardtail",
        "MTB Fullsuspension",
        "CX-fiets",
        "Gravel Bike"
      ],
      "5": [
        "Speed Pedelec",
        "Elektrische fiets",
        "Bakfiets",
        "Fietsaanhanger",
        "kinderzitje",
        "Fietsendragers",
        "Fietskoffer"
      ],
      "6": [
        "vouwfiets",
        "Tandem",
        "Cruiser",
        "transportfiets",
        "Ligfiets",
        "Eenwieler",
        "Aanhangwagen",
        "Stadsfiets",
        "ATB-fiets",
        "Racefiets",
        "Monofiets"
      ],
      "7": [
        "vouwfiets",
        "Ligfiets",
        "Tandemfiets",
        "Longtail-fiets",
        "Step"
      ]
    }
  },
  // initialize rides, id and language for all users
  defaultRideSizes: [155, 165, 175, 185, 195],
  sizes: {},
  rides: {},
  userId: {},
  userLang: {},
  // style for disabling a dropdown element
  disabledButtonCss: {
    "pointer-events": "none",
    "color": "#c6c6c6"
  },
  // compatibility mode for old users
  isSingleUserMode: false
};
