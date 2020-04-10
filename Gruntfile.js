
var path = require("path");
var fs = require("fs-extra");

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            dist: ".dist"
        },
        jshint: {
            options: {
                jshintrc:true
                // http://www.jshint.com/docs/options/
                //"asi": true,      // allow missing semicolons
                //"curly": true,    // require braces
                //"eqnull": true,   // ignore ==null
                //"forin": true,    // require property filtering in "for in" loops
                //"immed": true,    // require immediate functions to be wrapped in ( )
                //"nonbsp": true,   // warn on unexpected whitespace breaking chars
                ////"strict": true, // commented out for now as it causes 100s of warnings, but want to get there eventually
                //"loopfunc": true, // allow functions to be defined in loops
                //"sub": true       // don't warn that foo['bar'] should be written as foo.bar
            },
            // all: [
            //     'Gruntfile.js',
            //     'red.js',
            //     'packages/**/*.js'
            // ],
            // core: {
            //     files: {
            //         src: [
            //             'Gruntfile.js',
            //             'red.js',
            //             'packages/**/*.js',
            //         ]
            //     }
            // },
            src: {
                files: {
                    src: [ 'src/*.js' ]
                }
            },
            tests: {
                files: {
                    src: ['test/*.js']
                },
                options: {
                    "expr": true
                }
            }
        },
        jsonlint: {
            messages: {
                src: [
                    'packages/node_modules/@node-red/nodes/locales/**/*.json',
                    'packages/node_modules/@node-red/editor-client/locales/**/*.json',
                    'packages/node_modules/@node-red/runtime/locales/**/*.json'
                ]
            },
            keymaps: {
                src: [
                    'packages/node_modules/@node-red/editor-client/src/js/keymap.json'
                ]
            }
        },
        attachCopyright: {
            js: {
                src: [
                    'packages/node_modules/@node-red/editor-client/public/red/red.min.js',
                    'packages/node_modules/@node-red/editor-client/public/red/main.min.js'
                ]
            },
            css: {
                src: [
                    'packages/node_modules/@node-red/editor-client/public/red/style.min.css'
                ]
            }
        },
        clean: {
            build: {
                src: [
                    "packages/node_modules/@node-red/editor-client/public/red",
                    "packages/node_modules/@node-red/editor-client/public/index.html",
                    "packages/node_modules/@node-red/editor-client/public/favicon.ico",
                    "packages/node_modules/@node-red/editor-client/public/icons",
                    "packages/node_modules/@node-red/editor-client/public/vendor"
                ]
            },
            release: {
                src: [
                    '<%= paths.dist %>'
                ]
            }
        },
        watch: {
            js: {
                files: [
                    'packages/node_modules/@node-red/editor-client/src/js/**/*.js'
                ],
                tasks: ['copy:build','concat',/*'uglify',*/ 'attachCopyright:js']
            },
            sass: {
                files: [
                    'packages/node_modules/@node-red/editor-client/src/sass/**/*.scss'
                ],
                tasks: ['sass','attachCopyright:css']
            },
            json: {
                files: [
                    'packages/node_modules/@node-red/nodes/locales/**/*.json',
                    'packages/node_modules/@node-red/editor-client/locales/**/*.json',
                    'packages/node_modules/@node-red/runtime/locales/**/*.json'
                ],
                tasks: ['jsonlint:messages']
            },
            keymaps: {
                files: [
                    'packages/node_modules/@node-red/editor-client/src/js/keymap.json'
                ],
                tasks: ['jsonlint:keymaps','copy:build']
            },
            misc: {
                files: [
                    'CHANGELOG.md'
                ],
                tasks: ['copy:build']
            }
        },
        jsdoc : {
            modules: {
                src: [
                    'main.js'
                ],
                options: {
                    destination: 'docs',
                    configure: './jsdoc.json'
                }
            }
        },
        jsdoc2md: {
            runtimeAPI: {
                options: {
                    separators: true
                },
                src: [
                    'packages/node_modules/@node-red/runtime/lib/index.js',
                    'packages/node_modules/@node-red/runtime/lib/api/*.js',
                    'packages/node_modules/@node-red/runtime/lib/events.js'
                ],
                dest: 'packages/node_modules/@node-red/runtime/docs/api.md'
            },
            nodeREDUtil: {
                options: {
                    separators: true
                },
                src: 'packages/node_modules/@node-red/util/**/*.js',
                dest: 'packages/node_modules/@node-red/util/docs/api.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

    grunt.registerMultiTask('attachCopyright', function() {
        var files = this.data.src;
        var copyright = "/**\n"+
            " * Copyright JS Foundation and other contributors, http://js.foundation\n"+
            " *\n"+
            " * Licensed under the Apache License, Version 2.0 (the \"License\");\n"+
            " * you may not use this file except in compliance with the License.\n"+
            " * You may obtain a copy of the License at\n"+
            " *\n"+
            " * http://www.apache.org/licenses/LICENSE-2.0\n"+
            " *\n"+
            " * Unless required by applicable law or agreed to in writing, software\n"+
            " * distributed under the License is distributed on an \"AS IS\" BASIS,\n"+
            " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"+
            " * See the License for the specific language governing permissions and\n"+
            " * limitations under the License.\n"+
            " **/\n";

        if (files) {
            for (var i=0; i<files.length; i++) {
                var file = files[i];
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('File '+ file + ' not found');
                    return false;
                } else {
                    var content = grunt.file.read(file);
                    if (content.indexOf(copyright) == -1) {
                        content = copyright+content;
                        if (!grunt.file.write(file, content)) {
                            return false;
                        }
                        grunt.log.writeln("Attached copyright to "+file);
                    } else {
                        grunt.log.writeln("Copyright already on "+file);
                    }
                }
            }
        }
    });

    grunt.registerTask('generatePublishScript',
        'Generates a script to publish build output to npm',
            function () {
                const done = this.async();
                const generatePublishScript = require("./scripts/generate-publish-script.js");
                generatePublishScript().then(function(output) {
                    grunt.log.writeln(output);

                    const filePath = path.join(grunt.config.get('paths.dist'),"modules","publish.sh");
                    grunt.file.write(filePath,output);

                    done();
                });
            });
    grunt.registerTask('setDevEnv',
        'Sets NODE_ENV=development so non-minified assets are used',
            function () {
                process.env.NODE_ENV = 'development';
            });

    grunt.registerTask('default',
        'Builds editor content then runs code style checks and unit tests on all components',
        ['build','verifyPackageDependencies','jshint:editor','mocha_istanbul:all']);

    grunt.registerTask('test-core',
        'Runs code style check and unit tests on core runtime code',
        ['build','mocha_istanbul:core']);

    grunt.registerTask('test-editor',
        'Runs code style check on editor code',
        ['jshint:editor']);

    if (!fs.existsSync(path.join("node_modules", "grunt-webdriver"))) {
        grunt.registerTask('test-ui',
            'Builds editor content then runs unit tests on editor ui',
            ['verifyUiTestDependencies']);
    } else {
        grunt.registerTask('test-ui',
            'Builds editor content then runs unit tests on editor ui',
            ['verifyUiTestDependencies','build','jshint:editor','webdriver:all']);
    }

    grunt.registerTask('test-nodes',
        'Runs unit tests on core nodes',
        ['build','mocha_istanbul:nodes']);

    grunt.registerTask('build',
        'Builds editor content',
        ['clean:build','jsonlint','concat:build','concat:vendor','copy:build','uglify:build','sass:build','attachCopyright']);

    grunt.registerTask('dev',
        'Developer mode: run node-red, watch for source changes and build/restart',
        ['build','setDevEnv','concurrent:dev']);

    grunt.registerTask('release',
        'Create distribution zip file',
        ['build','verifyPackageDependencies','clean:release','mkdir:release','chmod:release','compress:release','pack-modules','generatePublishScript']);

    grunt.registerTask('pack-modules',
        'Create module pack files for release',
        ['mkdir:release','npm-command']);


    grunt.registerTask('coverage',
        'Run Istanbul code test coverage task',
        ['build','mocha_istanbul:all']);

    grunt.registerTask('docs',
        'Generates API documentation',
        ['jsdoc']);
};
