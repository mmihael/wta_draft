module.exports = function (grunt) {
    grunt.initConfig({
        cssmin: {
            target: {
                files: {
                    './prod/app.css': [
                        './app.css'
                    ]
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    './prod/app.js': ['./vue.min.js', './vue-resource.min.js', './app.js']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    './prod/index.html': ['./index.html']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('default', ['cssmin', 'uglify', 'processhtml']);
};