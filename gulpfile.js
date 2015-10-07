var args            = require('yargs').argv;
var autoprefixer    = require('gulp-autoprefixer');
var browserify      = require('browserify');
var es              = require('event-stream');
var glob            = require('glob');
var gulp            = require('gulp');
var gulpif          = require('gulp-if');
var gutil           = require('gulp-util');
var jshint          = require('gulp-jshint');
var minifyCSS       = require('gulp-minify-css');
var mochaPhantomjs  = require('gulp-mocha-phantomjs');
var rename          = require('gulp-rename');
var sass            = require('gulp-sass');
var source          = require('vinyl-source-stream');
var uglify          = require ('gulp-uglify');

var sass_entry_paths = [
  'components/sass/public.scss',
  'components/sass/admin.scss'
];

var paths = {
  scripts: 'components/scripts/**/*.js',
  sass: 'components/sass/**/*.scss',
  tests: 'tests/scripts/*.js'
};

var isProduction = args.env === 'production';

gulp.task('sass', function() {
    return gulp.src(sass_entry_paths, { base: '.' })
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename(function(path) {
            path.dirname = 'public/css';
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('./dist/')); 
});

gulp.task('browserify', function(done) {
  glob('components/scripts/main-**.js', function(err, files) {
    if(err) done(err);
    var tasks = files.map(function(entry) {
      return browserify({ entries: [entry] })
        .bundle()
        .pipe(gulpif(isProduction, uglify()))
        .pipe(source(entry))
        .pipe(rename({
          dirname: 'public/js',
          extname: '.min.js'
      }))
      .pipe(gulp.dest('./dist/'));
    });
    es.merge(tasks).on('end', done);
  });
});

gulp.task('browserify-test', function() {
	return browserify('tests/scripts/index.js')
		.bundle()
		.pipe(source('client-test.js'))
		.pipe(gulp.dest('tests/scripts'));
});

gulp.task('test', ['browserify-test'], function() {
  return gulp.src('tests/index.html')
    .pipe(mochaPhantomjs());
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['browserify']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.tests, ['browserify-test']);
});

gulp.task('default', ['watch', 'sass', 'browserify', 'browserify-test']);
  
  