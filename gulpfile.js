const gulp =require('gulp');
const sass =require('gulp-sass');
const cssnano =require('gulp-cssnano');
const rev =require('gulp-rev');
const uglify =require('gulp-uglify-es').default;
const imagemin =require('gulp-imagemin');
const del =require('del');
const { series } = require('gulp');


gulp.task('css',function(done){
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'))

     gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();

})


gulp.task('js',function(done){
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();

})


gulp.task('images',function(done){
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();

})


gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
})

gulp.task('build', gulp.series('clean:assets','css','js','images'),function(done){
    console.log('Building asseets');
    done();
})