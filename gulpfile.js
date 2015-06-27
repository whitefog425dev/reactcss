var gulp = require('gulp');

// Test
var mocha = require('gulp-mocha');

// Bundle
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
require('coffee-script/register');

// Docs
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');


config = {
  docs: {
    entry: ['webpack-dev-server/client?http://localhost:2570', 'webpack/hot/dev-server', './docs/index.coffee'],
    output: {
      path: path.join(__dirname, 'docs/build'),
      filename: 'bundle.js',
      publicPath: 'http://localhost:2570/docs/build/'
    },
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          test: /\.js$/,
          loaders: ['react-hot-loader']
        }, {
          test: /\.coffee$/,
          loaders: ['coffee-loader']
        }, {
          test: /\.cjsx$/,
          loaders: ['react-hot-loader', 'coffee-jsx-loader', 'react-map-styles']
        }, {
          test: /\.css$/,
          loaders: [ 'style-loader', 'css-loader' ]
        }, {
          test: /\.md$/,
          loaders: [ 'html-loader' ]
        }
      ]
    },
    resolve: {
      alias: {
        'reactcss': path.resolve(__dirname, './src/react-css.coffee')
      },
      extensions: ['', '.js', '.coffee', '.cjsx'],
      fallback: [path.resolve(__dirname, './modules')]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({ quiet: true }),
      new webpack.NoErrorsPlugin()
    ],
    devtool: 'eval',
    quiet: true
  }
};


gulp.task('test', function(){
  return gulp.src('./test/**/*.coffee')
             .pipe(mocha());
});

gulp.task('bundle', function(done) {
  gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('react-css.js'))
    .pipe(uglify())
    .pipe(gulp.dest('lib'));
  done();
});

gulp.task('watch', function(done) {
  gulp.watch([ '**/*.coffee' ], [ 'test' ]);
});

gulp.task('docs', function(done) {
  done();
  return new WebpackDevServer(webpack(config.docs), {
    publicPath: config.docs.output.publicPath,
    hot: true,
    stats: {
      cached: false,
      cachedAssets: false,
      exclude: ['node_modules', 'components']
    }
  }).listen(2570, 'localhost', function(err, result) {
    if (err) {
      return console.log(err);
    } else {
      return console.log('webpack dev server listening at localhost:2570');
    }
  });
});

gulp.task('default', ['watch']);
