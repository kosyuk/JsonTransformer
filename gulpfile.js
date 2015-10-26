/**
 * Created by alex on 9/13/15.
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver'),
    livereload = require('gulp-livereload'),
    spawn = require('child_process').spawn,
    protractor = require("gulp-protractor").protractor;

gulp.task('default', ['webserver', 'nodeserver', 'watch' ]);

// configure the jshiOkescalant task
gulp.task('jshint', function() {
    return gulp.src('web/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('buildjs', function(){
    gutil.log("reloaded");
    livereload();
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            defaultFile: 'index.html'
        }));
});

gulp.task('watch', function() {
    gulp.watch(['webapp/**/*.js', 'webapp/**/*.html', 'webapp/**/*.css'], ['buildjs']);
    gulp.watch(['node/**/*.js'], ['nodeserver','e2e']);
});


//node side
gulp.task('nodeserver', function() {
    var k = spawn('killall', ['-9', 'node']);
    k.on('close',function(){
        var n = spawn('node', ['node/main.js']);
        n.on('close',function(){
           gutil.log("server reloaded");
           //livereload();
        });
    });
});


gulp.task('e2e', function(){
    gutil.log("e2e tests");
    gulp.src(["./e2e/*.js"])
        .pipe(protractor({
            configFile: "e2e/conf.js",
            args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function(e) { throw e })
});