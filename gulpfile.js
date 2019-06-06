var gulp = require('gulp');
var inlineNg2Template = require('gulp-inline-ng2-template');
var Set = require('es6-set/polyfill');

require('es6-promise').polyfill();

gulp.task('js:build', function () {
    return new Promise(function(resolve, reject) {
        gulp.src('./src/app/iatec-layout/**/*.ts') // also can use *.js files
        .pipe(inlineNg2Template({
            base: '/src/app/iatec-layout',
            useRelativePaths: true
        }))
        .pipe(gulp.dest('./iatec-layout'));
        console.log("Start Layout Transpilation");
        resolve();        
    });
});
