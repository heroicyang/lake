module.exports=function(grunt){

	grunt.initConfig({
		//copy命令
		copy:{
			main:{
				files:[
					{expand:true,cwd:'src/',src:['**'],dest:'dest/'}
				]
			}
		},
		//合并命令
		concat:{
			dist:{
				src:['src/**/*.js'],
				dest:'dist/main.js'
			}
		},
		//压缩命令
		uglify:{
			options: {
      			banner: '/*hello world\n haha*/\n'
    		},
			dist:{
				files:{'dist/main.min.js':['src/**/*.js']}
			}
		},
		//观察任务
		watch:{
			files:['src/**/*.js'],
			tasks:['uglify']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default',['uglify']);
}
