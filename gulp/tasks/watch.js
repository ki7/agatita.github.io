/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');
var jade     = require('gulp-jade');
var browserSync     = require('browser-sync');


gulp.task('watch', ['watchify','browserSync'], function() {
  gulp.watch(config.css.src,   ['css']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(
    [config.markup.src, 'src/includes/**/*.html'], ['markup']
  ).on('change',  browserSync.reload);
  gulp.watch(config.html.src,['html']).on('change', browserSync.reload);
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
