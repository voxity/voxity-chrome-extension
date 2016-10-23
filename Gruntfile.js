var htmlminOpt = {
    collapseBooleanAttributes:      true,
    collapseWhitespace:             true,
    removeAttributeQuotes:          true,
    removeComments:                 true,
    removeEmptyAttributes:          true,
    removeRedundantAttributes:      true,
    removeScriptTypeAttributes:     true,
    removeStyleLinkTypeAttributes:  true
};

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src:'voxity-chrome-extension',
            dest:'dist'
        },
        concat: {
            appCore:{
                src: [
                    '<%= dirs.src %>/app/core/core.js',
                    '<%= dirs.src %>/app/core/filters.js',
                    '<%= dirs.src %>/app/core/services.js',
                    '<%= dirs.src %>/app/core/controllers.js',
                    '<%= dirs.dest %>/app/core.err.tpl.js',
                    '<%= dirs.dest %>/app/core.settings.tpl.js',
                ],
                dest: '<%= dirs.dest %>/app/core.js'
            },
            appUsers:{
                src: [
                    '<%= dirs.src %>/app/users/users.js',
                    '<%= dirs.src %>/app/users/services.js',
                ],
                dest: '<%= dirs.dest %>/app/users.js'
            },
            appChannels: {
                src:[
                    '<%= dirs.src %>/app/channels/channels.js',
                    '<%= dirs.src %>/app/channels/services.js',
                    '<%= dirs.src %>/app/channels/controllers.js',
                ],
                dest: '<%= dirs.dest %>/app/channels.js'
            },
            appContacts: {
                src:[
                    '<%= dirs.src %>/app/contacts/contacts.js',
                    '<%= dirs.src %>/app/contacts/services.js',
                    '<%= dirs.src %>/app/contacts/controllers.js',
                    '<%= dirs.dest %>/app/contacts.tpl.js'
                ],
                dest: '<%= dirs.dest %>/app/contacts.js'
            },
            appDevices: {
                src:[
                    '<%= dirs.src %>/app/devices/devices.js',
                    '<%= dirs.src %>/app/devices/services.js',
                    '<%= dirs.src %>/app/devices/controllers.js',
                    '<%= dirs.dest %>/app/devices.tpl.js'
                ],
                dest: '<%= dirs.dest %>/app/devices.js'
            },
            fullApp:{
                src:[
                    '<%= dirs.dest %>/app/core.min.js',
                    '<%= dirs.dest %>/app/users.min.js',
                    '<%= dirs.dest %>/app/channels.min.js',
                    '<%= dirs.dest %>/app/contacts.min.js',
                    '<%= dirs.dest %>/app/devices.min.js',
                    '<%= dirs.src %>/app/app.js',
                    '<%= dirs.src %>/app/index.js'
                ],
                dest: '<%= dirs.dest %>/app/index.js'
            }
        },
        ngtemplates:{
            'voxity.contacts':{
                cwd: '<%= dirs.src %>/app/views/contacts/',
                src: '**.html',
                dest: '<%= dirs.dest %>/app/contacts.tpl.js',
                options: {
                    prefix:'/views/contacts',
                    htmlmin: htmlminOpt
                }
            },
            'err':{
                cwd: '<%= dirs.src %>/app/views/err/',
                src: '**.html',
                dest: '<%= dirs.dest %>/app/core.err.tpl.js',
                options: {
                    module: 'voxity.core',
                    prefix:'/views/err',
                    htmlmin: htmlminOpt
                }
            },
            'settings': {
                cwd: '<%= dirs.src %>/app/views/settings/',
                src: '**.html',
                dest: '<%= dirs.dest %>/app/core.settings.tpl.js',
                options: {
                    module: 'voxity.core',
                    prefix:'/views/settings',
                    htmlmin: htmlminOpt
                }
            },
            'voxity.devices':{
                cwd: '<%= dirs.src %>/app/views/devices/',
                src: '**.html',
                dest: '<%= dirs.dest %>/app/devices.tpl.js',
                options: {
                    prefix:'/views/devices',
                    htmlmin: htmlminOpt
                }
            }

        },
        uglify: {
            apps:{
                files: {
                    '<%= dirs.dest %>/app/core.min.js': ['<%= dirs.dest %>/app/core.js'],
                    '<%= dirs.dest %>/app/users.min.js': ['<%= dirs.dest %>/app/users.js'],
                    '<%= dirs.dest %>/app/channels.min.js': ['<%= dirs.dest %>/app/channels.js'],
                    '<%= dirs.dest %>/app/contacts.min.js': ['<%= dirs.dest %>/app/contacts.js'],
                    '<%= dirs.dest %>/app/devices.min.js': ['<%= dirs.dest %>/app/devices.js'],
                }
            },
            app:{
                files : {
                    '<%= dirs.dest %>/app/index.min.js': ['<%= dirs.dest %>/app/index.js'],
                }
            }
        },
        clean: {
            dist: ['<%= dirs.dest %>/*'],
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', [
        'clean:dist', 'ngtemplates',
        'concat:appCore', 'concat:appUsers', 'concat:appChannels', 'concat:appContacts', 'concat:appDevices',
        'uglify:apps',
        'concat:fullApp', 'uglify:app']);

};
