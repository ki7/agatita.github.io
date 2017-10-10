var gulp    = require('gulp');
var ghPages = require('gulp-gh-pages');
var open    = require('open');
var config  = {
	url: 'http://agatita.github.io/',
  src: './build/**/*'
};

gulp.task('deploy', function() {
  return gulp.src(config.src)
    .pipe(ghPages())
    .on('end', function(){
      open(config.url);
    });
});