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
    var b = browserify('./js/renderer.js', {
      debug: true,
      ignoreMissing: true,
      builtins: false,
      commondir: false,
      detectGlobals: false
    });
    b.external('fs');  // HERE
    b.external('electron');
    b.external('electron-updater');
    b.external('electron-settings');
    b.external('path');
    b.external('url');
    b.external('sqlite3');
    b.external('express');
    b.external('net');
    b.external('body-parser');
    b.bundle()
      .pipe(source('electron.min.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./build'));
});


export function watchTask() {
    gulp.watch('./sass/*.scss', buildStyles);
    gulp.watch('./html/index.html', buildPug);
};
