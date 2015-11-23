/**
 * Exposes environment variables to the application.
 *
 * Logic:
 * 1. Get environment variables.
 * 2. Construct an object using env vars.
 * 3. Stringify that object to write it to config.json.
 */

(function() {
  'use strict';

  var _ = require('underscore'),
      OAO = {};

  // Identifies the env var to be written to config.json.
  OAO.env = ['browserstackUsername', 'browserstackAccessKey',
    'sauceUsername', 'sauceAccessKey'];

  // Identify the file to be written.
  OAO.file = './config.json';

  /**
   * Blacklists itself & other keys not to be written to config.json.
   */
  OAO.util = (function() {
    return _.union(['util'], Object.keys(_.omit(OAO,
        _.union(OAO.env, ['filePath']))));
  }());

  /**
   * Callback executes on write error.
   */
  OAO.errorCallback = function(err) {
    if (err) {
      throw 'Error writing file using environment variables.';
    }
  };

  /**
   * Build the contents of the file.
   */
  OAO.content = function(env) {
    // Set file path.
    this.filePath = env.filePath || __dirname;

    // Get each desired environment variable.
    this.env.forEach(function(envvar) {
      OAO[ envvar ] = env[ envvar ];
    });

    return JSON.stringify(_.omit(this, this.util));
  };

  OAO.write = function() {
    var env = process.env,
        fs = require('fs'),
        content = '';

    // Make contents of file.
    content = this.content(env);

    // Write the file to the file system.
    fs.writeFileSync(this.file, content, null, '\t');

    // Handle error if no config.json was written to the file system.
    this.errorCallback(!fs.existsSync(this.file));

    return this;
  };

  // Export module for tests.
  if (module) {
    module.exports = OAO;
  }

  // Write config.json.
  return OAO.write();
}());
