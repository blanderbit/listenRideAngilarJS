// <!-- build:js dist/vendors.min.js -->
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var inject = require("gulp-inject");
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require("gulp-uglifyjs");
var rename = require("gulp-rename");
var del = require('del');
var header = require("gulp-header");
var ngAnnotate = require('gulp-ng-annotate');
var stylish = require('jshint-stylish');
var imagemin = require('gulp-imagemin');

var paths = {
    app: './',
    js: ['./app/*.js', './app/**/*.js', '!**/*test.js'],
    vendors: ['node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js'],
    all: ['./app/**/*.html', './*.html', './libs/css/*.css', './app/*.js', './app/**/*.js', './app/**/!*test.js']
};

gulp.task("lint", function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task("vendors", function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest(''))
});

gulp.task("scripts", function () {
    var headerValue = "//Evaluated by gulp.\n";
    return gulp.src(paths.js)
        .pipe(concat("combined.js"))
        .pipe(header(headerValue))
        .pipe(ngAnnotate())
        .pipe(gulp.dest("dist"))
        .pipe(rename("combined.min.js"))
        .pipe(uglify("combined.min.js", {
            outSourceMap: true
        }))
        .on('error', function (err) {
            console.log(err);
        })
        .pipe(header(headerValue))
        .pipe(gulp.dest("dist"));
});

gulp.task('images-png', function () {
    gulp.src('./app/assets/ui_images/**/*')
        .pipe(imagemin({
            progressive: true,
            plugins: [imagemin.gifsicle()]
        }))
        .pipe(gulp.dest('dist/assets/ui_images'))
});

gulp.task('images-svg', function () {
    gulp.src('./app/assets/ui_icons/**/*')
        .pipe(imagemin({
            progressive: true,
            plugins: [imagemin.svgo()]
        }))
        .pipe(gulp.dest('dist/assets/ui_icons'))
});

gulp.task('clean', function (cb) {
    var cleanFiles = ['dist/*'];
    del(cleanFiles, cb);
});

gulp.task('watch', function () {
    gulp.watch(paths.all, ["lint", "scripts"]);
});

gulp.task("images", ['images-png', 'images-svg']);
gulp.task("deploy", ["clean", "scripts", "vendors", "images"]);
gulp.task("default", ["lint", "clean", "scripts", "images", "watch"]);