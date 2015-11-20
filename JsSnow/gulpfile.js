var gulp = require('gulp');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var filesize = require('gulp-filesize');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var notify = require("gulp-notify");
var rename = require("gulp-rename");

var paths = {
    sourcesFolder : './src/',
    distributionFolder: './dist/',
};

gulp.task('default', function () {
    gulp.start(['build', 'watch']);
    return;
});

gulp.task('watch', function () {
    gulp.watch(paths.sourcesFolder + '**/*.js', ['build']);
    return;
});

gulp.task('clean', function () {
    del(paths.distributionFolder + '*');
});

gulp.task('lint', function () {
    return gulp.src([paths.sourcesFolder + '**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on("error", notify.onError(function (error) {
          return {
              title: "Gulp JsHint Error!!",
              message: 'See Console for Details'
          };
      }));
});


gulp.task('minify-js', function () {
    return gulp.src([paths.sourcesFolder + '**/*.js'])
		.pipe(buffer())
		//.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(filesize())
		.pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
		.pipe(filesize())
		//.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(paths.distributionFolder))
		.on("error", notify.onError(function (error) {
		  return {
			  title: "Gulp Minify-js Error!!",
			  message: 'See Console for Details'
		  };
      }))
});

gulp.task('build', ['lint', 'clean'], function () {
	gulp.start('minify-js');
    return;
});