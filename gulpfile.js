var gulp = require('gulp'),
  $ = require('gulp-load-plugins')();

// SASS
gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe($.plumber())
    .pipe($.sass({ includePaths: ['bower_components/normalize-scss', 'src/sass'] }))
    .pipe($.autoprefixer("last 2 versions", "> 1%"))
    .pipe(gulp.dest('dist/css'));
});

// Copy all static assets
gulp.task('copy', function () {
  gulp.src('src/img/**')
    .pipe(gulp.dest('dist/img'));

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
  // Vendor the JS by symlinking into js/vendor/*.js
  gulp.src([
      'bower_components/angular/angular.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js'])
    .pipe($.concat("vendor.js"))
    .pipe(gulp.dest('dist/js'));

  // Concat all the non-vendored JS into djgif.js
  gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
    .pipe($.concat("djgif.js"))
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/templates/*.html')
    .pipe($.angularTemplatecache('templates.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('build', ['sass', 'copy', 'js']);

gulp.task('default', ['build'], function () {
  // Watch JS
  gulp.watch(['src/js/**', 'src/templates/**'], ['js']);

  // Watch SASS
  gulp.watch('src/sass/**/*.scss', ['sass']);

  // Watch Static
  gulp.watch([ 'src/img/**', 'src/*.html' ], ['copy']);
});
