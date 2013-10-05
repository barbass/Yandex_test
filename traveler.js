function Traveler(options) {
	options = (options) ? options : {};
	this.init(options);
}

Traveler.prototype = {
	defaultOptions: {
		cards: new Array(),
		transports: new Array(),
	},
	options: {},
	
	transports: new Array('airplane', 'trane', 'bus', 'taxi'),
	cards: new Array(),
	
	init: function(options) {
		this.options = (options) ? options : {};

		for(var option in this.defaultOptions) {
			this.options[option] = (options && typeof(options[option]) !== undefined) ? options[option] : this.defaultOptions[option];
		};
		
		//TODO: можно добавить валидацию транспорта
		this.transports = this.transports.concat(this.options['transports']);
		
		//TODO: можно добавить валидацию карточек
		this.cards = this.options['cards'];
	},
	
	/* Получить список карточек
	 * Поиск по одному свойству
	 * options: {
	 * 	'start': undefined | 0,
	 * 	'end': undefined | 4,
	 * 	'limit': undefined | 1, 
	 * 	'to':undefined | 'Madrid',
	 * 	'from':undefined | 'Barcelona',
	 * 	'sent': undefined | '45C',
	 * 	'transport': undefined | 'airplane',
	 * 	'options': undefined | {'key':'price', 'display':true|false и т.д.},
	 * }
	 * @param object
	 * @return array
	 * */
	getCards: function(search_options) {
		var search_cards = new Array();
		var search_options = (typeof(search_options) === 'object') ? search_options : {};
		var push_limit = 0;
		
		var start = (typeof(search_options['start']) === 'int') ? search_options['start'] : 0;
		var end = (typeof(search_options['end']) === 'int') ? search_options['end'] : this.getCountCards();
		var limit = (typeof(search_options['limit']) === 'int' && search_options['limit'] > 0) ? search_options['limit'] : 0;
		var to = (typeof(search_options['to']) === 'string') ? search_options['to'] : undefined;
		if (to) {
			push_limit++;
		}
		var from = (typeof(search_options['from']) === 'string') ? search_options['from'] : undefined;
		if (from) {
			push_limit++;
		}
		var id = (typeof(search_options['id']) === 'string') ? search_options['id'] : undefined;
		if (id) {
			push_limit++;
		}
		var sent = (typeof(search_options['sent']) === 'string') ? search_options['sent'] : undefined;
		if (sent) {
			push_limit++;
		}
		var transport = (typeof(search_options['transport']) === 'string') ? search_options['transport'] : undefined;
		if (transport) {
			push_limit++;
		}
		var options = (typeof(search_options['options']) === 'object') ? search_options['options'] : undefined;
		if (options) {
			push_limit++;
		}

		for(var i=start; i<end; i++) {
			if (limit !== 0 && search_cards.length === limit) {
				break;
			}
			
			var push = 0;
			
			if (to && this.cards[i]['to'] === to) {
				push++;
			}
			if (from && this.cards[i]['from'] === from) {
				push++;
			}
			if (id && this.cards[i]['id'] === id) {
				push++;
			}
			if (sent && this.cards[i]['sent'] === sent) {
				push++;
			}
			if (transport && this.cards[i]['transport'] === transport) {
				push++;
			}
			if (options && typeof(this.cards[i]['options']) === 'object') {
				if (options['key'] && this.cards[i]['options'][key] === options['key']) {
					push++;
				}
				
				for(var key_option in options) {
					if (key_option === 'key') {
						continue;
					}
					for(var key in this.cards[i]['options']) {
						if (this.cards[i]['options'][key][key_option] && this.cards[i]['options'][key][key_option] === options[key_option]) {
							push++;
						}
					}
				}
			}
			
			if (push >= push_limit) {
				search_cards.push(this.cards[i]);
			}
		}
		
		return search_cards;
	},
	
	/* Число карточек 
	 * @return int
	 * */
	getCountCards: function() {
		return this.cards.length;
	},
	
	/* Валидация карточки 
	 * @return bool
	 * */
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
	
	/* Добавление карточки 
	 * @param object
	 * @return bool
	 * */
	addCard: function(card) {
		try {
			this.validate(card);
			this.cards.push(card);
		} catch(error) {
			throw error;
			return false;
		}
		
		return true;
	},
	
	/* Удаление карточки 
	 * @param object
	 * @return bool
	 * */
	removeCard: function(card) {
		//Удаляем по условиям аналогичным getCards 
	},
	
	/* Сортировка
	 * @return array
	 * */
	sort: function() {
		//Сортированный список карточек
		var sort_cards = new Array();

		var count_cards = this.getCountCards();

		//Проверяем не пустой ли список
		if (count_cards === 0) {
			throw new Exception('Нет карточек');
			return false;
		}
		if (count_cards === 1) {
			return this.cards;
		}
		
		//Ассоциативный массив связей
		depend = {};
		var first_point = 0;
		for(var i=0; i<count_cards; i++) {
			//Регитр для индекса, на который не ссылается ни одна карточка
			var from = 0;

			for(var j=0; j<count_cards; j++) {
				if (j === i) {
					continue;
				}
				
				//Если на карточу ссылаются
				if (this.cards[i]['from'] === this.cards[j]['to']) {
					from = 1;
					depend[j] = {'f':j, 's':i};
				}
			}
			
			if (from === 0) {
				first_point = i;
			}
		}

		var now_point = first_point;
		//Количество всегда на 1 меньше, чем количество карточек
		var depend_length = count_cards - 1;
		for(var i=0; i<depend_length; i++) {
			if (i === 0) {
				//Сохраняем оригинальный индекс для работы с отсортированным списком с доступом к оригинальным
				this.cards[depend[now_point]['f']]['index'] = now_point;
				sort_cards.push(this.cards[depend[now_point]['f']]);
				sort_cards.push(this.cards[depend[now_point]['s']]);
			} else {
				sort_cards.push(this.cards[depend[now_point]['s']]);
			}
			
			now_point = depend[now_point]['s'];
		}
		a = sort_cards;
		return sort_cards;
	},
	
	/* Построить карту путешествия */
	buildTravelCard: function() {
		var count_cards = this.getCountCards();

		console.time("sort");
		var sort_cards = this.sort();
		console.timeEnd("sort");

		var html = '<ul>';
		for(var i=0; i<count_cards; i++) {
			html += "<li>";
			html += "Взять <b>"+sort_cards[i]['transport']+"</b>";
			html += " из <b>"+sort_cards[i]['from']+"</b>";
			html += " в <b>"+sort_cards[i]['to']+".</b>";
			
			if (sort_cards[i]['seat'] && sort_cards[i]['seat'] !== '') {
				html += " Место <b>"+sort_cards[i]['seat']+".</b>";
			} else {
				html += " Место не указано.";
			}
			if (typeof(sort_cards[i]['options']) === 'object') {
				for(var key in sort_cards[i]['options']) {
					if (typeof(sort_cards[i]['options'][key]) !== 'object') {
						continue;
					}
					if (sort_cards[i]['options'][key]['display']) {
						html += " "+sort_cards[i]['options'][key]['name']+" <b>"+sort_cards[i]['options'][key]['description']+".</b>";
					}
				}
			}
			html += "</li>";
		}
		html += "</ul>";
		document.querySelector('#travel2').innerHTML = html;
	}
};
