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
            banner: '/**\n*  validate-bootstrap.jquery v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n'
          },
          dist: {
            src: 'validate-bootstrap.jquery.js',
            dest: 'validate-bootstrap.jquery.js'
          }
        },
        watch: {
            files: 'validate-bootstrap.jquery.js',
            tasks: ['uglify','concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['uglify','concat']);

};
