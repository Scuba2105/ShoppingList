'use strict';

import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import html2pug from 'gulp-html2pug';
import browserify from 'gulp-browserify';
const sass = gulpSass(dartSass);

export function buildStyles() {
    return gulp.src('./sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
};

export function buildPug() {
    gulp.src('./html/index.html')
        .pipe(html2pug())
        .pipe(gulp.dest('./pug'));
};

gulp.task('browserify', () => {
    gulp.src ('./js/renderer.js')
        .pipe(browserify({
      debug: false,
      ignoreMissing: true,
      builtins: false,
      commondir: false,
      detectGlobals: false,
      bare: true
    }))
        .pipe(gulp.dest('./build'));
});


export function watchTask() {
    gulp.watch('./sass/*.scss', buildStyles);
    gulp.watch('./html/index.html', buildPug);
};
