/**
 * gulp demo
 *
 * by kele527
 */

var del = require('del'); //清除文件
var gulp = require('gulp');
var uglify = require('gulp-uglify'); //压缩js
var jshint = require('gulp-jshint'); //代码检查
var mincss = require('gulp-clean-css'); //压缩css
var imgmin = require('gulp-imagemin'); //压缩图片
var spriter = require('gulp-css-spriter'); //合并雪碧图
var inline = require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include = require('gulp-include'); //资源内联（主要是html片段）
var sequence = require('gulp-sequence'); //按照指定顺序执行任务
var useref = require('gulp-useref'); //合并文件
var gulpif = require('gulp-if'); //gulp条件判断
var print = require('gulp-print'); //打印命中的文件
var connect = require('gulp-connect'); //本地服务器


//清理构建目录
gulp.task('clean', function(cb) {
    del(['dist']).then(function() {
        cb()
    })
});


//压缩css
gulp.task('mincss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('dist/css'))
});

//压缩js
gulp.task('minjs', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//压缩图片
gulp.task('imgmin', function() {
    return gulp.src('./src/imgs/*')
        .pipe(imgmin())
        .pipe(gulp.dest('dist/imgs'))
});

//合并雪碧图
gulp.task('spriter', function() {
    return gulp.src('./src/css/*.css')
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            //'spriteSheet': './dist/imgs/spritesheet.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            //'pathToSpriteSheetFromCSS': '../imgs/spritesheet.png' //这是在css引用的图片路径，很重要
            // 生成的spriter的位置
            'spriteSheet': './dist/imgs/spritesheet.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../imgs/spritesheet.png'
        }))
        .pipe(gulp.dest('./dist/css')); //最后生成出来
});

//代码检查
gulp.task('jshint', function() {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(inline()) //把js内联到html中
        .pipe(include()) //把html片段内联到html主文件中
        .pipe(useref()) //根据标记的块  合并js或者css
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', mincss()))
        .pipe(gulpif('*.jpg', imgmin()))
        .pipe(connect.reload()) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist'));
});

//本地服务器  支持自动刷新页面
gulp.task('connect', function() {
    connect.server({
        root: './dist', //本地服务器的根目录路径
        port: 8080,
        livereload: true
    });
});

//sequence的返回函数只能运行一次 所以这里用function cb方式使用
gulp.task('watchlist', function(cb) {
    sequence('clean', ['mincss', 'minjs', 'imgmin', 'spriter', 'jshint', 'html'])(cb)
});

gulp.task('watch', function() {
    gulp.watch(['./src/**'], ['watchlist']);
});


//中括号外面的是串行执行， 中括号里面的任务是并行执行。
gulp.task('default', function(cb) {
    sequence('clean', ['mincss', 'minjs', 'imgmin', 'spriter', 'jshint', 'html', 'connect'], 'watch')(cb)
});