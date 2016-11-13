// <!-- build:js dist/vendors.min.js -->
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var inject = require('gulp-inject');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglifyjs');
var del = require('del');
var header = require('gulp-header');
var ngAnnotate = require('gulp-ng-annotate');
var stylish = require('jshint-stylish');
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-clean-css');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');

// commonly used paths
var paths = {
    app: './',
    js: ['./app/*.js', './app/**/*.js', '!**/*test.js'],
    vendors: ['node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js'],
    all: ['./app/**/*.html', './*.html', './libs/css/*.css', './app/*.js', './app/**/*.js', './app/**/!*test.js']
};

gulp.task('inject-templates-modules', function () {
    return gulp.src('dist/index.html')
        .pipe(inject(gulp.src('dist/**/*.tpl.min.js', { read: false }), { relative: true }))
        .pipe(gulp.dest('dist'));
});

// eslint through all js files
gulp.task('lint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// create templates.js file to serve all html files
gulp.task('cache-templates-modules', function () {
    return gulp.src('./app/modules/**/*.html')
        .pipe(templateCache('modules.tpl.min.js', {
            root: 'app/modules/',
            module: 'listnride'
        }))
        .pipe(gulp.dest('./dist/'));
});

// create templates.js file to serve all html files
gulp.task('cache-templates-services', function () {
    return gulp.src('./app/services/**/*.html')
        .pipe(templateCache('services.tpl.min.js', {
            root: 'app/services/',
            module: 'listnride'
        }))
        .pipe(gulp.dest('./dist/'));
});

// copy original index file to tmp folder
gulp.task('copy-index-tmp', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('.tmp'));
});

// copy new referenced index file to dist
gulp.task('copy-index-dist', function () {
    return gulp.src('./app/ndex.html')
        .pipe(gulp.dest('./dist/'));
});

// copy original index file back to app
gulp.task('copy-index-app', function () {
    return gulp.src('.tmp/index.html')
        .pipe(gulp.dest('./'));
});

// concat all vendors files, js and css
gulp.task('vendors', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist/'));
});

// concat all development js files
gulp.task('scripts', function () {
    var headerValue = '//Evaluated by gulp.\n';
    return gulp.src(paths.js)
        .pipe(concat('app.min.js'))
        .pipe(header(headerValue))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify('app.min.js'))
        .pipe(header(headerValue))
        .pipe(gulp.dest('./dist/'));
});

// copy i18n to dist folder
gulp.task('copy-i18n', function () {
    return gulp.src(['./app/i18n/**/*'])
        .pipe(gulp.dest('./dist/i18n'));
});

// optimize png images
gulp.task('images-png', function () {
    return gulp.src('./app/assets/ui_images/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.gifsicle()]
        }))
        .pipe(gulp.dest('dist/assets/ui_images'))
});

// optimize svg images
gulp.task('images-svg', function () {
    return gulp.src('./app/assets/ui_icons/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.svgo()]
        }))
        .pipe(gulp.dest('dist/assets/ui_icons'))
});

// clean dist folder
gulp.task('clean', function (cb) {
    var cleanFiles = ['dist'];
    return del(cleanFiles, cb);
});

// clean app and node_modules folders for deployment
gulp.task('clean-app-folder', function (cb) {
    var cleanFiles = ['app', 'node_modules', 'js_modules', '.tmp']; 
    return del(cleanFiles, cb);
});

// watch changes in js files, used for local development
gulp.task('watch', function () {
    gulp.watch(paths.alljs, ['lint', 'scripts']);
});

// svg and png 
gulp.task('images', [
    'images-svg',
    'images-png'
]);

// tasks for deployment
gulp.task('deploy', function (cb) {
    runSequence(
        'clean',
        'copy-index-tmp',
        'cache-templates-modules',
        'cache-templates-services',
        'images',
        'scripts',
        'vendors',
        'copy-index-dist',
        'inject-templates-modules',
        'copy-index-app',
        'copy-i18n',
        'clean-app-folder',
        cb);
});

// tasks for local development
gulp.task('default', function (cb) {
    runSequence(
        'lint',
        'clean',
        'cache-templates',
        'scripts',
        'images',
        'watch',
        cb)
});