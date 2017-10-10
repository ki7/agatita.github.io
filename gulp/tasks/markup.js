var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var config = require('../config').markup;
var browserSync  = require('browser-sync');

gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(fileinclude({
	  prefix: '@@',
	  basepath: './'
	}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
