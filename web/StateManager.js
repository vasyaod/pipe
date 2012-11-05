/**
 * https://github.com/vasyaod/pipe
 * Author: vasyaod (vasyaod@mail.ru)
 */

// Проверка существования неймспейса.
if (typeof Pipe == "undefined")
	Pipe = {};

Pipe.StateManager = {

	states: {
		version: 0
	},

	/**
	 * Инициализирует реботу менеджера.
	 */
	init: function () {
		this.load("states.php", true);
	},

	/**
	 * Инициализирует и загружает список прототипов 
	 */
	load: function (url, periodicalRefresh) {
		var self = this;
		$.ajax({
			url: url,
			cache: false,
			dataType: 'json',
			success: function(data) {
				if (data.version > self.states.version) {
					self.states = data;
					self.notify("onStatesChanged", data);

					console.log("Загружено новое состояние системы, версия ("+data.version+").");
				}
				if (periodicalRefresh) {
					var timeoutId = setTimeout(function() {
						clearTimeout(timeoutId);
						self.load(url, true);
					}, 2000);
				}
			},
			error:function(jqXHR, textStatus, errorThrown) {
				alert("Ошибка загрузки состояний: "+textStatus);
			}
		});
	},

	/**
	 * Метод посылает запрос серверу на изменение (переключение) состояния детали.
	 */
	toggleState: function (part) {
		this.load("states.php?action=toggle&partId="+part.id, false);
	},

	/**
	 * Метод возвращает текущее состояние схем.
	 */
	getStates: function() {
		return this.states;
	}
};

// Расширим до Observable.
$.extend(Pipe.StateManager, new Pipe.Observable());