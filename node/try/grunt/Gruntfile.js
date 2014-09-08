module.exports = function(grunt) {
////////////////////begin/////////
grunt.initConfig({
  	concat: {
    	jsfile: {
        	src: ['a.js', 'b.js'],
        	dest: 'x/c.js'
     	}
  	},
  	uglify:{
  		main:{
  			src:['x/c.js'],
  			dest:'x/c.min.js'
  		}
  	}

});
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default',['concat','uglify']);
/////////////////////end//////////
};
