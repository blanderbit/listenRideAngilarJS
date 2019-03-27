import * as config from './configurationValues';

angular.module('listnride.constant', [])
  .constant('ENV', {
    name: 'listnride',
    html5Mode: config.HTML_5_MODE,
    apiEndpoint: config.API_ENDPOINT,
    userEndpoint: config.USER_ENDPOINT,
    webappUrl: config.WEBAPP_URL,
    defaultTranslation: 'default',
    staticTranslation: 'static',
    btKey: config.API_KEY_BRAINTREE,
    facebookPlatformKey: config.API_KEY_FACEBOOK_PLATFORM
  });
