var TRADEOUT_CHANCE = 10; // 1 in X chance

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

	init : function tools__init() {
		this.make_tables();
	},

	add_events : function tools__add_events() {
		$('looter').addEvent('click', function() {
			$('results').setStyle('display', 'none');
			this.generate_loot();	
			$('results').setStyle('display', 'block');
		}.bind(this));
	},

	generate_loot : function tools__generate_loot() {
		this.base_gold = parseInt($('total_gold').value.replace(',',''), 10);
		this.major_trade = Array.from([]);
		this.minor_trade = Array.from([]);
		this.medium_trade = Array.from([]);

		var major_trade_chances = Math.floor(this.base_gold / 5000);
		for(var i =0; i < major_trade_chances; i++) {
			if(rand_int(TRADEOUT_CHANCE) === 1) {
				this.base_gold -= 5000;
				this.major_trade.push(roll_table(this.tables.major_tradeout));
			}
		}

		var medium_trade_chances = Math.floor(this.base_gold / 1000);
		for(var i =0; i < medium_trade_chances; i++) {
			if(rand_int(TRADEOUT_CHANCE) === 1) {
				this.base_gold -= 1000;
				this.medium_trade.push(roll_table(this.tables.medium_tradeout));
			}
		}

		var minor_trade_chances = Math.floor(this.base_gold / 100);
		for(var i =0; i < minor_trade_chances; i++) {
			if(rand_int(TRADEOUT_CHANCE) === 1) {
				this.base_gold -= 100;
				this.minor_trade.push(roll_table(this.tables.minor_tradeout));
			}
		}

		this.display_loot();
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

	make_tables : function tools__make_tables() {
		new Request.JSON({
			url: 'tables.json',
			onError: function(text, wtf) {
				console.log(wtf);
			},
			onSuccess : function(raw_tables) {
				Object.each(raw_tables, this.parse_table.bind(this), this);
				this.add_events();
		
				$('total_gold').focus();
			}.bind(this)
		}).get();	
	},
	
	parse_table : function tools__parse_table(raw_tbl, table_name) {
		var tbl = {source: '', name: table_name, entries:[]};
		for(var key in raw_tbl) {
			if(raw_tbl.hasOwnProperty(key)) {
				switch(key) {
					case 'source':
						tbl.source = raw_tbl[key];;
						continue;
						break;
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
		if(table_name === 'potion') {
			// create a minor potion table
			this.tables['minor_potion'] = {source: tbl.source, 
										   name: 'minor_potion', 
										   entries: tbl.entries.slice(0,12)};
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

		} else if(val.match(/Gem/)) {
			var calc_func = this.parse_gold(val);
			return function gem_jewelry_map() { 
				var amt = calc_func();
				return this.make_item('Gem or jewelry worth ' +  amt + ' gp', table.source, amt);
			}.bind(this);
		} else if(table.name === 'potion') {
			return function potion_map() { return this.make_item("Potion of " + val, table.source, 15000); }.bind(this);
		} else {
			return function unknown_map() { return this.make_item(val, table.source, 100000); }.bind(this);
		}

	},

	parse_table_access : function tools__parse_table_access(table, val) {
		//console.log(val);
		//console.log(val.match(/Table:\s(\w+)(\s+Qty:\s(\d+))?/));
		var matches = val.match(/Table:\s(\w+)(\s+Qty:\s(\d+))?/);
		var target_table = matches[1];
		var multiples = (matches.length > 2);
		var qty = 1;
		if(multiples) {
			var qty = matches[3];
		}
		// TODO switch to AAIP table on % chance
		return function table_map() { 
			if(this.tables[target_table]) {
				var item = roll_table(this.tables[target_table]);
				for(var i=1; i < qty; i++) {
					next_item = roll_table(this.tables[target_table]);
					item.description += "<br />" + next_item.description;
				}
				item.sort *= qty;
				return item;
			} else {
				// there's an error - sort to the top
				return this.make_item(val, table.source, 100000);
			}
		}.bind(this);
	},

	make_item : function tools__make_item(desc, source, sort, page) {
		return {description: desc, sort: sort, source: source, page : page};
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
