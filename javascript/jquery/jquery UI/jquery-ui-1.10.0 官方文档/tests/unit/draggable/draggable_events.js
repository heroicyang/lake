<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Spinner - Time</title>
	<link rel="stylesheet" href="../../themes/base/jquery.ui.all.css">
	<script src="../../jquery-1.9.0.js"></script>
	<script src="../../external/jquery.mousewheel.js"></script>
	<script src="../../external/globalize.js"></script>
	<script src="../../external/globalize.culture.de-DE.js"></script>
	<script src="../../ui/jquery.ui.core.js"></script>
	<script src="../../ui/jquery.ui.widget.js"></script>
	<script src="../../ui/jquery.ui.button.js"></script>
	<script src="../../ui/jquery.ui.spinner.js"></script>
	<link rel="stylesheet" href="../demos.css">
	<script>
	$.widget( "ui.timespinner", $.ui.spinner, {
		options: {
			// seconds
			step: 60 * 1000,
			// hours
			page: 60
		},

		_parse: function( value ) {
			if ( typeof value === "string" ) {
				// already a timestamp
				if ( Number( value ) == value ) {
					return Number( value );
				}
				return +Globalize.parseDate( value );
			}
			return value;
		},

		_format: function( value ) {
			return Globalize.format( new Date(value), "t" );
		}
	});

	$(function() {
		$( "#spinner" ).timespinner();

		$( "#culture" ).change(function() {
			var current = $( "#spinner" ).timespinner( "value" );
			Globalize.culture( $(this).val() );
			$( "#spinner" ).timespinner( "value", current );
		});
	});
	</script>
</head>
<body>

<p>
	<label for="spinner">Time spinner:</label>
	<input id="spinner" name="spinner" value="08:30 PM">
</p>
<p>
	<label for="culture">Select a culture to use for formatting:</label>
	<select id="culture">
		<option value="en-EN" selected="selected">English</option>
		<option value="de-DE">German</option>
	</select>
</p>

<div class="demo-description">
<p>
	A custom widget extending spinner. Use the Globalization plugin to parse and output
	a timestamp, with custom step and page options. Cursor up/down spins minutes, page up/down
	spins hours.
</p>
</div>
</body>
</html>
