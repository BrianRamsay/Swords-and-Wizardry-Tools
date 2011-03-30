function roll(dice, size) {
    dice = Math.max(dice, 0);
    size = Math.max(size, 1);

    return dice * rand_int(size);
}

function rand_int(max) {
    return Math.ceil(Math.random() * max);
}

function roll_table(table) {
    var die_size = table.entries.length;
    var idx = roll(1, die_size) - 1;

    //console.log('rolled ' + (idx + 1) + ' on ' + table.name);

    return table.entries[idx]();
}

var Tools = {
	tables : {},
	steps : [],

	tradeout_amounts : {
		'major' : 5000,
		'medium' : 1000,
		'minor' : 100
	},

	major_trade : [],
	medium_trade : [],
	minor_trade : [],

	base_gold : 0,

	tradeout_chance: 10, // % chance
	magic_item_chance: 5, // % chance
	return_small_tradeouts: false, 
	use_arcane_chance: 0,  // % chance of using Arcane Articles and Items of Power

	init : function tools__init() {
		this.set_options();
		this.make_tables(function() {
			this.add_events();

			this.modify_magic_item_chance('major');
			this.modify_magic_item_chance('medium');
			this.modify_magic_item_chance('minor');

			$('total_gold').focus();
			this.preload_images();
		}.bind(this));
	},

	preload_images : function() {
		var preload1 = new Image();
		preload1.src = 'images/scroll.gif';
		var preload11 = new Image();
		preload11.src = 'images/potion.png';
		var preload10 = new Image();
		preload10.src = 'images/shield.gif';
		var preload9 = new Image();
		preload9.src = 'images/magic.gif';
		var preload8 = new Image();
		preload8.src = 'images/bow.png';
		var preload7 = new Image();
		preload7.src = 'images/sword.png';
		var preload6 = new Image();
		preload6.src = 'images/armor.png';
		var preload5 = new Image();
		preload5.src = 'images/ring.png';
		var preload4 = new Image();
		preload4.src = 'images/wand.png';
		var preload3 = new Image();
		preload3.src = 'images/staff.png';
		var preload2 = new Image();
		preload2.src = 'images/gem.png';
	},

	set_options : function tools__set_options() {
		var tradeout_box = $('tradeout_chance');
		this.tradeout_chance = tradeout_box.options[tradeout_box.selectedIndex].value;

		var magic_box = $('magic_item_chance');
		this.magic_item_chance = magic_box.options[magic_box.selectedIndex].value;

		this.return_small_tradeouts = $('return_stingy').checked;

		if($('arcane').checked) {
			this.use_arcane_supplement = $('aaip_chance').options[$('aaip_chance').selectedIndex].value;
		} else {
			this.use_arcane_supplement = 0;
		}
	},

	add_events : function tools__add_events() {
		// set the duration on our dissolve effect for good
		$('help').dissolve({duration: 'short'});

		// show and hide the explanation text, adds hover effects to buttons
		$$('button').each(function(btn) {
			btn.addEvent('mouseover', function() {
				btn.addClass('over');
			});
			btn.addEvent('mouseout', function() {
				btn.removeClass('over');
			});

			btn.addEvent('click', function() {
				if(btn.id == 'expand') {
					$(btn.parentNode).setStyle('display' , 'none');
					$($('collapse').parentNode).setStyle('display' , 'block');
					$('help').reveal();
				} else if(btn.id == 'collapse') {
					$(btn.parentNode).setStyle('display' , 'none');
					$($('expand').parentNode).setStyle('display' , 'block');
					$('help').dissolve();
				}
			});
		});

		// my little hidden collapser button
		$('sneaky_button').addEvent('click', function() {
			$('collapse').fireEvent('click');
		});

		// submit gold entry
		$('total_gold').addEvent('keydown', function (e) {
			if(e.key == 'enter') {
				$('looter').fireEvent('click');
				return;
			}
		}.bind(this));

		// start treasure generation on button click
		$('looter').addEvent('click', function() {
			$('results').setStyle('display', 'none');
			this.generate_loot();	
			$('results').setStyle('display', 'block');
		}.bind(this));

		// get single tradeout items
		$$('.single_tradeout').each(function(button) {
			button.addEvent('click', function(e) {
				var tradeout = e.target.get('text').toLowerCase();
				var item = roll_table(this.tables[tradeout + '_tradeout']);
				$('single_item_image').set('html', this.make_image_from_type(item));
				$('single_item_description').set('html', this.make_item_description(item));
			}.bind(this));
		}.bind(this));

		/*
			Monitor various options for changes
		*/
		$('magic_item_chance').addEvent('change', function () {
			this.set_options();
			this.modify_magic_item_chance('major');
			this.modify_magic_item_chance('medium');
			this.modify_magic_item_chance('minor');
		}.bind(this));

		$('tradeout_chance').addEvent('change', function () {
			this.set_options();
		}.bind(this));

		$('aaip_chance').addEvent('change', function () {
			this.set_options();
		}.bind(this));

		$('arcane').addEvent('click', function () {
			$('aaip_chance').disabled = $('arcane').checked ? '' : 'disabled';
			this.set_options();
		}.bind(this));

		$('return_stingy').addEvent('click', function () {
			this.set_options();
		}.bind(this));
	},

	/*****************************************************************
		Loot Creation and Display

		Methods that drive the creation and display of a hoard.
	*****************************************************************/

	/*
		Function: generate_loot
		Reads the gold amount entered, calculates the treasure, and then displays
		the treasure list.
	*/
	generate_loot : function tools__generate_loot() {
		var gold = $('total_gold').value.replace(/[a-zA-Z\.\,]/g, '');
		this.base_gold = Math.max(0,parseInt(gold));
		if(!this.base_gold) {
			this.base_gold = 0;
			$('total_gold').focus();
		}
		$('total_gold').value = this.base_gold;

		this.calculate_tradeout('major');
		this.calculate_tradeout('medium');
		this.calculate_tradeout('minor');

		this.display_loot();
	},

	/*
		Function: calculate_tradeout
		Given the type of tradeout ('major', 'medium', or 'minor'), randomize 
		the item tradeouts and add to the relevant array (e.g. this.minor_tradeout).
	*/
	calculate_tradeout : function(which) {
		var item_array = Array.from([]);
		var gold_amount = this.tradeout_amounts[which];

		var trade_chances = Math.floor(this.base_gold / gold_amount);
		for(var i =0; i < trade_chances; i++) {
			if(rand_int(100) <= this.tradeout_chance) {

				var item = roll_table(this.tables[which + '_tradeout']);

				// if they don't want small treasure amounts, don't add the item
				if(this.return_small_tradeouts && 
				   item.type == 'gem' && 
				   item.sort < gold_amount) 
				{
					continue;
				}

				// we have an item we want
				this.base_gold -= gold_amount;
				item_array.push(item);
			}
		}
		this[which + '_trade'] = item_array;
	},

	/*
		Function: display_loot
		Combines the three tradeout arrays into one items array, sorts it, 
		and calls <display_item_table> to output the list.
	*/
	display_loot : function tools__display_loot() {
		
		$('gold_left').set('text', this.base_gold);
		var items = [];
		this.add_tradeout_items(items, 'major');
		this.add_tradeout_items(items, 'medium');
		this.add_tradeout_items(items, 'minor');

		items.sort(function(a, b) {
			return b.sort - a.sort; // numerically sort in reverse order
		});

		this.display_item_table(items);
	},

	/*
		Function: add_tradeout_items
		Given an item list and the tradeout type ('major', 'medium', or 'minor'),
		adds the tradeout items to the item list and displays the count on the page.
	*/
	add_tradeout_items : function tools__add_tradeout_items(items, which) {
		var tradeout_items = this[which + '_trade'];
		$(which + '_count').set('text', tradeout_items.length);
		Array.each(tradeout_items, function(item) {
			item.tradeout = which;
			items.push(item);	
		});
	},

	/*
		Function: display_item_table
		Show a row in the results table for each item.
	*/
	display_item_table : function tools__display_item_table(items) {
		var list = $('list');
		list.set('html', '<tbody></tbody>');

		//console.log(items);
		if(items.length) {
			Array.each(items, function item_display_loop(item, idx) {
				var row = new Element('tr');
				row.addClass(idx % 2 ? 'odd' : 'even');

				// Show color indicating which tradeout
				var type = new Element('td', {
					'class' : item.tradeout,
					'html' : '&nbsp;'
				});
				type.addClass('key');
				row.appendChild(type);

				// Show an image indicating the type of item	
				var item_type = new Element('td', { 'class' : 'type' });
				item_type.setStyle('width', '25px');
				item_type.set('html', this.make_image_from_type(item));
				row.appendChild(item_type);

				// Describe the item
				var desc = new Element('td', {'html' : this.make_item_description(item)});
				row.appendChild(desc);

				//var source = new Element('td', {'html' : item.source});
				//row.appendChild(source);

				// Give the ability to re-roll a tradeout
				var reload = new Element('td');
				reload.setStyle('width','20px');
				reload.appendChild(this.make_reload_img_element(items, idx, desc, item_type));
				row.appendChild(reload);

				// Give the ability to return an item to the gold pool
				var remove = new Element('td');
				remove.setStyle('width','20px');
				remove.appendChild(this.make_remove_img_element(items, idx));
				row.appendChild(remove);

				list.firstChild.appendChild(row)
			}.bind(this));
		} else {
			// nothing there
			var row = new Element('tr');
			var cell = new Element('td');
			cell.setStyle('text-align', 'center');
			cell.set('text', "There were no tradeouts. Try again if you want.");
			row.appendChild(cell);
			list.firstChild.appendChild(row)
		}
	}, 

	/*
		Function: make_item_description
		Describe the item, including a hover of where it can be found
	*/
	make_item_description : function(item) {
		if(item.type == 'gem') {
			return item.description;
		}

		var source = 'Core Rules';
		if(item.source == 'AAIP') {
			source = 'Arcane Articles &amp; Items of Power';
		}
		if(item.page) {
			source += ' page ' + item.page;
		}

		return '<acronym title="' + source + '">' + item.description + '</acronym>';
	},


	/*
		Function: make_reload_img_element
		Create an img element and attach an event to re-roll a tradeout item.
	*/
	make_reload_img_element : function(item_list, index, description_cell, item_type_cell) {
		var reload_img = new Element('img', {src : 'images/refresh.png', title: 'Reload'});
		var tradeout_table = this.tables[item_list[index].tradeout + '_tradeout'];

		reload_img.addEvent('click', function() {
			var new_item = roll_table(tradeout_table);
			item_list.splice(index, 1, new_item);
			description_cell.set('html', new_item.description);
			item_type_cell.set('html', this.make_image_from_type(new_item));
		}.bind(this));

		return reload_img;
	},

	/*
		Function: make_remove_img_element
		Create an img element and attach an event to remove an item and return
		the tradeout gold.
	*/
	make_remove_img_element : function(item_list, index) {
		var remove_img = new Element('img', {src : 'images/remove.gif', title: 'Remove'});
		var mod_amt = this.tradeout_amounts[item_list[index].tradeout];
		remove_img.addEvent('click', function() {
			this.base_gold += mod_amt;
			$('gold_left').set('text', this.base_gold);
			item_list.splice(index, 1);
			this.display_item_table(item_list);
		}.bind(this));

		return remove_img;
	},

	/*
		Function: make_image_from_type
		Create an html string for an image element based on the item type.
	*/
	make_image_from_type : function(item) {
		switch(item.type) {
			case 'scroll':
				filename = 'scroll.gif';
				break;
			case 'potion':
				filename = 'potion.png';
				break;
			case 'gem':
				filename = 'gem.png';
				break;
			case 'staff':
				filename = 'staff.png';
				break;
			case 'wand':
				filename = 'wand.png';
				break;
			case 'ring':
				filename = 'ring.png';
				break;
			case 'armor':
				filename = 'armor.png';
				if(item.description.test('shield','i')) {
					filename = 'shield.gif';
				}
				break;
			case 'weapon':
			case 'sword':
			case 'melee_weapon':
				filename = 'sword.png';
				break;
			case 'missile_weapon':
			case 'missile_ammo':
				filename = 'bow.png';
				break;
			case 'magic_item':
				filename = 'magic.gif';
				break;
			default:
				if(item.description.contains('Shield')) {
					filename = 'shield.gif';
				} else {
					console.log("ERROR - Unknown type (" + item.type + ")");
					filename = '';
				}
		}
		
		var title = item.type.replace('_', ' ').capitalize();
		return '<img class="icon" src="images/' + filename + '" alt="'+title+'" title="'+title+'" />';
	},

	/*****************************************************************
		Table Modification Methods

		These methods help parse the raw tables and generate
		the anonymous functions.
	*****************************************************************/

	modify_magic_item_chance : function(which) {
		var table = this.tables[which + '_tradeout'];
		var magic_item_slots = Math.floor(this.magic_item_chance / 5);
		Array.each(table.entries,function(old_entry, idx) {
			var new_entry = this.map_table_string(table, "Table: " + which + "_gem");
			if(idx >= 20 - magic_item_slots) {
				new_entry = this.map_table_string(table, "Table: " + which + "_item");
			}
			table.entries[idx] = new_entry;
		}.bind(this));
		for(var i = magic_item_slots; i > 0; i--) {
			var old_entry = table.entries[20 - i];
		}
	},

	make_tables : function tools__make_tables(success_func) {
		new Request.JSON({
			url: 'tables.json',
			onError: function(text, wtf) {
				console.log(wtf);
			},
			onSuccess : function(raw_tables) {
				Object.each(raw_tables, this.parse_table.bind(this), this);

				success_func();
			}.bind(this)
		}).get();	
	},
	
	parse_table : function tools__parse_table(raw_tbl, table_name) {
		var tbl = {source: '', type: '', page: '', name: table_name, entries:[]};
		var special_keys = ['source', 'page', 'type'];
		Object.each(raw_tbl, function(value, key) {
			if(special_keys.contains(key)) {
				tbl[key] = raw_tbl[key];
			}
		});
		for(var key in raw_tbl) {
			if(raw_tbl.hasOwnProperty(key)) {
				if(special_keys.contains(key)) {
					continue;
				}
				if(key.match(/-/)) {
					var range = key.split('-');
					for(var i = parseInt(range[0], 10); i <= parseInt(range[1], 10); i ++) {
						tbl.entries.push(this.map_table_string(tbl, raw_tbl[key]));
					}
				} else {
					tbl.entries.push(this.map_table_string(tbl, raw_tbl[key]));
				}
			}
		}
		this.tables[table_name] = tbl;

		// special handling
		switch(table_name) {
			case 'potion':
				// create a minor potion table
				this.tables['minor_potion'] = {source: tbl.source, 
											   type: 'potion', 
											   page: tbl.page,
											   name: 'minor_potion', 
											   entries: tbl.entries.slice(0,12)};
				break;
		}
	},

	map_table_string : function tools__map_table_string(table, val)
	{
		if(typeof val !== 'string') {
			return val;
		}

		if(val.match(/Table/)) {
			var table_func = this.parse_table_access(table, val);
			return table_func;

		}
		var sort_val = 100000;
		var prefix = '';
		switch(table.type) {
			case 'gem':
				var calc_func = this.parse_gold(val);
				return function gem_jewelry_map() { 
					var amt = calc_func();
					return this.make_item(table, 'Gem or jewelry worth ' +  amt + ' gp', amt);
				}.bind(this);
				break;
			case 'potion':
				prefix = "Potion of ";
				if(val.test(/Potion|Elixir|Tonic|Brew/)) {
					prefix = "";
				}
				sort_val = 15000;
				break;
			case 'ring':
				prefix = "Ring of ";
				if(val.test(/Ring|Band/)) {
					prefix = "";
				}
				sort_val = 40000;
				break;
			case 'staff':
				prefix = "Staff of ";
				if(val.test(/Staff/)) {
					prefix = "";
				}
				sort_val = 50000;
				break;
			case 'magic_item':
				sort_val = 20000;
				if(table.name.contains('greater') || table.name.contains('elemental')) {
					sort_val = 45000;
				} else if (table.name.contains('medium')) {
					sort_val = 35000;
				}
				break;
			case 'wand':
				sort_val = 30000;
				prefix = "Wand of ";
				if(val.test(/Wand|Rod/)) {
					prefix = "";
				} else if (val.test(/^Spell/)) {
					prefix = "Wand: ";
				}
				break;
			case 'scroll':
				sort_val = 15000;
				var prefix = "";
				if(val.test(/^1/)) {
					prefix = "Scroll: ";
				} else if( val.test(/^\d/)) {
					prefix = "Scrolls: ";
				}
				break;

			case 'weapon':
			case 'armor':
			case 'melee_weapon':
			case 'missile_weapon':
			case 'sword':
				sort_val = 40000;
				break;

			case 'missile_ammo':
				sort_val = 35000;
				break;

			default:
				sort_val = 100000;
				if(!table.name.test('weapon_armor')) {
					console.log('ERROR - table.type is unknown (' + table.type + ') for table ' + table.name + ' in map_table_string');
				}
				break;
		}

		// if we have made it this far, we can just use the default
		return function() { return this.make_item(table, prefix + val, sort_val); }.bind(this);
	},

	parse_table_access : function tools__parse_table_access(table, val) {
		var matches = val.match(/Table:\s(\w+)/);
		var target_table = matches[1];

		var qty = 1;
		var has_qty = val.match(/Qty:\s(\d+)/);
		if(has_qty) {
			qty = has_qty[1];
		}
		return function table_map() { 
			var new_table = this.tables[target_table];

			// switch to AAIP table on % chance
			// TODO move this so multi-potion rolls can switch between tables
			if(rand_int(100) <= this.use_arcane_supplement) {
				var aa_table_name = 'aa_' + target_table;
				if(this.tables[aa_table_name]) {
					new_table = this.tables[aa_table_name];
				}
			}
			if(new_table) {
				var item = roll_table(new_table);
				for(var i=1; i < qty; i++) {
					next_item = roll_table(new_table);
					item.description += "<br />" + next_item.description;
				}
				item.sort *= qty;

				// check if Table block is in the middle
				// if so, replace the table block with our new item description and use the whole thing
				if(val.test(/<Table/)) {
					item.description = val.replace(/<Table: \w+>/, item.description);	

					item.page = table.page || item.page; // the old page is probably more useful here

					// special hack to switch modifier with # of missile ammo
					if(new_table.type === 'missile_ammo') {
						item.description = item.description.replace(/(\+\d) (\d+)/, "$2 $1");
					}
				}

				return item;
			} else {
				// there's an error - sort to the top
				console.log('ERROR - tried to access table ' + target_table + ' in parse_table_access');
				return this.make_item(table, val, 100000);
			}
		}.bind(this);
	},

	make_item : function tools__make_item(table, desc, sort) {
		var item = {description: desc, 
					type: table.type + '', 
					sort: sort, 
					source: table.source, 
					page : table.page};
		return this.special_processing(item);
	},

	special_processing : function(item) {
		if(item.type == 'missile_ammo') {
			// roll the dice
			var matches = item.description.match(/(\d+)d(\d+)/);
			if(matches) {
				var count = roll(matches[1], matches[2]);

				// put the numbers in
				item.description = item.description.replace(/\d+d\d+/, count);
			}
		}

		return item;
	},


	parse_gold : function tools__parse_gold(val) {
		var desc = val.replace(/Gem:\s+/, '');
		var pieces = desc.match(/\d+d\d+/);
		var dice = pieces[0].split('d');
		var num_dice = parseInt(dice[0], 10);
		var dice_size = parseInt(dice[1], 10);

		var multiply = 0;
		var add = 0;
		if(desc.match(/\+/)) {
			var tmp = desc.split('+');
			add = parseInt(tmp[1], 10);
		}
		if(desc.match(/x/)) {
			var tmp = desc.split('x');
			multiply = parseInt(tmp[1], 10);
		}

		return function tools__gold_value() { 
			var base = roll(num_dice, dice_size); 
			if(add) {
				return base + add;
			}
			if(multiply) {
				return base * multiply;
			}
			return base;
		};
	}
}
