<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Swords &amp; Wizardry Tools</title>
	<link HREF="sw.css" media='screen' rel="stylesheet" TYPE="text/css">
	<meta http-equiv="X-UA-Compatible" content="chrome=1">
	<meta name="description" content="Quick calculations for Swords & Wizardry.">
<!-- Google Analytics init -->
<script type="text/javascript">
  var _gaq = _gaq || [];
	_gaq.push(
  	['_setAccount', 'UA-9377034-1'],
  	['_setDomain', '.foont.net'],
  	['_trackPageview']
	);
</script>
</head>
<body>
	<ul class="nav">
		<li class='selected'>Treasure</li>
		<li>Monsters</li>
		<li>Spells</li>
	</ul>
<div class='page_content'>
	<ul class="content">
		<li> <? include('treasure.inc'); ?> </li>
		<li style='display:none'><h3>Nothing to see here, move along</h3></li>
		<li style='display:none'><h3>Nothing to see here, move along</h3></li>
	</ul>
</div>
	<script src="https://ajax.googleapis.com/ajax/libs/mootools/1.3.1/mootools-yui-compressed.js"></script>
	<script src="mootools-more-1.3.1.1.js"></script>
	<script src="tinytab.js"></script>
	<script src="tools.js"></script>
	<script>
		$(window).addEvent('domready', function() {
			tb = new TinyTab($$('ul.nav li'),$$('ul.content li'));
			Tools.init();
		});
	</script>
	<script src="ienotify.js"></script>
</body>
</html>
