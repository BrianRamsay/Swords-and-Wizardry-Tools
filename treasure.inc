<?php ?>
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
		<td colspan="2">
			<input type='checkbox' id='arcane' disabled />
			<label for='arcane' style='font-size:.9em;'>Use Arcane Articles &amp; Items of Power [<a href="http://swcompanion.wdfiles.com/local--files/resources/mi">link</a>] at this frequency</label>
			<select id='aaip_chance' disabled>
				<option value="25">25%</option>
				<option value="30">30%</option>
				<option value="35">35%</option>
				<option value="40">40%</option>
				<option value="45">45%</option>
				<option value="50" selected>50%</option>
				<option value="55">55%</option>
				<option value="60">60%</option>
				<option value="65">65%</option>
				<option value="70">70%</option>
				<option value="75">75%</option>
			</select>
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
	<tr>
		<td></td>
		<td>
			<input type='checkbox' id='return_stingy' />
			<label for='return_stingy'>Return Small Tradeouts</label>
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
<div id='help' style='display:none'>
	So here's the deal
</div>
<div class="expand" id='help_button'>
	<button id='expand'>
	<img src="images/expand.png" title="help" alt="help" />
	Explanation / Help
	<img src="images/expand.png" title="help" alt="help" />
	</button>
</div>
<div class="collapse" id='help_button' style='display:none'>
	<button id='collapse'>
	<img src="images/collapse.png" title="hide" alt="hide" />
	Explanation / Help
	<img src="images/collapse.png" title="hide" alt="hide" />
	</button>
</div>
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
