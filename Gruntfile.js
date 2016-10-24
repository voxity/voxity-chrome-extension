

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            srcAngApp: 'voxity-chrome-extension/app',
            dstAngApp: 'dist/app',
            src:'voxity-chrome-extension',
            dest:'dist'
        },
        vars :{
            htmlminOpt: {
                collapseBooleanAttributes:      true,
                collapseWhitespace:             true,
                removeAttributeQuotes:          true,
                removeComments:                 true,
                removeEmptyAttributes:          true,
                removeRedundantAttributes:      true,
                removeScriptTypeAttributes:     true,
                removeStyleLinkTypeAttributes:  true
            }
        },
        concat: {
            templates:{
                src: [
                    '<%= dirs.dstAngApp %>/index.min.js',
                    '<%= ngtemplates.contacts.dest %>',
                    '<%= ngtemplates.err.dest %>',
                    '<%= ngtemplates.settings.dest %>',
                    '<%= ngtemplates.devices.dest %>'
                ],
                dest:'<%= dirs.dstAngApp %>/index.min.js'
            }
        },
        ngtemplates:{
            'contacts':{
                cwd: '<%= dirs.srcAngApp %>/views/contacts/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/contacts.tpl.js',
                options: {
                    module: 'voxity.contacts',
                    prefix:'/views/contacts',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            },
            'err':{
                cwd: '<%= dirs.srcAngApp %>/views/err/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/core.err.tpl.js',
                options: {
                    module: 'voxity.core',
                    prefix:'/views/err',
                    htmlmin: '<%= vars.htmlminOpt %>'

                }
            },
            'settings': {
                cwd: '<%= dirs.srcAngApp %>/views/settings/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/core.settings.tpl.js',
                options: {
                    module: 'voxity.core',
                    prefix:'/views/settings',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            },
            'devices':{
                cwd: '<%= dirs.srcAngApp %>/views/devices/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/devices.tpl.js',
                options: {
                    module: 'voxity.devices',
                    prefix:'/views/devices',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            }
        },
        clean: {
            dist: ['<%= dirs.dest %>/*'],
            templates: ['<%= dirs.dstAngApp %>/*.tpl.js']
        },
        useminPrepare: {
            html: '<%= dirs.srcAngApp %>/index.html',
        },
        usemin: {
            html: ['<%= dirs.dstAngApp %>/index.html']
        },
        uglify: {
            templates: {
                files:[{
                    dest: '<%= concat.templates.dest %>',
                    src:[ '<%= concat.templates.dest %>',]
                }]
            }
        },
        cssmin: {
            css: {
                files:{
                    '<%= dirs.dest %>/css/options.css': '<%= dirs.src %>/css/options.css'
                }
            }
        },
        copy: {
            main:{
                files: [
                    {
                        cwd:'<%= dirs.src %>/libs/assets/icons',
                        src: ['*.*',],
                        dest: '<%= dirs.dest %>/libs/assets/icons',
                        expand: true
                    },
                    {
                        cwd:'<%= dirs.src %>',
                        src: ['*.*',],
                        dest: '<%= dirs.dest %>',
                        expand: true
                    },
                ]
            },
            angularApp: {
                files: [
                    {
                        cwd:'<%= dirs.src %>/libs/assets/bootstrap/dist/',
                        src: [
                            '**',
                            '!css/bootstrap-theme*',
                            '!js/**'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/bootstrap/',
                        expand: true
                    },{
                        cwd: '<%= dirs.src %>/libs/assets/font-awesome/',
                        src: [
                            'css/**',
                            'fonts/**'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/font-awesome/',
                        expand: true

                    },
                    {
                        src: ['<%= dirs.srcAngApp %>/index.html'],
                        dest: '<%= dirs.dstAngApp %>/index.html'
                    }
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', [
        'clean:dist',
        'copy',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin',
        'usemin',
        'ngtemplates',
        'concat:templates',
        'uglify:templates',
        'clean:templates'
    ]);
};
