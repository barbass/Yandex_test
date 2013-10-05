function Traveler(options) {
	options = (options) ? options : {};
	this.init(options);
}

Traveler.prototype = {
	defaultOptions: {
		cards: Array(),
	},
	options: {
		
	},

	init: function(options) {
		for(var option in this.defaultOptions) {
			this.options[option] = options && (options[option] !== undefined) ? options[option] : this.defaultOptions[option];
		};
	},
	
	/* Получить список карточек по условия или без 
	 * options: {'start': undefined | 0, 'end': undefined | 4, 'limit':1, 'to':undefined | 'Madrid', 'from':undefined | 'Barcelona', 'sent': undefined | '45C'}
	 * 
	 * 
	 * */
	getCards: function(options) {
		var search_cards = new Array();
		
		var start = (typeof(options['start']) == 'int') ? options['start'] : 0;
		var end = (typeof(options['end']) == 'int') ? options['end'] : this.options['cards'];
		var to = (typeof(options['to']) == 'string') ? options['to'] : undefined;
		var from = (typeof(options['from']) == 'string') ? options['from'] : undefined;
		var sent = (typeof(options['sent']) == 'string') ? options['sent'] : undefined;
		
		for(var i=start; i<end; i++) {
			if (typeof(options['limit']) == 'int' && cards.length === options['limit']) {
				break;
			}
			
			if (to && this.options['cards'][i]['to'] === to) {
				search_cards.push(this.options['cards'][i]);
				continue;
			}
			if (from && this.options['cards'][i]['from'] === from) {
				search_cards.push(this.options['cards'][i]);
				continue;
			}
			if (sent && this.options['cards'][i]['sent'] === sent) {
				search_cards.push(this.options['cards'][i]);
				continue;
			}
		}
		
		return search_cards;
	},

	
	/* Валидация карточки */
	validate: function(card) {
		if (!card || typeof(card) != 'object') {
			throw {name: 'Type', message: 'Не верный тип данных'};
			return false;
		}
		if (!card['to'] || typeof(card['to']) != 'string' || card['to'] === '' ) {
			throw {name: 'Address', message: 'Не определено место отбытия'};
			return false;
		}
		if (!card['from'] || typeof(card['from']) != 'string' || card['from'] === '' ) {
			throw {name: 'Address', message: 'Не определено место прибытия'};
			return false;
		}
		//TODO: добавить проверку на отсутствие дырки в карточках при добавлении новой
	},
	
	/* Добавление карточки */
	addCard: function(card) {
		try {
			this.validate(card);
			this.options['cards'].push(card);
		} catch(error) {
			throw error;
			return false;
		}
		
		return true;
	},
	
	/* Удаление карточки */
	removeCard: function(card) {
		//TODO: По каким условиям удалять? 
	},
	
	/* Сортировать карточки в порядке путешествия */
	sort: function() {
		//Сортированный список карточек
		var sort_cards = new Array();
		
		var count_cards = this.options['cards'].length;

		//Проверяем не пустой ли список
		if (count_cards === 0) {
			throw new Exception('Нет карточек');
			return false;
		}
		if (count_cards === 1) {
			return this.options['cards'];
		}
		
		var first_point = 0;
		var last_point = 0;
		for(var i=0; i<count_cards; i++) {
			var from = 0;
			var to = 0;

			for(var j=0; j<count_cards; j++) {
				if (j === i) {
					continue;
				}
				
				//Находим начальная ли эта точка
				if (this.options['cards'][i]['from'] === this.options['cards'][j]['to']) {
					from = 1;
				}
				//Находим конечная ли эта точка
				/*if (this.options['cards'][i]['to'] === this.options['cards'][j]['from']) {
					to = 1;
				}*/
			}
			
			if (from === 0) {
				first_point = i;
			}
			/*if (to === 0) {
				last_point = i;
			}*/
		}
		
		var now_point = first_point;
		for(var i=0; i<count_cards; i++) {
			sort_cards.push(this.options['cards'][now_point]);
			for(var j=0; j<count_cards; j++) {
				if (this.options['cards'][now_point]['to'] === this.options['cards'][j]['from']) {
					now_point = j;
					break;
				}
			}
		}
		
		return sort_cards;
	},
	
	sort2: function() {
		//Сортированный список карточек
		var sort_cards = new Array();
		
		var count_cards = this.options['cards'].length;

		//Проверяем не пустой ли список
		if (count_cards === 0) {
			throw new Exception('Нет карточек');
			return false;
		}
		if (count_cards === 1) {
			return this.options['cards'];
		}
		
		por = new Array();
		var first_point = 0;
		var last_point = 0;
		for(var i=0; i<count_cards; i++) {
			var from = 0;
			var to = 0;

			for(var j=0; j<count_cards; j++) {
				if (j === i) {
					continue;
				}
				
				//Находим начальная ли эта точка
				if (this.options['cards'][i]['from'] === this.options['cards'][j]['to']) {
					from = 1;
					por.push(new Array(j, i));
				}
				//Находим конечная ли эта точка
				/*if (this.options['cards'][i]['to'] === this.options['cards'][j]['from']) {
					to = 1;
				}*/
			}
			
			if (from === 0) {
				first_point = i;
			}
			/*if (to === 0) {
				last_point = i;
			}*/
		}

		var now_point = first_point;
		for(var i=0; i<por.length; i++) {
			for(var j=0; j<por.length; j++) {
				if (now_point == por[j][0]) {
					now_point = por[j][1];
					break;
				}
			}
			if (i === 0) {
				sort_cards.push(this.options['cards'][por[j][0]]);
				sort_cards.push(this.options['cards'][por[j][1]]);
			} else {
				sort_cards.push(this.options['cards'][por[j][1]]);
			}
		}
		
		return sort_cards;
	},
	
	/* Построить карту путешествия */
	buildTravelCard: function() {
		console.time("sort");
		var sort_cards = this.sort();
		console.timeEnd("sort");
		
		var html = '<ul>';
		for(var i=0; i<sort_cards.length; i++) {
			html += "<li>";
			html += "Take <b>"+sort_cards[i]['type_transport']+"</b>";
			html += " from <b>"+sort_cards[i]['from']+"</b>";
			html += " to <b>"+sort_cards[i]['to']+"</b>";
			html += "</li>";
		}
		html += "</ul>";
		document.querySelector('#travel').innerHTML = html;
		
		console.time("sort2");
		var sort_cards = this.sort2();
		console.timeEnd("sort2");
		
		var html = '<ul>';
		for(var i=0; i<sort_cards.length; i++) {
			html += "<li>";
			html += "Take <b>"+sort_cards[i]['type_transport']+"</b>";
			html += " from <b>"+sort_cards[i]['from']+"</b>";
			html += " to <b>"+sort_cards[i]['to']+"</b>";
			html += "</li>";
		}
		html += "</ul>";
		document.querySelector('#travel2').innerHTML = html;
	}
};
