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
    googleMapsKey: config.API_KEY_GOOGLE_MAPS,
    adyen_origin_key: config.ADYEN_ORIGIN_KEY,
    adyen_env: config.ADYEN_ENV,
    googleRecaptchaPublicKey: config.API_KEY_RECAPTCHA_PUBLIC,
    adyen_origin_key_com: config.ADYEN_ORIGIN_KEY_COM,
    adyen_origin_key_de: config.ADYEN_ORIGIN_KEY_DE,
    adyen_origin_key_nl: config.ADYEN_ORIGIN_KEY_NL,
    adyen_origin_key_es: config.ADYEN_ORIGIN_KEY_ES,
    adyen_origin_key_it: config.ADYEN_ORIGIN_KEY_IT,
    adyen_origin_key_fr: config.ADYEN_ORIGIN_KEY_FR,
    adyen_origin_key_at: config.ADYEN_ORIGIN_KEY_AT
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
    MANUALLY_CANCELED: 11, // Canceled manually by us because of various reasons
    PAYMENT_FAILED: 12, // Rider tried to pay with his payment method and it failed with any reason (bank, no money, wrong 3dsecure code)
    WAITING_FOR_CAPTURE: 13 // Adyen created a request to rider bank account to charge money
  })
  .constant('PAYMENT_STATUSES', {
    REQUIRED: 1, // Waiting for money freeze, can be stack only with our server error
    REDIRECTED: 2, // Redirected for 3d secure code, will be automatically moved to failed after 30 minutes waiting
    AUTHORIZED: 3, // Money is freezed
    APPROVED: 4, // Transaction captured || Not credit card payment method
    FAILED: 5, // Error happend, equal to PAYMENT_FAILED in MESSAGE.STATUSES
    WAITING_FOR_CAPTURE: 6, // Adyen created a request to rider bank account to charge money
  });
