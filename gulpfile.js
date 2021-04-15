const {
    src,
    dest,
    parallel,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const nib = require('nib');

// options for uglify `compress`
const compressOptions = {
    drop_debugger: !process.argv.reduce(function (result, arg) {
        return result || (arg === '--debugger');
    }, false)
};

// JS function 

function js () {
    const source = [
        '../../wa-content/js/jquery-wa/wa.core.js',
        '../../wa-content/js/jquery-wa/wa.dialog.js',
        'js/vendors/jquery-ui.min.js',
        '../../wa-content/js/farbtastic/farbtastic.js',
        'js/exif.js',
        'js/jquery.onwhile.js',
        'js/jquery.replacetext.js',
        'js/jquery.taatcmpl.js',
        'js/waGallery/waGallery.js',
        'js/sidebar.js',
        'js/task.js',
        'js/taskEdit.js',
        'js/tasksPageFilters.js',
        'js/dropDownMenu.js',
        'js/tasksHeader.js',
        'js/d3chart-logs.js',
        'js/dialog.js',
        'js/taskListEdit.js',
        'js/settings/personal.js',
        'js/settings/sidebar.js',
        'js/settings/scopeEdit.js'
    ]

    return src(source)
        .pipe(sourcemaps.init())
        .pipe(concat('tasks.js'))
        .pipe(uglify({
            compress: compressOptions
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../../../'
        }))
        .pipe(dest('./js/'));
}

// CSS function 

function css () {
    const source = 'css/styl/tasks.styl';

    return src(source)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: nib(),
            compress: true
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../../../'
        }))
        .pipe(dest('./css/'));
}


// Watch files

function watchFiles () {
    watch('css/**/*.styl', css);
    watch(['js/*.js', '!js/tasks.min.js'], js);
}

exports.watch = watchFiles;
exports.default = parallel(js, css);