module.exports = function () {
    var client = './app/';
    var root = './';
    var temp = './.tmp/';
    var nodeModules = 'node_modules';
    var config = {
        alljs: ['./app/*.js', './app/**/*.js','!**/*test.js'],
        all: ['./app/**/*.html', './*.html', './libs/css/*.css','./app/*.js', './app/**/*.js','./app/**/!*test.js'],
        html: client + '**/*.html',
        htmltemplates: client + '**/*.html',
        images: client + 'app/assets/ui_images/**/*.*',
        index: client + 'index.html',
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },
        packages: ['./package.json'],
  };

  return config;
}