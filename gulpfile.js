var gulp = require('gulp'),
  sass = require('gulp-sass');

// SASS
gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});

// Copy all static assets
gulp.task('copy', function () {
  gulp.src('src/img/**')
    .pipe(gulp.dest('dist/img'));

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
  // Compile everything to start with
  gulp.run('sass', 'copy');

  // Watch SASS
  gulp.watch('src/sass/*.scss', function (e) {
    gulp.run('sass');
  });

  // Watch Static
  gulp.watch([
    'src/img/**',
    'src/*.html'
  ], function(event) {
    gulp.run('copy');
  });
});
