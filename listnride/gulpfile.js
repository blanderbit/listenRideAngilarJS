var del = require('del');
var gulp = require('gulp');
var config = require('./gulp.config.js')();
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var argv = require('yargs').argv;
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var uglify = require('gulp-uglifyjs');
var imagemin = require('gulp-imagemin');
var stylish = require('jshint-stylish');
var minifyCss = require('gulp-clean-css');
var runSequence = require('run-sequence');
var revReplace = require('gulp-rev-replace');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var templateCache = require('gulp-angular-templatecache');

var path = config.path;
var environments = config.environments;
var argvEnv = ('local' === argv.env || 'staging' === argv.env || 'production' === argv.env) ? argv.env : 'staging'
var env = environments[argvEnv];

// eslint through all js files
gulp.task('lint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// inject template cache files in index.html
// modules.tpl.min.js and services.tpl.min.js reference in index
gulp.task('inject-templates-modules', function () {
    return gulp.src(path.dist.index)
        .pipe(inject(gulp.src(path.dist.templatesCache, {
            read: false
        }), {
            relative: true,
            removeTags: true
        }))
        .pipe(gulp.dest(path.dist.root));
});

// create templates.js file to serve all html files
// js cache of html from module folder
gulp.task('cache-templates-modules', function () {
    return gulp.src(path.app.templates)
        .pipe(templateCache('modules.tpl.min.js', {
            root: 'app/modules/',
            module: 'listnride'
        }))
        .pipe(gulp.dest(path.dist.root));
});

// create templates.js file to serve all html files
// js cache of html from services folder
gulp.task('cache-templates-services', function () {
    return gulp.src(path.app.serviceTemplate)
        .pipe(templateCache('services.tpl.min.js', {
            root: 'app/services/',
            module: 'listnride'
        }))
        .pipe(gulp.dest(path.dist.root));
});

// copy original index file to tmp folder
// preserves the original file
gulp.task('copy-index-tmp', function () {
    return gulp.src(path.index)
        .pipe(gulp.dest('.tmp'));
});

// copy new referenced index file to dist
// index file with new references to dist folder
gulp.task('copy-index-dist', function () {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist/'));
});

// copy original index file back to app
// restore original index from .tmp
gulp.task('copy-index-app', function () {
    return gulp.src('.tmp/index.html')
        .pipe(gulp.dest('./'));
});

// concat all vendors files, js and css
// minify and uglify vendors files
gulp.task('vendors', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif(path.app.js, uglify()))
        .pipe(gulpif(path.nodeModules, uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(path.dist.root));
});

// concat all development js files - local
// minify and uglify development files
gulp.task('scripts-deploy', function () {
    return gulp.src(path.dist.app)
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(path.dist.root))
        .pipe(uglify('app.min.js'))
        .pipe(gulp.dest(path.dist.root));
});

// copy i18n to dist folder
gulp.task('copy-i18n', function () {
    return gulp.src(path.app.i18n)
        .pipe(gulp.dest(path.dist.i18n));
});

// copy fonts to dist folder
gulp.task('copy-fonts', function () {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

// optimize png images
// loseless compression
gulp.task('images-png', function () {
    return gulp.src(path.app.images)
        .pipe(imagemin({
            progressive: true,
            plugins: [
                imagemin.optipng({
                    optimizationLevel: 7,
                    bitDepthReduction: true,
                    colorTypeReduction: true
                })
            ]
        }))
        .pipe(gulp.dest(path.dist.images))
});

// optimize svg images
// loseless compression
gulp.task('images-svg', function () {
    return gulp.src(path.app.icons)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.svgo()]
        }))
        .pipe(gulp.dest(path.dist.icons))
});

gulp.task('constants', function () {
    return ngConstant({
            wrap: false,
            constants: env.constants,
            name: env.context.name + '.constant',
            stream: true,
        })
        .pipe(rename('app.constants.js'))
        .pipe(gulp.dest(path.app.root));
});

// copy fonts to dist folder
gulp.task('copy-fonts', function () {
    return gulp.src(['node_modules/font-awesome/fonts**/*'])
        .pipe(gulp.dest('dist/app/assets'));
});

// clean dist folder
// before every deployment
gulp.task('clean', function (cb) {
    var cleanFiles = [path.dist.root, 'app/app.min.js'];
    return del(cleanFiles, cb);
});

// clean extra folders 
// with every deployment - files with revisions are used instead
gulp.task('clean-extras', function (cb) {
    var cleanFiles = [
        'dist/assets',
        'dist/app/index.html',
        'dist/app/vendors.min.js',
        'dist/app.min.js',
        'dist/modules.tpl.min.js',
        'dist/services.tpl.min.js',
        'dist/vendors.min.js',
        'dist/rev-manifest.json',
        '.tmp'
    ];
    return del(cleanFiles, cb);
});

// after every deploy
// DO NOT USE IN DEV ENVIRONMENT
gulp.task('clean-extras-local', function (cb) {
    var cleanFiles = ('local' !== argvEnv) ?
        ['app', 'node_modules', 'js_modules', 'angular-material-minimal'] :
        [];
    return del(cleanFiles, cb);
});

// required for deploy
// because app.min.js is at same level with index.html in deployment
// while in local env, app.min.js and index are at d/f levels
// TODO: app.min.js and index.html should be at same level in local env
gulp.task('changes-in-index', function () {
    return gulp.src(['dist/index.html'])
        .pipe(replace('app/app.min.js', 'app.min.js'))
        .pipe(gulp.dest(path.dist.root));
});

// watch changes in js files, used for local development
gulp.task('watch', function () {
    gulp.watch(paths.alljs, ['lint', 'clean', 'scripts']);
});

// svg and png 
gulp.task('images', [
    'images-svg',
    'images-png'
]);

// generate revisions of js files
// to invalidate browser cache on deployment
gulp.task('revisions', function () {
    return gulp.src([path.dist.js, path.dist.css])
        .pipe(gulp.dest(path.dist.root))
        .pipe(rev())
        .pipe(gulp.dest(path.dist.root))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.dist.root))
});

// replace revision in index file
// replace js files references in index with revisions
gulp.task('replace-revisions-index', function () {
    var manifest = gulp.src(path.dist.manifest);
    return gulp.src(path.dist.index)
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest(path.dist.root));
});

// our js file which is used to embed bikes in other sites.
gulp.task('embed', function () {

    gulp.src(path.embed.css)
        .pipe(concat('lnr-embed.min.css'))
        .pipe(gulp.dest(path.dist.root));

    return gulp.src(path.embed.js)
        .pipe(concat('lnr-embed.min.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(path.dist.root))
        .pipe(uglify('lnr-embed.min.js'))
        .pipe(gulp.dest(path.dist.root));

});
// tasks for deployment
// DO NOT CHANGE THE SEQUENCE - SYNCHRONOUS COMMANDS
// CHANGING THE SEQUENCE WILL MAKE YOU SLEEPLESS
// DO NOT RUN IN LOCAL ENVIRONMENT
gulp.task('deploy', function (cb) {
    runSequence(
        'clean',
        'constants',
        'copy-index-tmp',
        'cache-templates-modules',
        'cache-templates-services',
        'images',
        'copy-fonts',
        'vendors',
        'scripts-deploy',
        'inject-templates-modules',
        'copy-index-app',
        'copy-i18n',
        'changes-in-index',
        'revisions',
        'replace-revisions-index',
        'embed',
        'clean-extras',
        'clean-extras-local',
        cb);
});

// tasks for local development
gulp.task('local', function (cb) {
    runSequence(
        'lint',
        'clean',
        'scripts-local',
        'images',
        'watch',
        cb)
});

// by default - local environment
gulp.task('default', ['local']);