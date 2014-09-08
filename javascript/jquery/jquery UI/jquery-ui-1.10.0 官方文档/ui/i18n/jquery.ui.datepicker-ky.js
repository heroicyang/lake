<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Resizable - Preserve aspect ratio</title>
	<link rel="stylesheet" href="../../themes/base/jquery.ui.all.css">
	<script src="../../jquery-1.9.0.js"></script>
	<script src="../../ui/jquery.ui.core.js"></script>
	<script src="../../ui/jquery.ui.widget.js"></script>
	<script src="../../ui/jquery.ui.mouse.js"></script>
	<script src="../../ui/jquery.ui.resizable.js"></script>
	<link rel="stylesheet" href="../demos.css">
	<style>
	#resizable { width: 160px; height: 90px; padding: 0.5em; }
	#resizable h3 { text-align: center; margin: 0; }
	</style>
	<script>
	$(function() {
		$( "#resizable" ).resizable({
			aspectRatio: 16 / 9
		});
	});
	</script>
</head>
<body>

<div id="resizable" class="ui-widget-content">
	<h3 class="ui-widget-header">Preserve aspect ratio</h3>
</div>

<div class="demo-description">
<p>Maintain the existing aspect ratio or set a new one to constrain the proportions on resize. Set the <code>aspectRatio</code> option to true, and optionally pass in a new ratio (i.e., 4/3)</p>
</div>
</body>
</html>
