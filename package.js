// package metadata file for Meteor.js
var packageName = 'heinerion:angular-dragdrop';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '1.0.11';
var summary = "This directive allows you to use jQuery UI's draggable and droppable plugins with AngularJS.";
var gitLink = 'https://github.com/codef0rmer/angular-dragdrop';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use([
    'angular:angular@1.4.2',
    'mizzao:jquery-ui@1.11.4'
  ], where);

  // Meteor minifies for you!
  api.addFiles('src/angular-dragdrop.js', where); // Files in use
});