/**
 * Configures Grunt, a task runner.
 */

// Declare variables for Grunt configuration and regex'ing.
var files = {};

/**
 * Set files to watch or edit, grouping related files together.
 */

// List project directories.
files.dir = {
    build: "build/",
    src: "src/",
    tests: "tests/"
};

// List development files.
files.dev = [ "*.sh", "*.json", "*.py", "*.yml", "README", ".gitignore",
    ".jshintrc", "gruntfile.js" ];

// List project's HTML.
files.html = [ "*.html", files.dir.tests + "**/*.html" ];

// List project's scripts.
files.scripts = [ "*.js", "src/**/*", "tests/unit/*.js",
    "tests/functional/*.js" ];

// List all project files.
files.all = (function() {
    return [].concat( files.dev, files.html, files.scripts );
}());

/**
 * Initialize configuration.
 */
module.exports = function( grunt ) {

    "use strict";

    /*
     * Loads plugins.
     *
     * @note Replaces need to load each task using grunt.loadNpmTasks.
     */
    require( "load-grunt-tasks" )( grunt, { pattern: [ "grunt-*",
        "!grunt-lib-phantomjs", "intern" ] } );

    /*
     * Displays execution time of Grunt tasks.
     */
    require( "time-grunt" )( grunt );

    /**
     * Initialize configuration object.
     */
    grunt.initConfig({

        // Set project settings.
        pkg: grunt.file.readJSON( "package.json" ),
        config: grunt.file.readJSON( "config.json" ),

        /**
         * Removes files.
         */
        clean: {
            build: {
                "src": [ "build/{**/}*.js" ]
            }
        },
        /**
         * Uses Node to serve the file system on a web server.
         */
        connect: {
            server: {
                options: {
                    base: {
                        options: { maxAge: 1000 * 60 * 5 },
                        path: "."
                    },
                    hostname: "localhost",
                    keepalive: true,
                    open: true,
                    port: 8080,
                    useAvailablePort: true,
                    onCreateServer: function() {
                        grunt.log.writeln( "Created server." );
                    }
                }
            }
        },
        /**
         * Runs tests using Intern.
         */
        intern: {
            options: {
                config: "tests/intern",
                sauceUsername: "<%= config.sauceUsername %>",
                sauceAccessKey: "<%= config.sauceAccessKey %>"
            },
            runner: {
                options: {
                    runType: "runner",
                    reporters: [ "Console" ],
                    suites: [ "tests/unit/index" ],
                    // functionalSuites: [ "tests/functional/index" ],
                    tunnel: "SauceLabsTunnel"
                }
            },
            client: {
                options: {
                    runType: "client",
                    reporters: [ "Console" ],
                    suites: [ "tests/unit/index" ]
                }
            }
        },
        /**
         * Lints JavaScript using JSLint.
         *
         * @link http://www.jshint.com/docs/options/
         */
        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: [ "*.js", "!node_modules" ]
            }
        },
        /**
         * Increments version number in package.json and commits it.
         */
        bump: {
            options: {
                files: [ "package.json" ],
                updateConfigs: [ "pkg" ],
                commit: true,
                commitMessage: "Increments version to %VERSION%.",
                commitFiles: [ "package.json" ],
                createTag: true,
                tagName: "v%VERSION%",
                tagMessage: "Increments version to %VERSION%.",
                push: false,
                pushTo: "hub",
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
                globalReplace: false
            }
        },
        /**
         * Replaces the given pattern with the given string.
         */
        replace: {
          // Update app's environment variables.
          config: {
            dest: "build/config.js",
            src: ["config.js"],
            replacements: [
              {
                from: /@API/,
                to: "<%= config.api %>",
              },
              {
                from: /@APIVERSION/,
                to: "<%= config.apiversion %>",
              },
              {
                from: /@GAID/,
                to: "<%= config.gaid %>",
              },
              {
                from: /@HOSTNAME/,
                to: "<%= config.hostname %>",
              },
              {
                from: /@RAYGUNAPIKEY/,
                to: "<%= config.Raygun_api_key %>",
              },
              {
                from: /@VERSION/,
                to: "<%= pkg.version %>",
              },
            ],
          },
        },
        /**
         * Enables executing Shell commands using Grunt.
         */
        shell: {
            options: {
                stdout: true
            },
            babel: {
                command: "babel ./src/index.js -o ./build/index.js"
            },
            // Writes the configuration file, config.json.
            config: {
                command: function() {
                    return "node env.js";
                }
            },
            update: {
                command: "sudo npm update"
            }
        },
        /**
         * Executes tasks when files change.
         */
        watch: {
            options: {
                atBegin: true,
                interrupt: true
            },
            all: {
                files: files.all,
                tasks: [ "lint", "test" ]
            },
            test: {
                files: files.all,
                tasks: [ "test" ]
            }
        }
    });

    /**
     * Register tasks.
     */

    // Configure the application using environment variables.
    grunt.registerTask( "config", [ "shell:config", "replace:config" ] );

    // Make a build.
    grunt.registerTask( "make", [ "config", "shell:babel" ] );

    // Assert the build meets the acceptance criteria.
    grunt.registerTask( "test", [ "intern:client" ] );

    // Assert the build meets the acceptance criteria.
    grunt.registerTask( "lint", [ "jshint" ] );

    // Make a build & deploy it to a web server.
    grunt.registerTask( "deploy", [ "make", "connect" ] );

    // Set default task to watch file changes.
    grunt.registerTask( "default", [ "deploy", "watch:all" ] );
};
