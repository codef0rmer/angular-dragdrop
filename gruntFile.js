module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ['karma']);

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    return grunt.util._.extend(options, customOptions);
  };

  // Project configuration.
  grunt.initConfig({
    karma: {
      unit: {
        options: karmaConfig('test/test.conf.js')
      }
    }
  });

};