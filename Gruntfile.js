module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src:'voxity-chrome-extension',
            dest:'dist'
        },
        concat: {
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
                    '<%= dirs.dest %>/app/contacts.tpl.min.js'
                ],
                dest: '<%= dirs.dest %>/app/contacts.js'
            },
        },
        ngtemplates:{
            'voxity.contacts':{
                cwd: '<%= dirs.src %>/app',
                src: '/views/contacts/**.html',
                dest: '<%= dirs.dest %>/app/contacts.tpl.js',
                options: {
                    htmlmin:  {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true,
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }

            },
        },
        uglify: {
            appChannels:{
                files: {
                    '<%= dirs.dest %>/app/channels.min.js': ['<%= dirs.dest %>/app/channels.js'],
                    '<%= dirs.dest %>/app/contacts.min.js': ['<%= dirs.dest %>/app/contacts.js'],
                    '<%= dirs.dest %>/app/contacts.tpl.min.js': ['<%= dirs.dest %>/app/contacts.tpl.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');

    // Default task(s).
    grunt.registerTask('default', ['ngtemplates', 'concat', 'uglify']);

};
