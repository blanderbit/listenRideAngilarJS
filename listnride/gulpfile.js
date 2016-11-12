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
var minifyCss = require('gulp-clean-css');
var runSequence = require('run-sequence');

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

gulp.task('copy-index', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest('.tmp'));
});

gulp.task("htmls", function(){
    return gulp.src('./app/modules/**/*.html')
    .pipe(concat('combined.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task("vendors", function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(''));
});

gulp.task("scripts", function () {
    var headerValue = "//Evaluated by gulp.\n";
    return gulp.src(paths.js)
        .pipe(concat("app.js"))
        .pipe(header(headerValue))
        .pipe(ngAnnotate())
        .pipe(gulp.dest("dist"))
        .pipe(rename("app.min.js"))
        .pipe(uglify("app.min.js", {
            outSourceMap: true
        }))
        .on('error', function (err) {
            console.log(err);
        })
        .pipe(header(headerValue))
        .pipe(gulp.dest("dist"));
});

// copy images to dist
gulp.task ('copy-images', function(){
    return gulp.src(['./app/assets/ui_images/**/*'])
        .pipe(gulp.dest('./dist/assets/ui_images'));
});

// copy icons to dist
gulp.task ('copy-icons', function(){
    return gulp.src(['./app/assets/ui_icons/**/*'])
        .pipe(gulp.dest('./dist/assets/ui_icons'));
});

gulp.task('images-png', function () {
    return gulp.src('./app/assets/ui_images/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.gifsicle()]
        }))
        .pipe(gulp.dest('dist/assets/ui_images'))
});

gulp.task('images-svg', function () {
    return gulp.src('./app/assets/ui_icons/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.svgo()]
        }))
        .pipe(gulp.dest('dist/assets/ui_icons'))
});

gulp.task('clean', function (cb) {
    var cleanFiles = ['dist']; // 'dist/*.js', 'dist/*.min.js'
    return del(cleanFiles, cb);
});

gulp.task('watch', function () {
    gulp.watch(paths.alljs, ["lint", "scripts"]);
});

gulp.task("images", ['images-svg', 'images-png']); // 'images-png', 'images-svg'

gulp.task("deploy", function(cb){
    runSequence ("clean", "copy-index", ['images', 'scripts', 'vendors'], cb);
});

gulp.task("default", function(cb){ 
    runSequence ("lint", "clean", ["scripts", "images", "watch"], cb)
});