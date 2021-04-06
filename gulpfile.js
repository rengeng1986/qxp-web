const util = require('util');
const gulp = require('gulp');
const webpack = require('webpack');

const {generateSprite} = require('./scripts/svg-to-sprite');

const promiseExec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');
const webpackConfig = require('./webpack.config');

function clean(cb) {
  return promiseExec('rm -rf dist', cb);
}

function runWebpack(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error('err:', err);
        console.log(stats.toString({ 'errors-warnings': true }));

        return reject();
      }

      console.log(stats.toString({ normal: true, colors: true }));

      resolve();
    });
  });
}

function copyTemplates() {
  return gulp
    .src([
      './clients/templates/layout.html',
      './clients/templates/404.html',
      './clients/templates/500.html',
    ])
    .pipe(gulp.dest('./dist/templates'));
}

function copyImages() {
  return gulp
    .src('./clients/assets/images/**/*')
    .pipe(gulp.dest('./dist/images'));
}

function buildIcons() {
  return generateSprite();
}

const buildAssets = gulp.parallel(
  copyImages,
  copyTemplates,
  buildIcons,
);

exports.buildIcons = buildIcons;
exports.buildAssets = buildAssets;
exports.webpack = (done) => {
  runWebpack(webpackConfig({ mode: 'production' })).then(done);
};

exports.default = gulp.parallel(buildAssets,
  () => {
    gulp.watch(
      ['./webpack.config.js'],
      { ignoreInitial: false },
      gulp.series((done) => {
        runWebpack(webpackConfig({ mode: 'development' })).then(done);
      })
    );

    portalServer = spawn('air');
    portalServer.stderr.pipe(process.stderr);
    portalServer.stdout.pipe(process.stdout);
  }
);
