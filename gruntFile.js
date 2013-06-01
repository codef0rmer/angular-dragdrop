module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ['karma']);

  // Project configuration.
  grunt.initConfig({
    karma: {
      unit: {
        options: karmaConfig('test/test.conf.js')
      }
    }
  });

};