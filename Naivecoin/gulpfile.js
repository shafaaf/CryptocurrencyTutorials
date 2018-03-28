var gulp = require("gulp");
var clean = require('gulp-clean');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

// Delete js files
gulp.task('clean', function () {
    return gulp.src('dist/*.js', {read: false})
        .pipe(clean());
});

gulp.task('transpile', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('build', ['clean', 'transpile']);

//set up a watcher to watch over changes
gulp.task('watch', () => {
    gulp.watch('**/*.ts', ['build']);
});

gulp.task('dev', ['watch']);

gulp.task('default', ['build']);
