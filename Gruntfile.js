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
        usebanner: {
          taskName: {
            options: {
              position: 'top',
              banner: '/**\n*  validate-bootstrap.jquery v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n',
              linebreak: true
            },
            files: {
              src: ['validate-bootstrap.jquery.js']
            }
          }
        },
        watch: {
            files: 'validate-bootstrap.jquery.js',
            tasks: ['uglify','usebanner']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', ['uglify','usebanner']);

};
