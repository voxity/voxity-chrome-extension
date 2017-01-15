

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
                    '<%= dirs.dest %>/index.min.js',
                    '<%= ngtemplates.contacts.dest %>',
                    '<%= ngtemplates.core.dest %>',
                    '<%= ngtemplates.devices.dest %>',
                    '<%= ngtemplates.app.dest %>',
                    // '<%= ngtemplates.sms.dest %>'
                ],
                dest:'<%= dirs.dest %>/index.min.js'
            }
        },
        ngtemplates:{
            'app':{
                cwd: '<%= dirs.srcAngApp %>/views/',
                src: '*.html',
                dest: '<%= dirs.dstAngApp %>/app.tpl.js',
                options: {
                    module: 'voxityChromeApp',
                    prefix:'views/',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            },
            'contacts':{
                cwd: '<%= dirs.srcAngApp %>/views/contacts/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/contacts.tpl.js',
                options: {
                    module: 'voxity.contacts',
                    prefix:'views/contacts/',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            },
            'core': {
                cwd: '<%= dirs.srcAngApp %>/views/core/',
                src: ['**.html', '*/**.html'],
                dest: '<%= dirs.dstAngApp %>/core.tpl.js',
                options: {
                    module: 'voxity.core',
                    prefix:'views/core/',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            },
            'devices':{
                cwd: '<%= dirs.srcAngApp %>/views/devices/',
                src: '**.html',
                dest: '<%= dirs.dstAngApp %>/devices.tpl.js',
                options: {
                    module: 'voxity.devices',
                    prefix:'views/devices/',
                    htmlmin: '<%= vars.htmlminOpt %>'
                }
            }//,
            // 'sms':{
            //     cwd: '<%= dirs.srcAngApp %>/views/sms/',
            //     src: '**.html',
            //     dest: '<%= dirs.dstAngApp %>/sms.tpl.js',
            //     options: {
            //         module: 'voxity.sms',
            //         prefix:'views/sms/',
            //         htmlmin: '<%= vars.htmlminOpt %>'
            //     }
            // }
        },
        clean: {
            dist: ['<%= dirs.dest %>/*'],
            templates: ['<%= dirs.dstAngApp %>/*.tpl.js', '<%= dirs.dest %>/index.min.js']
        },
        useminPrepare: {
            html: '<%= dirs.srcAngApp %>/index.html'
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
                    '<%= dirs.dest %>/css/options.css': '<%= dirs.src %>/css/options.css',
                    '<%= dirs.dest %>/css/app.css': '<%= dirs.src %>/css/app.css'
                }
            }
        },
        copy: {
            main:{
                files: [
                    {
                        cwd:'<%= dirs.src %>/libs/icons',
                        src: ['*.*',],
                        dest: '<%= dirs.dest %>/libs/icons',
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
            angular: {
                files: [
                    {
                        cwd:'<%= dirs.src %>/libs/assets/bootstrap/dist/',
                        src: [
                            '**',
                            '!css/bootstrap-theme*',
                            '!js/**'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/bootstrap/dist/',
                        expand: true
                    },{
                        cwd: '<%= dirs.src %>/libs/assets/font-awesome/',
                        src: [
                            'css/**',
                            'fonts/**'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/font-awesome/',
                        expand: true

                    },{
                        src: ['<%= dirs.srcAngApp %>/index.html'],
                        dest: '<%= dirs.dstAngApp %>/index.html'
                    },{
                        src: ['<%= dirs.src %>/libs/assets/animate.css/animate.min.css'],
                        dest: '<%= dirs.dest %>/libs/assets/animate.css/animate.min.css'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular/',
                        src: [
                            'angular.min.js',
                            'angular.min.js.map',
                            'LICENSE.md',
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-i18n/',
                        src: [
                            'fr-fr.js',
                            'LICENSE.md'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-i18n/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-route/',
                        src: [
                            'angular-route.min.js',
                            'angular-route.min.js.map',
                            'LICENSE.md'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-route/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-sanitize/',
                        src: [
                            'angular-sanitize.min.js',
                            'angular-sanitize.min.js.map',
                            'LICENSE.md'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-sanitize/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-animate/',
                        src: [
                            'angular-animate.min.js',
                            'angular-animate.min.js.map',
                            'LICENSE.md'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-animate/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-bootstrap/',
                        src: [
                            'ui-bootstrap-tpls.min.js',
                            'angular-bootstrap.min.js.map',
                            'LICENSE.md'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-bootstrap/'
                    },{
                        expand: true,
                        cwd: '<%= dirs.src %>/libs/assets/angular-filter/',
                        src: [
                            'license.md',
                            'dist/angular-filter.min.js'
                        ],
                        dest: '<%= dirs.dest %>/libs/assets/angular-filter/'
                    }
                ]
            },
            finaly: {
                files: [
                    {
                        src: ['<%= dirs.dest %>/index.min.js'],
                        dest: '<%= dirs.dstAngApp %>/index.min.js'
                    },{
                        src: ['<%= dirs.dest %>/assets.min.js'],
                        dest: '<%= dirs.dstAngApp %>/assets.min.js'
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
        'copy:main',
        'copy:angular',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin',
        'usemin',
        'ngtemplates',
        'concat:templates',
        'uglify:templates',
        'copy:finaly',
        'clean:templates',
    ]);
};
