module.exports = function (grunt) {
  //  Load all modules.
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*', 'grunt-*']});
  var mozjpeg = require('imagemin-mozjpeg');

  // Control variables
    var app = {
      // Refresh server if any of these files changes.
      toReloadFiles : [
        'gruntfile.js',
        'public/*.htm',
        'public/index.htm',
        'public/less/*.less',
        'public/js/*.js',
        'public/js/**/*.js',
      ],
      isLivereload : true
    };
  // Settings.
  grunt.initConfig({
    express: {
      options: {
        livereload: app.isLivereload,
        nospawn: app.isLivereload // to reload express.
      },
      // files: ['views/index.jade'],
      tasks: ['express:dev'],
      dev: {
        options: {
          script: 'server/bin/www-offline',
        }
      }
    },
    less: {
      development: {
        files: {
          "public/css/app.css": "public/less/app.less"
        }
      },
      glyphtest: {
        files: {
         "font-maker/glyph-test.css": "font-maker/quisio-glyphs-main.less" 
        }
      }
    },
    watch: {
      // compile less if any of the less files is changed.
      less: {
        files: ['public/less/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: false,
        },
      },
      livereload: {
        files: app.toReloadFiles,
        options: {
          livereload: app.isLivereload,
          nospawn: app.isLivereload // to reload express.
        }
      },
      // autoprefix: {
      //   files: ['public/less/*.less'],
      //   tasks: ['autoprefixer:dist'],
      // }
    },
    font: {
      all: {
        // SVG files to read in
        src: ['font-maker/svgs/*.svg'],

        // Location to output CSS variables
        destCss: 'font-maker/quisio-values.{less,json}',

        // Location to output fonts (expanded via brace expansion)
        destFonts: 'font-maker/quisio/quisio.{svg,woff,eot,ttf}',

        // Optional: Custom naming of font families for multi-task support
        fontFamily: 'quisio',
      }
    },
    // this is my own grunt plugin. Ask me for question :) (until i write the docs and the tests)
    json2less: {
      main: {
        options: {
        },
        files: {
          'font-maker/icon-names.less': ['font-maker/quisio-values.json']
        }
      },
    },
    copy: {
      glyphs:{
        files:[
          { dest:'public/css/quisio', expand:true, cwd:'font-maker/quisio',src:['**'] }
        ]
      },
      glyphLess:{
        files:[
          { dest:'public/less', expand:true, cwd:'font-maker',src:['icon-names.less', 'quisio-glyphs-main.less'] }
        ]
      },
    },
    autoprefixer: {
      options: {
        browsers: ["ff 3.6","opera 9.5", "ie 8", "chrome 5", "ios 3.2", "android 2.1", "safari 3.1"]
      },
      dist: {
        files: {
          "public/css/appprfx.css": "public/css/app.css"
        }
      }
    },
    // smushit: {
    //   mygroup: {
    //     src: ['public/img-raw/**/*.png','public/img-raw/**/*.jpg'],
    //     dest: 'public/img'
    //   }
    // }
    // imagemin: {                          // Task
    //   dynamic: {                         // Another target
    //     options: {                       // Target options
    //       optimizationLevel: 7,
    //     },
    //     files: [{
    //       expand: true,                  // Enable dynamic expansion
    //       cwd: 'public/img-raw/',                   // Src matches are relative to this path
    //       src: ['**/*.png'],   // Actual patterns to match
    //       dest: 'public/img'                  // Destination path prefix
    //     }]
    //   }
    // }
    // imageoptim: {
    //   myTask: {
    //     options: {
    //      jpegMini: false,
    //      imageAlpha: true,
    //      quitAfter: true
    //    },
    //     src: ['public/img-raw/bg.png', 'public/img']
    //   }
    // }
    tinypng: {
      options: {
          apiKey: "1cqXDE68xmhHbm-8304VusOoLSP181e0",
          checkSigs: true,
          sigFile: 'public/img/file_sigs.json',
          summarize: true,
          showProgress: true,
          stopOnImageError: true
      },
      // compress: {
      //     files: {
      //       'public/img/bg.png': 'public/img-raw/bg.png'
      //     }
      // }
      // compress2: {
      //     expand: true, 
      //     src: 'src/{foo,bar,baz}.png', 
      //     dest: 'dest/',
      //     ext: '.min.png'
      // },
      compress3: {
          src: ['**/*.png'],
          cwd: 'public/img-raw/',
          dest: 'public/img',
          expand: true,
          // rename: function(dest, src) { 
          //     var parts = src.split('/'),
          //     fname = path.basename(parts.pop(), ".png");
          //     return path.join(dest, fname + '.min.png');
          // }
      }
    }

  });

  // Register Tasks
  grunt.registerTask('serve', function() {grunt.task.run(
    ['express:dev','watch']);
  });
  grunt.registerTask('tinyimg', ['imagemin']);
  grunt.registerTask('icon', function() {grunt.task.run(
    ['font:all', 'json2less', 'less:glyphtest', 'copy:glyphs', 'copy:glyphLess']);
  });
};