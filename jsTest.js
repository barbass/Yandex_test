(function(window) {
	var jsTest = function(selector, context) {
		return new jsTest.fn.init(selector, context);
	};
	
	jsTest.fn = jsTest.prototype = {
		length: 0,
		selector: '',
		context: '',
		elements: [],
		
		init: function(selector, context) {
			if (!selector) {
				return this;
			}
			if (selector === 'body' && !context && document.body) {
				this.selector = selector;
				this.context = document;
				this.elements[0] = document.body;
				this.length = 1;
				return this;
			} else if (selector.nodeType) {
				this.context = selector;
				this.length = 1;
				return this;
			} else if (typeof(selector) === 'string') {
				this.context = context || document;
				this.selector = selector;
				if (!context) {
					context = document;
				}
				
				if (context.nodeType) {
					this.elements = context.querySelectorAll(selector);
				} else {
					this.elements = document.querySelectorAll(selector);
				}
				
				this.length = this.elements.length;
				return this;
			} else {
				return null;
			}
		},
		
		hasClass: function(className) {
			var className = " " + className + " ";
			var i = 0;
			for (var i=0; i<this.length; i++) {
				if (this.elements[i].nodeType === 1 && (" " + this.elements[i].className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(className) >= 0) {
					return true;
				}
			}
			return false;
		},
		
		addClass: function(className) {
			if (this.hasClass(className)) {
				return this;
			}
			
			var classes = (className || "").match(/\S+/g) || [];
			var clazz;
			
			for (var i=0; i<this.length; i++) {
				var elem = this.elements[i];
				var cur = (elem.nodeType === 1 && elem.className) ? (" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ") : " ";

				if (cur) {
					var j = 0;
					while((clazz = classes[j++])) {
						if (cur.indexOf( " " + clazz + " " ) < 0) {
							cur += clazz + " ";
						}
					}
					elem.className = cur.trim();
				}
			}
			return this;
		},
		
		removeClass: function(className) {
			if (this.length == 0) {
				return this;
			}
			
			if (!this.hasClass(className)) {
				return this;
			}
			
			var classes = (className || "").match(/\S+/g) || [];
			var clazz;

			for (var i=0; i<this.length; i++) {
					var elem = this.elements[i];
					var cur = (elem.nodeType === 1 &&  elem.className) ? (" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ") : "";

					if (cur) {
						var j = 0;
						while ((clazz = classes[j++])) {
							while (cur.indexOf( " " + clazz + " " ) >= 0 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
						elem.className = className ? cur.trim() : "";
					}
				}

			return this;
		},
		
		css: function(name, value) {
			var vals;
			
			for(var i=0; i<this.length; i++) {
				var elem = this.elements[i];
				if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
					continue;
				}
				if (!value) {
					try {
						if (this.length > 1) {
							vals.push(elem.style[name]);
						} else {
							return elem.style[name];
						}
					} catch(e) {}
				} else {
					try {
						elem.style[name] = value;
					} catch(e) {}
				}
				
			}
			return (vals) ? vals : this;
		},
		
		on: function(type, fn) {
			if (!type || !fn) {
				return this;
			}
			
			for(var i=0; i<this.length; i++) {
				var elem = this.elements[i];
				if (elem.addEventListener) {
					elem.addEventListener(type, fn, false);
				} else {
					continue;
				}
			}
			return this;
		},
		
		off: function(type, fn) {
			if (!type) {
				return this;
			}
			
			for(var i=0; i<this.length; i++) {
				var elem = this.elements[i];
				if (elem.removeEventListener) {
					elem.removeEventListener(type, fn, false);
				} else {
					continue;
				}
			}
			return this;
		},
		
		val: function(value) {
			var vals;
			
			for(var i=0; i<this.length; i++) {
				var elem = this.elements[i];
				if (!elem || elem.nodeType !== 1) {
					continue;
				}
				if (!value) {
					try {
						if (this.length > 1) {
							vals.push(elem.value);
						} else {
							return elem.value;
						}
					} catch(e) {}
				} else {
					try {
						elem.value = value;
					} catch(e) {}
				}
				
			}
			return (vals) ? vals : this;
		},
		
		text: function(value) {
			var vals;
			
			for(var i=0; i<this.length; i++) {
				elem = this.elements[i];
				if (!elem || elem.nodeType !== 1) {
					continue;
				}
				if (!value) {
					try {
						if (this.length > 1) {
							vals.push(elem.textContent);
						} else {
							return elem.textContent;
						}
					} catch(e) {}
				} else {
					try {
						elem.textContent = value;
					} catch(e) {}
				}
				
			}
			return (vals) ? vals : this;
		},
		
		html: function(value) {
			var vals;
			
			for(var i=0; i<this.length; i++) {
				elem = this.elements[i];
				if (!elem || elem.nodeType !== 1) {
					continue;
				}
				if (!value) {
					try {
						if (this.length > 1) {
							vals.push(elem.innerHTML);
						} else {
							return elem.innerHTML;
						}
					} catch(e) {}
				} else {
					try {
						elem.innerHTML = value;
					} catch(e) {}
				}
				
			}
			return (vals) ? vals : this;
		},
		
	};
	
	jsTest.fn.init.prototype = jsTest.fn;
	
	window.jsTest = jsTest;
	
})(window);
