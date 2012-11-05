/**
 * https://github.com/vasyaod/pipe
 * Author: vasyaod (vasyaod@mail.ru)
 */

// Проверка существования неймспейса.
if (typeof Pipe == "undefined")
	Pipe = {};

Pipe.PartPrototypesManager = {

	data: {},
	
	/**
	 * Инициализирует и загружает список прототипов 
	 */
	init: function () {
		var self = this;
		var url = "data/partPrototypes.json";
		$.ajax({
			url: url,
			cache: false,
			dataType: 'json',
			success: function(data) {
				self.data = data;
				self.processing();

				console.log("Загружено прототипов: "+self.data.partPrototypes.length);
				
			},
			error:function(jqXHR, textStatus, errorThrown) {
				alert("Ошибка загрузки списка прототипов"+textStatus);
			}
		});
	},

	_initPrototype: function (partPrototype) {
		partPrototype.getDefaultState = function(){
			return partPrototype.states[partPrototype.defaultState];
		}

		partPrototype.getStateByName = function(stateName){
			return partPrototype.states[stateName];
		}
	},

	/**
	 * Метод обрабатывает загруженные данные.
	 */
	processing: function () {
		var self = this;

		$.each(this.data.partPrototypes, function(index, partPrototype) {
			self._initPrototype(partPrototype);
		});

		this.onLoaded();
	},
	
	/**
	 * Возвращает прототип части по его id.
	 */
	getPartPrototypeById: function(id) {
		var res = null;
		$.each(this.data.partPrototypes, function(index, partPrototype) {
			if (partPrototype.id == id) {
				res = partPrototype;
			}
		});
		return res;
	},

	/**
	 * Метод возвращает список прототипов.
	 */
	getPartPrototypes: function() {
		return this.data.partPrototypes;
	},

	/**
	 * Событие, срабатывает после загрузки списка.
	 */
	onLoaded: function() {}
};

