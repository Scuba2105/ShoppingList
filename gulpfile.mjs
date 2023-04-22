'use strict';

import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import html2pug from 'gulp-html2pug';
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

export function watchTask() {
    gulp.watch('./sass/*.scss', buildStyles);
    gulp.watch('./html/index.html', buildPug);
};



