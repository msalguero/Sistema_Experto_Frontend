// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var util = require('gulp-util');

// tasks
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});
gulp.task('clean-bundles', function(){
  return gulp.src(['./app/main.js', './app/main.css'], {read: false})
        .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true,
    fallback: 'app/index.html'
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('scripts', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**', '!./app/lb-services.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./app'));
});

gulp.task('less', function() {
  gulp.src('./app/main.less')
    .pipe(less().on('error', util.log))
    .pipe(gulp.dest('./app'));
});

gulp.task('watch', function() {
    gulp.watch(['./app/**/*.less', './app/**/*.js', '!./app/bower_components/**'], ['bundle']);
});

gulp.task('bundle', function(){
  runSequence(
    ['clean-bundles'],
    ['less', 'scripts']
  );
});


// default task
gulp.task('default', function(){
  runSequence(
    ['clean-bundles'],
    ['less', 'scripts']
  );
});

gulp.task('start', function(){
  runSequence(
    ['clean-bundles'],
    ['less', 'scripts', 'connect']
  );
});

gulp.task('serveprod', function() {
  connect.server({
    root: 'app/',
    port: process.env.PORT || 5000, // localhost:5000
    livereload: false,
    fallback: 'app/index.html'
  });
});

gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['less', 'scripts', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'serveprod']
  );
});