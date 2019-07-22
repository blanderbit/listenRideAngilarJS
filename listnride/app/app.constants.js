import * as config from './configurationValues';

angular
  .module('listnride.constant', [])
  .constant('ENV', {
    name: 'listnride',
    html5Mode: config.HTML_5_MODE,
    apiEndpoint: config.API_ENDPOINT,
    userEndpoint: config.USER_ENDPOINT,
    webappUrl: config.WEBAPP_URL,
    defaultTranslation: 'default',
    staticTranslation: 'static',
    btKey: config.API_KEY_BRAINTREE,
    facebookPlatformKey: config.API_KEY_FACEBOOK_PLATFORM,
    brainTreeEnv: config.API_BRAINTREE_ENV,
    googleMapsKey: config.API_KEY_GOOGLE_MAPS
  })
  .constant('MESSAGE_STATUSES', {
    REQUESTED: 1, // Rider requested your Ride ACCEPT / REJECT || You requested a Ride
    ACCEPTED: 2, // You accepted the Request || Lister accepted your Request CONFIRM / CANCEL
    CONFIRMED: 3, // Ride confirmed and will rent ride CONFIRM RETURN || You confirmed and will rent a ride
    ONE_SIDE_RATE: 4, // Lister confirmed return || Rider leaves rate
    BOTH_SIDES_RATE: 5, // Lister and Rider rates each other || Rental complete
    RATE_RIDE: 6, // Rider rated lister || Rental complete # Will be skipped
    COMPLETE: 7, // Rental complete
    LISTER_CANCELED: 8, // Lister cancelled
    RIDER_CANCELED: 9, // Rider cancelled
    SYSTEM_CANCELED: 10, // Passed due date
    MANUALLY_CANCELED: 11 // Canceled manually by us because of various reasons
  });
