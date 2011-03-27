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

	major_trade : [],
	medium_trade : [],
	minor_trade : [],

	base_gold : 0,

	tradeout_chance: 10, // % chance
	magic_item_chance: 5, // % chance
	return_small_tradeouts: false, 

	init : function tools__init() {
		this.set_options();
		this.make_tables(function() {
			this.add_events();

			this.modify_magic_item_chance('major');
			this.modify_magic_item_chance('medium');
			this.modify_magic_item_chance('minor');

			$('total_gold').focus();
		}.bind(this));
	},

	set_options : function tools__set_options() {
		this.tradeout_chance = $('tradeout_chance').options[$('tradeout_chance').selectedIndex].value;
		this.magic_item_chance = $('magic_item_chance').options[$('magic_item_chance').selectedIndex].value;

		this.return_small_tradeouts = $('return_stingy').checked;
	},

	add_events : function tools__add_events() {
		$('magic_item_chance').addEvent('change', function () {
			this.set_options();
			this.modify_magic_item_chance('major');
			this.modify_magic_item_chance('medium');
			this.modify_magic_item_chance('minor');
		}.bind(this));

		$('tradeout_chance').addEvent('change', function () {
			this.set_options();
		}.bind(this));

		$('return_stingy').addEvent('click', function () {
			this.set_options();
		}.bind(this));

		$('looter').addEvent('click', function() {
			$('results').setStyle('display', 'none');
			this.generate_loot();	
			$('results').setStyle('display', 'block');
		}.bind(this));
	},

	/*****************************************************************
		Loot Creation and Display

		Methods that drive the creation and display of a hoard.
	*****************************************************************/

	generate_loot : function tools__generate_loot() {
		this.base_gold = parseInt($('total_gold').value.replace(',',''), 10);

		this.calculate_tradeout(5000, 'major');
		this.calculate_tradeout(1000, 'medium');
		this.calculate_tradeout(100, 'minor');

		this.display_loot();
	},

	calculate_tradeout : function(gold_amount, which) {
		this[which + '_trade'] = Array.from([]);
		var trade_chances = Math.floor(this.base_gold / gold_amount);
		for(var i =0; i < trade_chances; i++) {
			if(rand_int(100) <= this.tradeout_chance) {
				var item = roll_table(this.tables[which + '_tradeout']);
				if(this.return_small_tradeouts && 
				   item.type == 'gem' && 
				   item.sort < gold_amount) 
				{
					continue;
				}
				this.base_gold -= gold_amount;
				this[which + '_trade'].push(item);
			}
		}
	},

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

	add_tradeout_items : function tools__add_tradeout_items(items, which) {
		var tradeout_items = this[which + '_trade'];
		$(which + '_count').set('text', tradeout_items.length);
		Array.each(tradeout_items, function(item) {
			item.tradeout = which;
			items.push(item);	
		});
	},

	display_item_table : function tools__display_item_table(items) {
		var list = $('list');
		list.set('html', '');

		//console.log(items);
		if(items.length) {
			Array.each(items, function item_display_loop(item, idx) {
				var row = new Element('tr');
				row.addClass(idx % 2 ? 'odd' : 'even');

				var type = new Element('td', {
					'class' : item.tradeout,
					'html' : '&nbsp;'
				});
				type.addClass('key');
				row.appendChild(type);

				var type = new Element('td', { 'class' : 'type' });
				type.setStyle('width', '25px');
				type.set('html', this.image_from_type(item));
				row.appendChild(type);

				var desc = new Element('td', {'html' : item.description});
				row.appendChild(desc);

				//var source = new Element('td', {'html' : item.source});
				//row.appendChild(source);

				var reload = new Element('td');
				var reload_img = new Element('img', {src : 'images/refresh.png', title: 'Reload'});
				reload_img.addEvent('click', function() {
					var new_item = roll_table(this.tables[item.tradeout + '_tradeout']);
					items.splice(idx, 1, new_item);
					desc.set('html', new_item.description);
					type.set('html', this.image_from_type(new_item));
				}.bind(this));
				reload.appendChild(reload_img);
				row.appendChild(reload);

				var remove = new Element('td');
				var remove_img = new Element('img', {src : 'images/remove.gif', title: 'Remove'});
				remove_img.addEvent('click', function() {
					switch(item.tradeout) {
						case 'major':
							mod_amt = 5000;
							break;
						case 'medium':
							mod_amt = 1000;
							break;
						case 'minor':
							mod_amt = 100;
							break;
					}
					this.base_gold += mod_amt;
					$('gold_left').set('text', this.base_gold);
					items.splice(idx, 1);
					this.display_item_table(items);
				}.bind(this));
				remove.appendChild(remove_img);
				row.appendChild(remove);

				list.appendChild(row)
			}.bind(this));
		}
	}, 

	image_from_type : function(item) {
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
			case 'melee_weapon':
				filename = 'sword.png';
				break;
			case 'missile_weapon':
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
		switch(table.type) {
			case 'gem':
				var calc_func = this.parse_gold(val);
				return function gem_jewelry_map() { 
					var amt = calc_func();
					return this.make_item(table, 'Gem or jewelry worth ' +  amt + ' gp', amt);
				}.bind(this);
				break;
			case 'potion':
				return function() { return this.make_item(table, "Potion of " + val, 15000); }.bind(this);
				break;
			case 'ring':
				return function() { return this.make_item(table, "Ring of " + val, 40000); }.bind(this);
				break;
			case 'staff':
				return function() { return this.make_item(table, "Staff of " + val, 50000); }.bind(this);
				break;
			case 'magic_item':
				var sort_val = 20000;
				if(table.name.contains('greater') || table.name.contains('elemental')) {
					sort_val = 45000;
				} else if (table.name.contains('medium')) {
					sort_val = 35000;
				}
				return function() { return this.make_item(table, val, sort_val); }.bind(this);
				break;
			case 'wand':
				var prefix = "Wand: ";
				if(val.test(/^Wand/)) {
					prefix = "";
				}
				return function() { return this.make_item(table, prefix + val, 30000); }.bind(this);
				break;
			case 'scroll':
				var prefix = "";
				if(val.test(/^1/)) {
					prefix = "Scroll: ";
				} else if( val.test(/^\d/)) {
					prefix = "Scrolls: ";
				}
				return function() { return this.make_item(table, prefix + val, 15000); }.bind(this);
				break;

			case 'weapon':
			case 'armor':
			case 'melee_weapon':
				return function() { return this.make_item(table, val, 40000); }.bind(this);
				break;

			case 'missile_weapon':
				return function() { return this.make_item(table, val, 35000); }.bind(this);
				break;

			default:
				if(!table.name.test('weapon_armor')) {
					console.log('ERROR - table.type is unknown (' + table.type + ') for table ' + table.name + ' in map_table_string');
				}
				return function unknown_map() { return this.make_item(table, val, 100000); }.bind(this);
				break;
		}
	},

	parse_table_access : function tools__parse_table_access(table, val) {
		var matches = val.match(/Table:\s(\w+)/);
		var target_table = matches[1];

		var qty = 1;
		var has_qty = val.match(/Qty:\s(\d+)/);
		if(has_qty) {
			qty = has_qty[1];
		}
		// TODO switch to AAIP table on % chance
		return function table_map() { 
			var new_table = this.tables[target_table];
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
					if(new_table.type === 'missile_weapon') {
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

	make_item : function tools__make_item(table, desc, sort, page) {
		var item = {description: desc, 
					type: table.type + '', 
					sort: sort, 
					source: table.source, 
					page : page};
		return this.special_processing(item);
	},

	special_processing : function(item) {
		if(item.type == 'missile_weapon') {
			// roll the dice
			var matches = item.description.match(/(\d+)d(\d+)/);
			if(matches[1]) {
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
