var lnrConstants = {
  // environments: staging, production
  env: 'production',
  version: '?1.010',
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
    "local": "dist/lnr-shop-integration_staging.min.css",
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
      "en": "All locations",
      "de": "Alle Standorte",
      "nl": "Alle locaties",
      "selected": {}
    },
    allSizes: {
      "en": "All sizes",
      "de": "Alle Gr&ouml;&szlig;en",
      "nl": "Alle maten",
      "selected": {}
    },
    unisize: {
      "en": "Unisize",
      "de": "Unisize",
      "nl": "Unisize",
      "selected": {}
    }
  },
  translations: {
    "en": {
      "statuses": {
        "variants_available": "Variants available"
      },
      "all-brands": "All Brands",
      "all-categories": "All categories"
    },
    "de": {
      "statuses": {
        "variants_available": "Varianten verf&uuml;gbar"
      },
      "all-brands": "Alle Marken",
      "all-categories": "All categories"
    },
    "nl": {
      "statuses": {
        "variants_available": "Varianten beschikbaar"
      },
      "all-brands": "Alle merken",
      "all-categories": "All categories"
    },
    "it": {
      "statuses": {
        "variants_available": "Varianti disponibili"
      },
      "all-brands": "Tutte le marche",
      "all-categories": "All categories"
    },
    "es": {
      "statuses": {
        "variants_available": "Variantes disponibles"
      },
      "all-brands": "Todas las marcas",
      "all-categories": "All categories"
    },
  },
  // map of the categories for en, de and nl languages
  subCategory: {
    // subcategory - english
    en: {
      // URBAN
      10: "City Bike",
      11: "Dutch Bike",
      12: "Single Speed Bike",
      // E-BIKE
      20: "E-City Bike",
      21: "E-Touring Bike",
      22: "E-Cargo Bike",
      23: "E-Mountain Bike",
      24: "E-Road Bike",
      25: "E-Folding Bike",
      26: "E-Scooter",
      // ROAD
      30: "Road Bike",
      31: "Triathlon Bike",
      32: "Touring Bike",
      33: "Fixed Gear Bike",
      // ALL-TERRAIN
      40: "MTB Hardtail",
      41: "MTB Fullsuspension",
      42: "Cyclocross Bike",
      43: "Gravel Bike",
      // TRANSPORT
      50: "Cargo Bike",
      51: "Bike Trailer",
      52: "Bike Child Seat",
      53: "Bike Car Rack",
      54: "Bike Travel Bag",
      55: "Event Bike",
      // KIDS
      60: "City Bike",
      61: "All Terrain Bike",
      62: "Road Bike",
      63: "Bogie Wheel",
      // SPECIAL
      70: "Folding Bike",
      71: "Recumbent Bike",
      72: "Tandem Bike",
      73: "Longtail Bike",
      74: "Scooter"
    },
    // subcategory - german
    de: {
      // URBAN
      10: "Stadtrad",
      11: "Hollandrad",
      12: "Single-Speed-Rad",
      // E-BIKE
      20: "E-City-Rad",
      21: "E-Touringrad",
      22: "E-Cargo-Rad",
      23: "E-Mountainbike",
      24: "E-Rennrad",
      25: "E-Faltrad",
      26: "E-Roller",
      // ROAD
      30: "Rennrad",
      31: "Triathlonrad",
      32: "Touringrad",
      33: "Fixed-Gear-Rad",
      // ALL-TERRAIN
      40: "MTB Hardtail",
      41: "MTB Fullsuspension",
      42: "Cyclocross-Rad",
      43: "Gravel-Rad",
      // TRANSPORT
      50: "Lastenrad",
      51: "Radanhänger",
      52: "Kinderfahrradsitz",
      53: "Fahrradträger Auto",
      54: "Fahrrad-Transporttasche",
      55: "Event Bike",
      // KIDS
      60: "Stadtrad",
      61: "Mountainbike",
      62: "Rennrad",
      63: "Laufrad",
      // SPECIAL
      70: "Faltrad",
      71: "Liegerad",
      72: "Tandem",
      73: "Longtail-Rad",
      74: "Roller"
    },
    // subcategory - dutch
    nl: {
      // URBAN
      10: "Stadsfiets",
      11: "Omafiets",
      12: "Single Speed Fiets",
      // E-BIKE
      20: "E-stadsfiets",
      21: "E-Touring Fiets",
      22: "E-Bakfiets",
      23: "E-mountainbike",
      24: "E-racefiets",
      25: "E-vouwfiets",
      26: "E-Step",
      // ROAD
      30: "Racefiets",
      31: "Triatlonfiets",
      32: "Touringfiets",
      33: "Baanfiets",
      // ALL-TERRAIN
      40: "MTB Hardtail",
      41: "MTB Fullsuspension",
      42: "CX-fiets",
      43: "Gravel Bike",
      // TRANSPORT
      50: "Bakfiets",
      51: "Fietsaanhanger",
      52: "kinderzitje",
      53: "Fietsendragers",
      54: "Fietskoffer",
      55: "Eventfietsen",
      // KIDS
      60: "Stadsfiets",
      61: "ATB-fiets",
      62: "Racefiets",
      63: "Monofiets",
      // SPECIAL
      70: "vouwfiets",
      71: "Ligfiets",
      72: "Tandemfiets",
      73: "Longtail-fiets",
      74: "Step"
    }
  },
  // initialize rides, id and language for all users
  defaultRideSizes: [155, 165, 175, 185, 195],
  sizes: {},
  rides: {},
  userId: {},
  userLang: {},
  defaultFilterLabel: {
    'brand': 'all-brands',
    'category': 'all-categories'
  },
  // style for disabling a dropdown element
  disabledButtonCss: {
    "pointer-events": "none",
    "color": "#c6c6c6"
  },
  // compatibility mode for old users
  isSingleUserMode: false
};
