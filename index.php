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
		<li>
			<div class="treasure_actions">
				<label>Total Gold Value</label>
				<input type='text' id='total_gold' />
				<input type='button' value='Make Loot'  id='looter' />
			</div>
			<span class='note'>S&amp;W rules recommend that treasure XP (gold) be 2-3 times greater than monster XP</span>
			<fieldset>
				<legend>Options</legend>
				<table>
					<tr><td>
						<input type='radio' name='source[]' id='core' checked />
						<label for='core'>Core Rules</label>
					</td>
					<td>
						<input type='checkbox' id='arcane' disabled />
						<label for='arcane' style='font-size:.9em;'>Use Arcane Articles &amp; Items of Power [<a href="http://swcompanion.wdfiles.com/local--files/resources/mi">link</a>]</label>
					</td>
					<td>
						<select id='tradeout_chance'>
							<option value="10">10%</option>
							<option value="15">15%</option>
							<option value="20">20%</option>
							<option value="25">25%</option>
							<option value="30">30%</option>
							<option value="35">35%</option>
							<option value="40">40%</option>
							<option value="45">45%</option>
							<option value="50">50%</option>
						</select>
						<label for='tradeout_chance'>Treasure Chance</label>
					</td></tr>
					<tr><td style='padding-right:10px;'>
						<input type='radio' name='source[]' id='complete' disabled />
						<label for='complete'>Complete Rules</label>
					</td>
					<td>
						<input type='checkbox' id='describe_jewelry' disabled />
						<label for='describe_jewelry'>Describe Gems/Jewelry/Art</label>
					</td>
					<td>
						<select id='magic_item_chance'>
							<option value="5">5%</option>
							<option value="10">10%</option>
							<option value="15">15%</option>
							<option value="20">20%</option>
							<option value="25">25%</option>
							<option value="30">30%</option>
							<option value="35">35%</option>
							<option value="40">40%</option>
							<option value="45">45%</option>
							<option value="50">50%</option>
						</select>
						<label for='magic_item_chance'>Magic Item Chance</label>
					</td></tr>
				</table>
			</fieldset>
			<div style="display:none" id='results'>
				<div class='tradeout'>
					<span class='key major'>&nbsp;&nbsp;</span>
					<b>Major Tradeouts: <span id="major_count">0</span></b><br />
					<span class='key medium'>&nbsp;&nbsp;</span>
					<b>Medium Tradeouts: <span id="medium_count">0</span></b><br />
					<span class='key minor'>&nbsp;&nbsp;</span>
					<b>Minor Tradeouts: <span id="minor_count">0</span></b>
				</div>
				<div class='treasure'>
					<h3>Gold: <span id='gold_left'></span></h3>
					<table id='list'></table>
				</div>
			</div>
		</li>
		<li></li>
		<li></li>
	</ul>
</div>
	<script src="https://ajax.googleapis.com/ajax/libs/mootools/1.3.1/mootools-yui-compressed.js"></script>
	<script src="tinytab.js"></script>
	<script src="tools.js"></script>
	<script>
		$(window).addEvent('domready', function() {
			tb = new TinyTab($$('ul.nav li'),$$('ul.content li'));
			Tools.init();
		});
	</script>
</body>
</html>
