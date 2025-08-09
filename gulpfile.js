const { src, dest, parallel } = require('gulp');

function buildIcons() {
  return src('nodes/**/*.{png,svg}')
    .pipe(dest('dist/'));
}

function copyIndex() {
  return src('index.js')
    .pipe(dest('dist/'));
}

exports['build:icons'] = buildIcons;
exports['copy:index'] = copyIndex;
exports['build:assets'] = parallel(buildIcons, copyIndex);
