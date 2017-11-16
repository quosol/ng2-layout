var gulp = require('gulp');
var inlineNg2Template = require('gulp-inline-ng2-template');

gulp.task('js:build', function () {
    gulp.src('./src/app/iatec-layout/**/*.ts') // also can use *.js files
        .pipe(inlineNg2Template({
            base: '/src/app/iatec-layout',
            useRelativePaths: true
        }))
        .pipe(gulp.dest('./iatec-layout'));
});