var lnrConstants = {
  env: 'production', // options: staging, production

  // shop solution for staging and production
  stagingShopUrl: "https://listnride-staging.herokuapp.com/v2/shop_solutions",
  productionShopUrl: "https://api.listnride.com/v2/shop_solutions",

  // users for staging and production
  staging_users: "https://listnride-staging.herokuapp.com/v2/users/",
  production_users: "https://api.listnride.com/v2/users/",

  // root url for svg files
  svgUrlRoot: 'https://s3.eu-central-1.amazonaws.com/listnride-cdn/icons/biketype_',

  lnrStyles: "https://s3.eu-central-1.amazonaws.com/listnride-cdn/lnr-shop-integration.min.css",
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
