<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<script type="text/javascript">
	function show(func1){
  		var na={
  				a:'Nodejs',
  				b:'Python',
  				c:'C',
  				d:'C++'
  			}
  		var nb='haha'
  		func1(na,nb)
	}
	show(function(a,b){
		console.log(a.a);
		console.log(a.b);
		console.log(a.c);
		console.log(a.d);
		console.log(b);
	})
</script>
</body>
</html>