<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Resizable - Textarea</title>
	<link rel="stylesheet" href="../../themes/base/jquery.ui.all.css">
	<script src="../../jquery-1.9.0.js"></script>
	<script src="../../ui/jquery.ui.core.js"></script>
	<script src="../../ui/jquery.ui.widget.js"></script>
	<script src="../../ui/jquery.ui.mouse.js"></script>
	<script src="../../ui/jquery.ui.resizable.js"></script>
	<link rel="stylesheet" href="../demos.css">
	<style>
	.ui-resizable-se {
		bottom: 17px;
	}
	</style>
	<script>
	$(function() {
		$( "#resizable" ).resizable({
			handles: "se"
		});
	});
	</script>
</head>
<body>

<textarea id="resizable" rows="5" cols="20"></textarea>

<div class="demo-description">
<p>Display only an outline of the element while resizing by setting the <code>helper</code> option to a CSS class.</p>
</div>
</body>
</html>
