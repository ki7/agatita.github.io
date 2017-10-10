var gulp = require('gulp');
var jade = require('gulp-jade');
var data = require('gulp-data');
var path = require('path');
var config = require('../config').html;
var options = require('../util/jade-options');
var pagesData = require('../../src/pages/_data.json');
var browserSync  = require('browser-sync');

gulp.task('html', function() {
  return gulp.src(config.src)
    .pipe( data(function(file) {
              var page = path.relative( path.resolve( config.src, '../../../' ), file.path )
                              .replace( /\.jade$/, '' )
                              .replace( /\\/g, '/' );
              var locals =  Object.assign( {}, pagesData.global, pagesData.pages[page] || {} );
              locals.page = page;
              return Object.assign( options.value.locals , locals);
     }))
    .pipe(jade( options.value ))
    .pipe(gulp.dest(config.dest))
});
