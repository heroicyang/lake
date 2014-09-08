<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Sortable - Connect lists with Tabs</title>
	<link rel="stylesheet" href="../../themes/base/jquery.ui.all.css">
	<script src="../../jquery-1.9.0.js"></script>
	<script src="../../ui/jquery.ui.core.js"></script>
	<script src="../../ui/jquery.ui.widget.js"></script>
	<script src="../../ui/jquery.ui.mouse.js"></script>
	<script src="../../ui/jquery.ui.sortable.js"></script>
	<script src="../../ui/jquery.ui.droppable.js"></script>
	<script src="../../ui/jquery.ui.tabs.js"></script>
	<link rel="stylesheet" href="../demos.css">
	<style>
	#sortable1 li, #sortable2 li { margin: 0 5px 5px 5px; padding: 5px; font-size: 1.2em; width: 120px; }
	</style>
	<script>
	$(function() {
		$( "#sortable1, #sortable2" ).sortable().disableSelection();

		var $tabs = $( "#tabs" ).tabs();

		var $tab_items = $( "ul:first li", $tabs ).droppable({
			accept: ".connectedSortable li",
			hoverClass: "ui-state-hover",
			drop: function( event, ui ) {
				var $item = $( this );
				var $list = $( $item.find( "a" ).attr( "href" ) )
					.find( ".connectedSortable" );

				ui.draggable.hide( "slow", function() {
					$tabs.tabs( "select", $tab_items.index( $item ) );
					$( this ).appendTo( $list ).show( "slow" );
				});
			}
		});
	});
	</script>
</head>
<body>

<div id="tabs">
	<ul>
		<li><a href="#tabs-1">Nunc tincidunt</a></li>
		<li><a href="#tabs-2">Proin dolor</a></li>
	</ul>
	<div id="tabs-1">
		<ul id="sortable1" class="connectedSortable ui-helper-reset">
			<li class="ui-state-default">Item 1</li>
			<li class="ui-state-default">Item 2</li>
			<li class="ui-state-default">Item 3</li>
			<li class="ui-state-default">Item 4</li>
			<li class="ui-state-default">Item 5</li>
		</ul>
	</div>
	<div id="tabs-2">
		<ul id="sortable2" class="connectedSortable ui-helper-reset">
			<li class="ui-state-highlight">Item 1</li>
			<li class="ui-state-highlight">Item 2</li>
			<li class="ui-state-highlight">Item 3</li>
			<li class="ui-state-highlight">Item 4</li>
			<li class="ui-state-highlight">Item 5</li>
		</ul>
	</div>
</div>

<div class="demo-description">
<p>Sort items from one list into another and vice versa, by dropping the list item on the appropriate tab above.</p>
</div>
</body>
</html>
