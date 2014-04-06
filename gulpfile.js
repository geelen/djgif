var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  url = require('url'),
  proxy = require('proxy-middleware');

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

gulp.task('spec-once', function () {
  return gulp.src('spec/**/*_spec.js')
    .pipe($.mocha({reporter: 'dot'}).on('error', function (err) {
      this.emit('end');
    }));
});

gulp.task('spec', ['spec-once'], function () {
  gulp.watch(['src/js/**/*.js', 'spec/**/*_spec.js'], ['spec-once']);
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
    .pipe($.angularTemplatecache('templates.js', {standalone: true}))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('build', ['sass', 'copy', 'js']);

gulp.task('default', ['build', 'connect'], function () {
  // Watch JS
  gulp.watch(['src/js/**', 'src/templates/**'], ['js']);

  // Watch SASS
  gulp.watch('src/sass/**/*.scss', ['sass']);

  // Watch Static
  gulp.watch([ 'src/img/**', 'src/*.html' ], ['copy']);

  gulp.watch('dist/**/*', function (event) {
    return gulp.src(event.path)
      .pipe($.connect.reload());
  });
});

gulp.task('connect', function() {
 $.connect.server({
  root: ['dist'],
  port: 1989,
  livereload: {port: 2989},
  middleware: function (connect, o) {
    return [
      function (req, res, next) {
        if (req.url.match(/\.gif$/)) {
          console.log(req.url);
          proxy(url.parse('http://25.media.tumblr.com'))(req, res, next);
        } else {
          next();
        }
      }
    ]
  }
})
});
