const util = require('util');
const gulp = require('gulp');
const webpack = require('webpack');

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
        console.log(stats.toString({ 'errors-warnings': true }))

        return reject();
      }

      console.log(stats.toString({ normal: true, colors: true }));

      resolve();
    });
  });
}

function copyTemplates() {
  return gulp.src('./clients/templates/layout.html').pipe(gulp.dest('./dist/templates'));
}

function copyImages() {
  return gulp.src('./clients/assets/images/**/*').pipe(gulp.dest('./dist/images'));
}

exports.webpack = (done) => {
  runWebpack(webpackConfig({ mode: 'production' })).then(done);
}

exports.build = gulp.series(copyImages, copyTemplates,
  // (done) => {
  //   runWebpack(webpackConfig({ mode: 'production' })).then(done);
  // },
  // (done) => {
  //   return promiseExec('rm -rf docker-files/nginx/dist docker-files/portal/dist', done);
  // },
  () => gulp.src('./dist/**/*').pipe(gulp.dest('./docker-files/nginx/dist')),
  () => gulp.src('./dist/templates/*').pipe(gulp.dest('./docker-files/portal/dist/templates')),
);

exports.default = gulp.series(clean, copyTemplates, copyImages, () => {
  gulp.watch(['./webpack.config.js'], { ignoreInitial: false }, gulp.series((done) => {
    runWebpack(webpackConfig({ mode: 'development' })).then(done);
  }));

  portalServer = spawn('air');
  portalServer.stderr.pipe(process.stderr);
  portalServer.stdout.pipe(process.stdout);
});
