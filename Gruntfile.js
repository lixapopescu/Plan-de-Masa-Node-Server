module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        autoprefixer: {
            dist: {
                files: {
                    'pref_custom.css': 'css/custom.css'
                }
            }
        },
        concat: {
            js: {
        	    options: {
        	      separator: ';',
        	    },
        	    dist: {
            	      src: ['js/*.js'],
            	      dest: 'dist/js/production.js',
                },
            },
            css: {
                options: {
                  separator: ';',
                },
                dist: {
                      src: ['css/*.css'],
                      dest: 'dist/css/production.css',
                },
            },
   	    },
        uglify: {
    	    build: {
        		src: 'js/dist/production.js',
        		dest: 'js/dist/production.min.js',
            },
	    },
        imagemin: {
            dynamic: {                         // Another target
              files: [{
                expand: true,                  // Enable dynamic expansion
                cwd: 'images/',                   // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                dest: 'images/optimized/',      // Destination path prefix
                optimizationLevel: 3,                  
              }]
            },
        },
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat'],
                options: {
                  spawn: true,
                },
            },
            css: {
                files: ['css/*.css'],
                tasks: ['autoprefixer'],
            },
            scss: {
                files: ['css/*.scss'],
                tasks: ['sass'],
                options: {
                  spawn: true,
                },
            },
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css',
                }],
            },
        },
        grunticon: {
                myIcons: {
                    files: [{
                        expand: true,
                        cwd: 'example/',
                        src: ['*.svg', '*.png'],
                        dest: "example/output/"
                    }],
                    options: {
                    },
                },
        },
/*        gh-pages: {
            options: {
              base: 'dist',
              branch: 'master',
              message: 'Auto generated commit',
              user: {
                name: 'Alexandra Popescu',
                email: 'lixapopescU@gmail.com'
              }
            },
            src: ['**'],
        },
*/      sync: {
              main: {
                files: [{
                  cwd: 'fonts',
                  src: ['**'],
                  dest: 'dist/fonts',
                }],
  //              pretend: true, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much. 
                verbose: true // Display log messages when copying files 
              },
        },
        cssmin: {
              target: {
                files: [{
                  expand: true,
                  cwd: 'css',
                  src: ['production.css'],//['*.css', '!*.min.css'],
                  dest: 'dist/css',
                  ext: '.min.css'
                }]
              }
        },
        pagespeed: {
              options: {
                nokey: true,
                url: "https://developers.google.com",
              },
              prod: {
                options: {
                  url: "https://developers.google.com/speed/docs/insights/v1/getting_started",
                  locale: "en_GB",
                  strategy: "desktop",
                  threshold: 80,
                }
              },
              paths: {
                options: {
                  paths: ["/speed/docs/insights/v1/getting_started", "/speed/docs/about"],
                  locale: "en_GB",
                  strategy: "desktop",
                  threshold: 80,
                },
              },
        },
        responsive_images_converter: {
            default_options: {
              files: {
                'tmp/default_options': [ 'test/fixtures/only-one-image.md' ],
              },
            }
          },
    }
);

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify'); //minify
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-pagespeed');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-responsive-images-converter');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    // grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'watch']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dist', ['sync', 'sass', 'autoprefixer', 'concat:js', 'concat:css', 'cssmin']); //TODO add concat before cssmin + csslint
    grunt.registerTask('dev', ['newer:sass']);

};