var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  prefix = require('gulp-autoprefixer'),
  templates = require('gulp-angular-templatecache');

// SASS
gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe(sass({
      includePaths: ['bower_components/normalize-scss', 'src/sass']
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
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
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js'])
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest('dist/js'));

  // Concat all the non-vendored JS into djgif.js
  gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
    .pipe(concat("djgif.js"))
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/templates/*.html')
    .pipe(templates('templates.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('default', function () {
  // Compile everything to start with
  gulp.run('sass', 'copy', 'js');

  // Watch JS
  gulp.watch(['src/js/**', 'src/templates/**'], function (e) {
    gulp.run('js');
  });

  // Watch SASS
  gulp.watch('src/sass/**/*.scss', function (e) {
    gulp.run('sass');
  });

  // Watch Static
  gulp.watch([
    'src/img/**',
    'src/*.html'
  ], function (event) {
    gulp.run('copy');
  });
});
