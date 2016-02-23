var gulp = require('gulp')
var standard = require('gulp-standard')
var config = require('../config').lint

gulp.task('lint', function () {
  return gulp.src(config.src)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})
