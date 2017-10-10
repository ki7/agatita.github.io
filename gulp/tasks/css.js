var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var postcss    = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var util   = require('gulp-util');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').css;


var  processors = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-property-lookup'),
    require('postcss-custom-properties'),
    require('postcss-simple-vars'),
    require('postcss-calc'),
    require('autoprefixer'),
    require('postcss-cssstats'),
    require('postcss-custom-media'),
    require('postcss-custom-selectors')
  ];

gulp.task('css', function () {
  return gulp.src(config.entries)
    .pipe(sourcemaps.init())
    .on('error', handleErrors)
    .pipe( postcss(processors, { map : util.env.type === 'dev'}) )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
