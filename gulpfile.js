var args            = require('yargs').argv,
    autoprefixer    = require('gulp-autoprefixer'),
    bower           = require('gulp-bower'),
    browserify      = require('browserify'),
    es              = require('event-stream'),
    glob            = require('glob'),
    gulp            = require('gulp'),
    gulpif          = require('gulp-if'),
    gutil           = require('gulp-util'),
    jshint          = require('gulp-jshint'),
    minifyCSS       = require('gulp-minify-css'),
    mochaPhantomjs  = require('gulp-mocha-phantomjs'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    source          = require('vinyl-source-stream'),
    uglify          = require ('gulp-uglify');


var sass_entry_paths = [
  'components/sass/public.scss',
  'components/sass/admin.scss'
];

var paths = {
  bowerDir: './bower_components',
  scripts: 'components/scripts/**/*.js',
  sass: 'components/sass/**/*.scss',
  tests: 'tests/scripts/*.js'
};

var isProduction = args.env === 'production';

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(paths.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(paths.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('sass', function() {
    return gulp.src(sass_entry_paths, { base: '.' })
        .pipe(sass({
          errLogToConsole: true,
          includePaths: [
              './components/sass',
              paths.bowerDir + '/bootstrap-sass/assets/stylesheets',
              paths.bowerDir + '/font-awesome/scss',
          ]      
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename(function(path) {
            path.dirname = 'public/css';
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('./')); 
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
      .pipe(gulp.dest('./'));
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
  gulp.watch(paths.tests, ['browserify-test', 'test']);
});

gulp.task('default', ['bower', 'icons', 'watch', 'sass', 'browserify', 'test']);
  
  