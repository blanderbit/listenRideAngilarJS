module.exports = function () {
    var path = {
        index: 'index.html',
        nodeModules: '/node_modules/**/*.js',
        app: {
            root: './app/',
            constant: 'app.constants.js',
            index: 'index.html',
            templates: './app/modules/**/*.html',
            serviceTemplate: './app/services/**/*.html',
            js: '/app/**/*.js',
            images: './app/assets/ui_images/**/*',
            icons: './app/assets/ui_icons/**/*',
            requests: 'app/modules/requests/',
            api: './app/services/api/',
            i18n: './app/i18n/**/*',
            fonts: 'node_modules/font-awesome/fonts/*'
        },
        js: ['./app/*.js', './app/**/*.js', '!**/*test.js'],
        vendors: ['node_modules/angular/angular.min.js',
            'node_modules/angular-animate/angular-animate.min.js'
        ],
        all: ['./app/**/*.html', './*.html', './libs/css/*.css', './app/*.js', './app/**/*.js', './app/**/!*test.js'],
        dist: {
            root: './dist/',
            app: './dist/app.min.js',
            index: './dist/index.html',
            templatesCache: './dist/**/*.tpl.min.js',
            images: './dist/app/assets/ui_images',
            icons: './dist/app/assets/ui_icons',
            manifest: './dist/rev-manifest.json',
            fonts: './dist/app/assets/fonts/',
            js: './dist/*.min.js',
            css: './dist/**/.min.css',
            i18n: './dist/app/i18n'
        },
        embed: {
            css: './js_modules/lnr-embed/lnr-embed.css',
            js: './js_modules/lnr-embed/lnr-embed.js'
        }
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
                    userEndpoint: 'https://listnride-staging.herokuapp.com/v2/users/'
                }
            }
        },
        staging: {
            context: {
                name: 'listnride'
            },
            uglify: false,
            constants: {
                ENV: {
                    name: 'listnride',
                    html5Mode: true,
                    apiEndpoint: 'https://listnride-staging.herokuapp.com/v2',
                    userEndpoint: 'https://listnride-staging.herokuapp.com/v2/users/'
                }
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
                    userEndpoint: 'https://api.listnride.com/v2/users/'
                }
            }
        }
    };
    return {
        path: path,
        environments: environments
    };
}