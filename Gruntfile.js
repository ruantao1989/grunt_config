module.exports = function(grunt) {
    grunt.initConfig({
        config: {
            "name": "app2014",
            "version": "0.5.0",
            "author": "Rt",

            "srcPath": "src",
            "buildPath": "build/dest/",
            "compatibility":"ie7",//设置css兼容性模式
            "banner": '/*<%=config.name%> v<%=config.version%>:<%=grunt.template.today("yyyy-mm-dd,h:MM:ss TT")%>*/\n'
        },
        pkg: grunt.file.readJSON('package.json'),
        /* js合并 */
        concat: {
            options: {
                compatibility : '<%=config.compatibility%>',
                separator: ';',
                stripBanners: true,
                banner: '<%=config.banner%>',
                beautify: {
                    ascii_only: true//防止中文乱码
                }
            },
            js_build: {
                files: [{
                    src: ['<%=config.srcPath%>/**/*.js'], //?匹配单个字符, *匹配任何字符, **是全部匹配
                    dest: '<%=config.buildPath%>build-all.<%=config.version%>.js' //输出目录
                }]
            },
            css_build: {
                files: [{
                    src: ['<%=config.srcPath%>/**/*.css'], //?匹配单个字符, *匹配任何字符, **是全部匹配
                    dest: '<%=config.buildPath%>build-all.<%=config.version%>.js' //输出目录
                }]
            },
            css_index: {
                
            }
        },
        /* 清理 */
        clean: {
            build: {
                src: ["<%=config.buildPath%>"] //删除build/dest目录
            }
        },
        /* js压缩 */
        uglify: {
            options: {
                //min.js中头部的注释
                banner: '<%=config.banner%>'
            },
            build: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%=config.srcPath%>', //路径是当前目录下的src文件夹
                    src: ['**/*.js', '!**/*.min.js'], //?匹配单个字符, *匹配任何字符, **是全部匹配
                    dest: '<%=config.buildPath%>', //输出目录
                    //ext: '<%=config.version%>.min.js',   //可以在文件名加入版本号, 避免缓存
                    //rename是来处理文件名中有多个"点"的情况,如果用ext只会保留从左数第一个点之前的文件名,其余会被截掉
                    rename: function(dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/')),
                            filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return '<%=config.buildPath%>' + folder + filename + ".js"/*'.<%=config.version%>.js'*/;
                    }
                }]
            }
        },
        /* css压缩 */
        cssmin: {
            options: {
                compatibility : '<%=config.compatibility%>',
                noAdvanced : true, //取消高级特性 
                keepSpecialComments: 0,
                banner: '<%=config.banner%>',
                beautify: {
                    ascii_only: true//防止中文乱码
                }
            },
            build: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%=config.srcPath%>', //路径是当前目录下的src文件夹
                    src: ['**/*.css', '!**/*.min.css'], //?匹配单个字符, *匹配任何字符, **是全部匹配
                    dest: '<%=config.buildPath%>', //输出目录
                    //ext: '<%=config.version%>.min.js',   //可以在文件名加入版本号, 避免缓存
                    rename: function(dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/')),
                            filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return '<%=config.buildPath%>' + folder + filename + ".css"/*'.<%=config.version%>.css'*/;
                    }
                }]
            }
        },
        /* js校验 */
        jshint: {
            options: {},
            all: ['<%=config.srcPath%>/**.js']
        },
        /* 图片压缩 */
        imagemin: {
            build: {
                options: {
                    optimizationLevel: 3 //定义图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: '<%=config.srcPath%>/img/',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化目录下所有 png/jpg/jpeg 图片
                    dest: '<%=config.buildPath%>/img/' // 优化后的图片保存位置, 覆盖旧图片, 并且不作提示
                }]
            }
        },
        /* 监控文件变化,自动执行任务 */
        watch: {
            files: ['<%=config.srcPath%>/**'],
            tasks: ['js_min', 'css_min']
        },
        /**/
        // 自动雪碧图
        sprite: {
            options: {
                // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
                imagepath: 'src/img/tips/',
                // 映射CSS中背景路径，支持函数和数组，默认为 null
                imagepath_map: null,
                // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
                spritedest: 'build/img/',
                // 替换后的背景路径，默认 ../images/
                spritepath: '../img/',
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 2,
                // 是否使用 image-set 作为2x图片实现，默认不使用
                useimageset: false,
                // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
                newsprite: false,
                // 给雪碧图追加时间戳，默认不追加
                spritestamp: true,
                // 在CSS文件末尾追加时间戳，默认不追加
                cssstamp: true,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree',
                // 默认使用`pngsmith`图像处理引擎
                engine: 'pngsmith'
            },
            autoSprite: {
                files: [{
                    // 启用动态扩展
                    expand: true,
                    // css文件源的文件夹
                    cwd: 'src/css/',
                    // 匹配规则
                    src: '*.css',
                    // 导出css和sprite的路径地址
                    dest: 'build/css/',
                    // 导出的css名
                    ext: '.sprite.css'
                }]
            }
        }
    //end of initConfig
    });

    // 载入插件
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css-sprite');

    // 任务名称: 注意任务名称不能和插件名相同, 如不指定任务名称则默认是'default'
    grunt.registerTask('js_concat', ["合并全部js文件"], ['concat:js_build']);
    grunt.registerTask('css_concat', ["合并全部js文件"], ['concat:css_build']);
    grunt.registerTask('all_clean', ["清除全部文件"], ['clean:build']);
    grunt.registerTask('js_min', ["压缩js文件"], ['uglify:build']);
    grunt.registerTask('css_min', ["压缩css文件"], ['cssmin:build']);
    grunt.registerTask('css_s', ['sprite']);
    grunt.registerTask('js_test', ["js校验"], ['jshint:all']);
    grunt.registerTask('img_min', ["无损压缩图片"], ['imagemin:build']);
    grunt.registerTask('default', ["默认全部任务"], [ /*'concat',*/ 'clean:build', 'uglify:build', 'cssmin:build', 'imagemin:build']);
};