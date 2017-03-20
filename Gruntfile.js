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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['cssmin', 'uglify']);
};