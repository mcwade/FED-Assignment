var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minifier'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    connect = require('gulp-connect');

//Gulp task compile sass to minified css
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/application.scss')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

//Gulp task minify JS (removing only white spaces)
gulp.task('minifyjs', function() {
  return gulp.src('./src/js/**/*.js').pipe(minify({
    minify: false,
    collapseWhitespace: false,
    conservativeCollapse: false,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*!<%%>[\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('./dist/js')) 
  .pipe(connect.reload());
});

//Copy Files
gulp.task('copy', function() {
    gulp.src('./src/index.html').pipe(gulp.dest('./dist/'))
    gulp.src('./src/images/**/*.*').pipe(gulp.dest('./dist/images'))
    gulp.src('./src/data/**/*.*').pipe(gulp.dest('./dist/data'))
    .pipe(connect.reload());
});

//Watch changes in Files
gulp.task('watch', function () {
  gulp.watch('images/**/*.*', {cwd: './src/'}, ['copy']);
  gulp.watch(['./src/scss/**/*.scss'], ['sass']);
  gulp.watch('js/**/*.js', {cwd: './src/'}, ['minifyjs']);
  gulp.watch('data/*.json', {cwd: './src/'}, ['copy']);
  gulp.watch('index.html', {cwd: './src/'}, ['copy']);
});

//Server and port 
gulp.task('server', function(event) {
    connect.server({
        root: 'dist',
        port: 3030,
        livereload: true
    });
});

//Default task will build everything
gulp.task('default', ['copy', 'sass', 'minifyjs', 'server', 'watch']);
