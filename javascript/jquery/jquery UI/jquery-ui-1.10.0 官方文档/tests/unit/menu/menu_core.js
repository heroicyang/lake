<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Datepicker - Show week of the year</title>
	<link rel="stylesheet" href="../../themes/base/jquery.ui.all.css">
	<script src="../../jquery-1.9.0.js"></script>
	<script src="../../ui/jquery.ui.core.js"></script>
	<script src="../../ui/jquery.ui.widget.js"></script>
	<script src="../../ui/jquery.ui.datepicker.js"></script>
	<link rel="stylesheet" href="../demos.css">
	<script>
	$(function() {
		$( "#datepicker" ).datepicker({
			showWeek: true,
			firstDay: 1
		});
	});
	</script>
</head>
<body>

<p>Date: <input type="text" id="datepicker"></p>

<div class="demo-description">
<p>The datepicker can show the week of the year. The default calculation follows
	the ISO 8601 definition: the week starts on Monday, the first week of the year
	contains the first Thursday of the year. This means that some days from one
	year may be placed into weeks 'belonging' to another year.</p>
</div>
</body>
</html>
