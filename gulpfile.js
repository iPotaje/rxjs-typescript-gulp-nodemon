var gulp    = require('gulp')
  , nodemon = require('gulp-nodemon')
  , Cache   = require('gulp-file-cache')
  , ts      = require("gulp-typescript");

var cache = new Cache();

gulp.task('compile', function () {
    var stream = gulp.src("./src/**/*.ts")
        .pipe(cache.filter())
        .pipe(ts({ noImplicitAny: true }))
        .pipe(cache.cache()) // cache them 
        .pipe(gulp.dest('./dist')) // write them 

    return stream;
});
 
gulp.task('watch', ['compile'], function () {
  var stream = nodemon({
                 script: 'dist/' // run ES5 code
               , ext:    'ts'                  
               , watch:  'src' // watch ES2015 code 
               , tasks:  ['compile'] // compile synchronously onChange 
               })
 
  return stream
})