var gulp = require("gulp");

var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglifyjs");
var rename = require("gulp-rename");
var header = require("gulp-header");
var ngAnnotate = require('gulp-ng-annotate');
var stylish = require('jshint-stylish');

var paths = {
  app: './',
  js: ['./app/*.js', './app/**/*.js','!**/*test.js'],
  all: ['./app/**/*.html', './*.html', './libs/css/*.css','./app/*.js', './app/**/*.js','./app/**/!*test.js']
};

gulp.task("lint", function()
{
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
 });

gulp.task("scripts", function() {
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
        .on('error', function(err){
            console.log(err);
        })
        .pipe(header(headerValue))
        .pipe(gulp.dest("dist"));
 });

gulp.task('watch', function() {
  gulp.watch(paths.all, ["lint", "scripts"]);
});

gulp.task("default", ["lint", "scripts", "watch"]);
