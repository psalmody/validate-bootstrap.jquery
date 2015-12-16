module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n*  validate-bootstrap.jquery v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n',
                mangle: false
            },
            build: {
                files: [{
                    src: 'validate-bootstrap.jquery.js',
                    dest: 'validate-bootstrap.jquery.min.js'
                }]
            }
        },
        concat: {
          options: {
            stripBanners: true,
            banner: '/**\n*  validate-bootstrap.jquery v <%= pkg.version %>\n*  @psalmody <%= pkg.homepage %>\n*/\n'
          },
          dist: {
            src: 'src/validate-bootstrap.jquery.js',
            dest: 'validate-bootstrap.jquery.js'
          }
        },
        watch: {
            files: './src/*.js',
            tasks: ['jsbeautifier','uglify','concat'],
            options: {
              livereload: true
            }
        },
        jsbeautifier: {
          files: ['src/**/*.js'],
          options: {
            js: {
              indentSize: 2
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['jsbeautifier','uglify','concat']);

};
