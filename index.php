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
	<div id='fixed_wrapper'>
	<div id='fixed_content'>
		<ul class="nav">
			<li class='selected'>Treasure</li>
			<li>Monsters</li>
			<li>Spells</li>
		</ul>
		<div class='page_content'>
			<ul class="content">
				<li> <?php include('treasure.html'); ?> </li>
				<li style='display:none'><h3>Nothing to see here, move along</h3></li>
				<li style='display:none'><h3>Nothing to see here, move along</h3></li>
			</ul>
		</div>
	</div>
	<div class='footer'>
	Updates by <a href="https://chgowiz-games.blogspot.com/">Michael S / chgowiz</a> | <a href="https://github.com/Chgowiz/Swords-and-Wizardry-Tools-chgowiz">Fork is on github</a> | <a href=""><a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#99;&#104;&#103;&#111;&#119;&#105;&#122;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;" rel='nofollow'>Email me</a> at  &#99;&#104;&#103;&#111;&#119;&#105;&#122;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109; with questions!
	<br/><br/>Created by <a href="http://foont.net">Brian Ramsay</a> | <a href="https://github.com/BrianRamsay/Swords-and-Wizardry-Tools">Code is on github</a> | <a href="README">License</a> |&nbsp;<a href='&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#98;&#114;&#105;&#97;&#110;&#64;&#102;&#111;&#111;&#110;&#116;&#46;&#110;&#101;&#116;' rel='nofollow'>Email me</a> at &#98;&#114;&#105;&#97;&#110;&#64;&#102;&#111;&#111;&#110;&#116;&#46;&#110;&#101;&#116; and let me know what you think. 
	<br />
	<br />
	Thanks to Matthew Finch &amp; Mythmere Games
	</div>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/mootools/1.3.1/mootools-yui-compressed.js"></script>
	<script src="js/mootools-more-1.3.1.1.js"></script>
	<script src="js/tinytab.js"></script>
	<script src="js/tools.js"></script>
	<script>
		$(window).addEvent('domready', function() {
			tb = new TinyTab($$('ul.nav li'),$$('ul.content li'));
			Tools.init();
		});
	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>
	<script src="js/ienotify.js"></script>
</body>
</html>
