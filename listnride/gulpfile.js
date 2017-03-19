var del = require('del');
var gulp = require('gulp');
var config = require('./gulp.config.js')();
var rev = require('gulp-rev');
var gulpIf = require('gulp-if');
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
var htmlReplace = require('gulp-html-replace');
var path = config.path;
var environments = config.environments;
var argvEnv = ('local' === argv.env || 'staging' === argv.env || 'production' === argv.env) ? argv.env : 'local'
var env = environments[argvEnv];

gulp.task('lint', lint);
gulp.task('inject-templates-modules', injectTemplatesModules);
gulp.task('cache-templates-modules', cacheTemplatesModules);
gulp.task('cache-templates-services', cacheTemplatesServices);
gulp.task('copy-index-tmp', copyIndexTmp);
gulp.task('copy-index-dist', copyIndexDist);
gulp.task('copy-index-app', copyIndexApp);
gulp.task('copy-sitemap', copySitemap);
gulp.task('vendors', vendors);
gulp.task('scripts-deploy', scriptsDeploy);
gulp.task('base-tag', baseTag);
gulp.task('copy-i18n', copyI18n);
gulp.task('copy-fonts', copyFonts);
gulp.task('images-png', imagesPng);
gulp.task('images-svg', imagesSvg);
gulp.task('constants', appConstants);
gulp.task('clean', clean);
gulp.task('clean-extras', cleanExtras);
gulp.task('clean-extras-local', cleanExtrasLocal);
gulp.task('changes-in-index', changesInIndex);
gulp.task('watch', watch);
gulp.task('revisions', revisions);
gulp.task('replace-revisions-index', replaceRevisionsIndex);
gulp.task('deploy-lnr-shop-integration', deployLnrShopIntegration);
gulp.task('resources-lnr-shop-solution', resourcesLnrShopSolution);
gulp.task('concat-lnr-shop-solution', concatLnrShopSolution);
gulp.task('minify-lnr-shop-solution', minifyLnrShopSolution);
gulp.task('clean-lnr-shop-solution', cleanLnrShopSolution);
gulp.task('deploy-lnr-shop-solution', deployLnrShopSolution);
gulp.task('copy-lnr-shop-solution', copyLnrShopSolution);
gulp.task('images', ['images-svg', 'images-png']);
gulp.task('local', local);
gulp.task('default', ['local']);
gulp.task('deploy', deploy);

/**
 * eslint through all js files
 * @returns {gulp} for chaining
 */
function lint() {
    return gulp.src(path.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
}
/**
 * inject template cache files in index.html
 * modules.tpl.min.js and services.tpl.min.js reference in index
 * @returns {gulp} for chaining
 */
function injectTemplatesModules() {
    return gulp.src(path.dist.index)
        .pipe(inject(gulp.src(path.dist.templatesCache, {
            read: false
        }), {
            relative: true,
            removeTags: true
        }))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * create templates.js file to serve all html files
 * js cache of html from module folder
 * @returns {gulp} for chaining
 */
function cacheTemplatesModules() {
    return gulp.src(path.app.templates)
        .pipe(templateCache('modules.tpl.min.js', {
            root: 'app/modules/',
            module: 'listnride'
        }))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * create templates.js file to serve all html files
 * js cache of html from services folder
 * @returns {gulp} for chaining
 */
function cacheTemplatesServices() {
    return gulp.src(path.app.serviceTemplate)
        .pipe(templateCache('services.tpl.min.js', {
            root: 'app/services/',
            module: 'listnride'
        }))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * copy original index file to tmp folder
 * preserves the original file
 * @returns {gulp} for chaining
 */
function copyIndexTmp() {
    return gulp.src(path.index)
        .pipe(gulp.dest('.tmp'));
}
/**
 * copy original index file back to app
 * restore original index from .tmp
 * @returns {gulp} for chaining
 */
function copyIndexApp() {
    return gulp.src('.tmp/index.html')
        .pipe(gulp.dest('./'));
}
/**
 * copy the sitemap at root for deployment 
 * @returns {gulp} for chaining
 */
function copySitemap() {
    return gulp.src(path.app.sitemap).pipe(gulp.dest(path.dist.root));
}
/**
 * concat all vendors files, js and css
 * minify and uglify vendors files
 * @returns {gulp} for chaining
 */
function vendors() {
    return gulp.src(path.app.index)
        .pipe(useref())
        .pipe(gulpIf(path.app.js, uglify()))
        .pipe(gulpIf(path.nodeModules, uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * copy new referenced index file to dist
 * index file with new references to dist folder
 * @returns {gulp} for chaining
 */
function copyIndexDist() {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest(path.dist.root));
}
/**
 * concat all development js files - local
 * minify and uglify development files
 * @returns {gulp} for chaining
 */
function scriptsDeploy() {
    gulp.src(path.dist.app)
        .pipe(concat(path.dist.source))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(path.dist.root))
        .pipe(uglify(path.dist.source))
        .pipe(gulp.dest(path.dist.root));

    return gulp.src(path.dist.vendors)
        .pipe(uglify(path.dist.sourceVendors))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * base tag for deployment
 * @returns {gulp} for chaining
 */
function baseTag() {
    return gulp.src(path.dist.index)
        .pipe(htmlReplace({
            'base': path.app.base
        }))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * copy i18n to dist folder
 * @returns {gulp} for chaining
 */
function copyI18n() {
    return gulp.src(path.app.i18n)
        .pipe(gulp.dest(path.dist.i18n));
}
/**
 * copy fonts to dist folder
 * @returns {gulp} for chaining
 */
function copyFonts() {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
}
/**
 * optimize png images
 * loseless compression
 * @returns {gulp} for chaining
 */
function imagesPng() {
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
}
/**
 * optimize svg images
 * lose-less compression
 * @returns {gulp} for chaining
 */
function imagesSvg() {
    return gulp.src(path.app.icons)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            plugins: [imagemin.svgo()]
        }))
        .pipe(gulp.dest(path.dist.icons))
}
/**
 * clean dist folder
 * before every deployment
 * @returns {gulp} for chaining
 * @param {clean~cleanCallback} cb - The callback that handles the response.
 */
function clean(cb) {
    var cleanFiles = [path.dist.root, 'app/app.min.js'];
    return del(cleanFiles, cb);
}
/**
 * clean extra folders 
 * with every deployment - files with revisions are used instead
 * @returns {gulp} for chaining
 * @param {cleanExtras~cleanExtrasCallback} cb - The callback that handles the response.
 */
function cleanExtras(cb) {
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
}
/**
 * generate the angular constant
 * with respect to environments
 * local, staging, production
 * @returns {gulp} for chaining
 */
function appConstants() {
    return ngConstant({
            wrap: false,
            constants: env.constants,
            name: env.context.name + '.constant',
            stream: true,
        })
        .pipe(rename('app.constants.js'))
        .pipe(gulp.dest(path.app.root));
}
/**
 * after every deploy
 * @returns {gulp} for chaining
 * @param {cleanExtrasLocal~cleanExtrasLocalCallback} cb - The callback that handles the response.
 */
function cleanExtrasLocal(cb) {
    var cleanFiles = 'local' === argvEnv ? [] : ['app', 'node_modules', 'js_modules', 'angular-material-minimal'];
    return del(cleanFiles, cb);
}
/**
 * required for deploy
 * because app.min.js is at same level with index.html in deployment
 * while in local env, app.min.js and index are at d/f levels
 * TODO: app.min.js and index.html should be at same level in local env
 * @returns {gulp} for chaining
 */
function changesInIndex() {
    return gulp.src(['dist/index.html'])
        .pipe(replace('app/app.min.js', 'app.min.js'))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * watch changes in js files, used for local development
 * @returns {gulp} for chaining
 */
function watch() {
    gulp.watch(path.alljs, ['lint', 'clean', 'scripts']);
}
/**
 * generate revisions of js files
 * to invalidate browser cache on deployment
 * @returns {gulp} for chaining
 */
function revisions() {
    return gulp.src([path.dist.js, path.dist.css])
        .pipe(gulp.dest(path.dist.root))
        .pipe(rev())
        .pipe(gulp.dest(path.dist.root))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.dist.root))
}
/**
 * replace revision in index file
 * replace js files references in index with revisions
 * @returns {gulp} for chaining
 */
function replaceRevisionsIndex() {
    var manifest = gulp.src(path.dist.manifest);
    return gulp.src(path.dist.index)
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest(path.dist.root));
}
/**
 * our js file which is used to embed bikes in other sites.
 * @returns {gulp} for chaining
 */
function deployLnrShopIntegration() {
    gulp.src(path.lnrShopIntegration.style)
        .pipe(concat(path.lnrShopIntegration.css))
        .pipe(gulp.dest(path.dist.root));

    gulp.src(path.lnrShopIntegration.source)
        .pipe(concat(path.lnrShopIntegration.js))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(path.dist.root))
        .pipe(uglify(path.lnrShopIntegration.js))
        .pipe(gulp.dest(path.dist.root));

    return gulp.src(path.app.js_modules)
        .pipe(gulp.dest(path.dist.js_modules));
}
/**
 * copy template to tmp folder
 * @returns 
 */
function resourcesLnrShopSolution() {
    return gulp.src(path.lnrShopSolution.resource)
        .pipe(gulp.dest(path.lnrShopSolution.dist.root));
}
/**
 * get build tags from template
 * generate concatenated source and style
 * save results in dist folder
 * @returns {gulp} chaining
 */
function concatLnrShopSolution() {
   return gulp.src(path.lnrShopSolution.html)
        .pipe(useref())
        .pipe(gulpIf(path.lnrShopSolution.source, uglify()))
        .pipe(gulpIf(path.lnrShopSolution.style, minifyCss()))        
        .pipe(gulp.dest(path.lnrShopSolution.dist.root));
}
/**
 * get build tags from template
 * generate concatenated source and style
 * save results in dist folder
 * @returns {gulp} chaining
 */
function minifyLnrShopSolution() {
    gulp.src(path.lnrShopSolution.dist.source)
        .pipe(uglify(path.lnrShopSolution.dist.js))
        .pipe(gulp.dest(path.lnrShopSolution.dist.root));

    return gulp.src(path.lnrShopSolution.dist.style)
        .pipe(concat(path.lnrShopSolution.dist.css))
        .pipe(gulp.dest(path.lnrShopSolution.dist.root))
        .pipe(minifyCss(path.lnrShopSolution.dist.css))
        .pipe(gulp.dest(path.lnrShopSolution.dist.root));
}
/**
 * clean dist folder
 * @returns {gulp} chaining
 */
function cleanLnrShopSolution(cb) {
    var cleanFiles = [path.lnrShopSolution.dist.root];
    return del(cleanFiles, cb);
}
/**
 * run all shop solution tasks [clean, resource, concat, minify]
 * sequential tasks
 * @returns {gulp} chaining
 */
function deployLnrShopSolution(cb) {
    runSequence(
        'clean-lnr-shop-solution',
        'resources-lnr-shop-solution',
        'concat-lnr-shop-solution',
        'minify-lnr-shop-solution',
        cb
    );
}
/**
 * run all shop solution tasks [clean, resource, concat, minify]
 * sequential tasks
 * @returns {gulp} chaining
 */
function copyLnrShopSolution() {
    return gulp.src(path.lnrShopSolution.dist.root + '**/*')
        .pipe(gulp.dest(path.dist.lnrShopSolution));
}
/**
 * tasks for local development
 * @returns {gulp} for chaining
 * @param {local~localCallback} cb - The callback that handles the response.
 */
function local(cb) {
    runSequence(
        'lint',
        'clean',
        'scripts-local',
        'images',
        'watch',
        cb)
}
/**
 * tasks for deployment
 * DO NOT CHANGE THE SEQUENCE - SYNCHRONOUS COMMANDS
 * CHANGING THE SEQUENCE WILL MAKE YOU SLEEPLESS
 * DO NOT RUN IN LOCAL ENVIRONMENT
 * @returns {gulp} for chaining
 * @param {deploy~deployCallback} cb - The callback that handles the response.
 */
function deploy(cb) {
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
        'base-tag',
        'copy-sitemap',
        'clean-extras',
        'clean-extras-local',
        'deploy-lnr-shop-solution',
        'copy-lnr-shop-solution',
        'clean-lnr-shop-solution',
        cb);
}