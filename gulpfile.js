// Include gulp
var gulp = require('gulp');
//Include Connect File
var connect = require('gulp-connect');

//start the server
gulp.task('connect', function() {
  connect.server({
    name: 'Gulp Test',
    root: '',
    port: 8000,
    host: 'localhost',
    livereload: true
  });
});

// Default Task
gulp.task('default', ['connect']);
