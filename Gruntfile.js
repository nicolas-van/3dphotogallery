

module.exports = function(grunt) {

    var _ = require("underscore");

    var libjsfiles = [
        "bower_components/underscore/underscore.js",
        "bower_components/jquery/dist/jquery.js",
        "bower_components/threejs/build/three.js",
    ];
    var myjsfiles = [
        "src/js/app.js",
    ];
    var jsfiles = [].concat(libjsfiles).concat(myjsfiles);

    grunt.initConfig({
        jshint: {
            files: myjsfiles,
            options: {
                sub: true,
                eqeqeq: true, // no == or !=
                immed: true, // forces () around directly called functions
                forin: true, // makes it harder to use for in
                latedef: "nofunc", // makes it impossible to use a variable before it is declared
                newcap: true, // force capitalized constructors
                strict: true, // enforce strict mode
                trailing: true, // trailing whitespaces are ugly
                camelcase: true, // force camelCase
            },
        },
        clean: {
            all: {
                src: ["static", 'filesconfig.json'],
            },
            tmpjs: {
                src: ['tmp.js'],
            }
        },
        uglify: {
            dist: {
                files: {
                    'static/all.js': jsfiles,
                }
            },
        },
        "file-creator": {
            dev_tmpjs: {
                files: [{
                    file: "tmp.js",
                    method: function(fs, fd, done) {
                        var files = _.map(jsfiles, function(el) { return "" + el; });
                        fs.writeSync(fd, "window['$'] = head.ready;\n" +
                        "head.load.apply(head, " + JSON.stringify(files) + ");\n");
                        done();
                    }
                }],
            },
            dev_config: {
                files: [{
                    file: "filesconfig.json",
                    method: function(fs, fd, done) {
                        fs.writeSync(fd, JSON.stringify({"static_folders": ["bower_components", "src", "static"]}));
                        done();
                    }
                }],
            },
            dist_config: {
                files: [{
                    file: "filesconfig.json",
                    method: function(fs, fd, done) {
                        fs.writeSync(fd, JSON.stringify({"static_folders": ["static"]}));
                        done();
                    }
                }],
            },
        },
        concat: {
            dev: {
                src: ['bower_components/headjs/dist/1.0.0/head.load.js', 'tmp.js'],
                dest: 'static/all.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-file-creator');

    grunt.registerTask('dev', ['file-creator:dev_tmpjs', "concat:dev", "clean:tmpjs", 'file-creator:dev_config']);
    grunt.registerTask('dist', ['uglify:dist', 'file-creator:dist_config']);

    grunt.registerTask('default', ['dev']);

};