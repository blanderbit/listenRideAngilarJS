module.exports = function () {
    var path = {
        index: 'index.html',
        nodeModules: '/node_modules/**/*.js',
        app: {
            root: './app/',
            module: '.app/modules/',
            base: '<base href="/">',
            constant: 'app.constants.js',
            index: './index.html',
            templates: './app/modules/**/*.html',
            serviceTemplate: './app/services/**/*.html',
            js: ['./app/*.js', './app/**/*.js', '!**/*test.js'],
            appjs: 'app/app.min.js',
            images: './app/assets/ui_images/**/*',
            icons: './app/assets/ui_icons/**/*',
            requests: 'app/modules/requests/',
            api: './app/services/api/',
            i18n: './app/i18n/**/*',
            fonts: 'node_modules/font-awesome/fonts/*',
            momentjs: 'node_modules/moment/**/*',
            downloadables: './app/assets/downloads/*',
            js_modules: './js_modules/**/*'
        },
        js: ['./app/*.js', './app/**/*.js', '!**/*test.js'],
        vendors: ['node_modules/angular/angular.min.js',
            'node_modules/angular-animate/angular-animate.min.js'
        ],
        all: ['./app/**/*.html', './*.html', './libs/css/*.css', './app/*.js', './app/**/*.js', './app/**/!*test.js'],
        dist: {
            root: './dist/',
            app: './dist/app.min.js',
            vendors: './dist/vendors.min.js',
            index: './dist/index.html',
            templatesCache: './dist/**/*.tpl.min.js',
            images: './dist/app/assets/ui_images',
            icons: './dist/app/assets/ui_icons',
            manifest: './dist/rev-manifest.json',
            fonts: './dist/app/assets/fonts/',
            js: './dist/*.min.js',
            source: 'app.min.js',
            sourceVendors: 'vendors.min.js',
            css: './dist/**/.min.css',
            i18n: './dist/app/i18n',
            js_modules: './dist/lnr-wizard-module/',
            moment: './dist/lnr-wizard-module/moment',
            lnrShopSolution: './dist/lnr-shop-solution'
        },
        lnrShopIntegration: {
            root: './js_modules/lnr-shop-integration/',
            style: 'lnr-shop-integration.css',
            css: [
                './js_modules/lnr-shop-integration/styles/lnr-shop-integration.css',
                './js_modules/lnr-shop-integration/styles/lnr-shop-integration.vendor.css'
            ],
            lnrCss: './js_modules/lnr-shop-integration/styles/lnr-shop-integration.css',
            html: './js_modules/lnr-shop-integration/lnr-shop-integration.html',
            source: 'lnr-shop-integration.js',
            prefix: '#listnride',
            js: [
                './js_modules/lnr-shop-integration/scripts/lnr-shop-integration.constants.js',
                './js_modules/lnr-shop-integration/scripts/lnr-shop-integration.helper.js',
                './js_modules/lnr-shop-integration/scripts/lnr-shop-integration.js',
                './js_modules/lnr-shop-integration/scripts/lnr-shop-integration.jquery.js',
                './js_modules/lnr-shop-integration/scripts/lnr-shop-integration.vendor.js'
            ],
            dist: {
                root: './js_modules/lnr-shop-integration/dist/',
                oldJs: './js_modules/lnr-shop-integration/dist/lnr-embed.min.js',
                oldSource: 'lnr-embed.min.js',
                js: './js_modules/lnr-shop-integration/dist/lnr-shop-integration.min.js',
                html: './js_modules/lnr-shop-integration/dist/lnr-shop-integration.min.html',
                source: 'lnr-shop-integration.min.js',
                style: './js_modules/lnr-shop-integration/dist/lnr-shop-integration.min.css',
                css: 'lnr-shop-integration.min.css'
            },
        },
        lnrShopSolution: {
            root: './js_modules/lnr-shop-solution/',
            html: './js_modules/lnr-shop-solution/lnr-shop-solution.html',
            js: './js_modules/lnr-shop-solution/**/*.js',
            css: [
                './js_modules/lnr-shop-solution/styles/lnr-shop-solution.css',
                './js_modules/lnr-shop-solution/styles/daterangepicker.css'
            ],
            resource: [
                './js_modules/lnr-shop-solution/resources/lnr_logo_bold.svg'
            ],
            dist: {
                root: './js_modules/lnr-shop-solution/dist/',
                js: 'lnr-shop-solution.min.js',
                css: 'lnr-shop-solution.min.css',
                source: './js_modules/lnr-shop-solution/dist/lnr-shop-solution.min.js',
                style: './js_modules/lnr-shop-solution/dist/lnr-shop-solution.min.css',
                html: './js_modules/lnr-shop-solution/dist/lnr-shop-solution.html'
            }
        },
        filesToBeCleaned: [
            'dist/assets',
            'dist/app/index.html',
            'dist/app/vendors.min.js',
            'dist/app.min.js',
            'dist/modules.tpl.min.js',
            'dist/services.tpl.min.js',
            'dist/vendors.min.js',
            'dist/rev-manifest.json',
            '.tmp'
        ],
        filesToBeCleanedProduction: ['app',
            'node_modules',
            'js_modules',
            'angular-material-minimal'],
        watchers: ['lint',
            'clean',
            'scripts'
        ]
    };
    var environments = {
        local: {
            context: {
                name: 'listnride'
            },
            uglify: false,
            constants: {
                ENV: {
                    name: 'listnride',
                    html5Mode: false,
                    apiEndpoint: 'https://listnride-staging.herokuapp.com/v2',
                    userEndpoint: 'https://listnride-staging.herokuapp.com/v2/users/',
                    webappUrl: "http://www.staging.listnride.com"
                }
            },
            imageOptions: {
                optimizationLevel: 7,
                bitDepthReduction: true,
                colorTypeReduction: true
            }
        },
        staging: {
            context: {
                name: 'listnride'
            },
            uglify: true,
            constants: {
                ENV: {
                    name: 'listnride',
                    html5Mode: true,
                    apiEndpoint: 'https://listnride-staging.herokuapp.com/v2',
                    userEndpoint: 'https://listnride-staging.herokuapp.com/v2/users/',
                    webappUrl: "http://www.staging.listnride.com"
                }
            },        
            imageminOptions: {
                optimizationLevel: 7,
                bitDepthReduction: true,
                colorTypeReduction: true
            }
        },
        production: {
            context: {
                name: 'listnride'
            },
            uglify: true,
            constants: {
                ENV: {
                    name: 'listnride',
                    html5Mode: true,
                    apiEndpoint: 'https://api.listnride.com/v2',
                    userEndpoint: 'https://api.listnride.com/v2/users/',
                    webappUrl: "http://www.listnride.com"
                }
            },
            imageminOptions: {
                optimizationLevel: 7,
                bitDepthReduction: true,
                colorTypeReduction: true
            }
        }
    };
    return {
        path: path,
        environments: environments
    };
};
