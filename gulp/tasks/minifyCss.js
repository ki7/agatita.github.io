var gulp      = require('gulp');
var config    = require('../config').production;
var cssnano = require('gulp-cssnano');
var size      = require('gulp-filesize');

gulp.task('minifyCss', function() {
  return gulp.src(config.cssSrc)
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(gulp.dest(config.dest))
    .pipe(size());
});
